import { Entity } from "entity"
import { EntityId } from "entity-id"
import { CreatedByNotValid } from "../error/created-by-not-valid"
import { OrderNotPended } from "../error/order-not-pended"
import { OrderNotPlaced } from "../error/order-not-placed"
import { Product } from "./product"
import { ProductNotOrdered } from "../error/product-not-ordered"
import { ProductIsEmpty } from "../error/product-is-empty"
import { OrderEvent } from "./event/order-event"
import { AggregateRoot } from "aggregate-root"
import { PlacedOrder } from "./event/placed-order"
import { AppendedProduct } from "./event/appended-product"
import { CanceledOrder } from "./event/canceled-order"
import { DecreasedProductAmount } from "./event/decreased-product-amount"
import { IncreasedProductAmount } from "./event/increased-product-amount"
import { RemovedProduct } from "./event/removed-product"

export class OrderId extends EntityId {}

interface OrderProps {
  createdBy: string
  products: Product[]
  status: OrderStatus
  takeOutId: string
}

export enum OrderStatus {
  pended,
  placed,
  canceled
}

export class Order extends AggregateRoot<OrderEvent> {
  private props: OrderProps
  constructor(
    id: OrderId,
    propsInput: {
      createdBy: string
      products: Product[]
      status: OrderStatus
      takeOutId: string
    }
  ) {
    super(id)
    const { createdBy } = propsInput
    if (!createdBy) {
      throw new CreatedByNotValid("userId empty.")
    }
    this.props = { ...propsInput }
  }

  get products(): Product[] {
    return [...this.props.products]
  }

  get createdBy(): string {
    return this.props.createdBy
  }

  get status(): OrderStatus {
    return this.props.status
  }

  get takeOutId(): string {
    return this.props.takeOutId
  }

  mutate(events: OrderEvent[], version: number): void {
    this.assignEvents(events)
    this.assignVersion(version)
    events.forEach(e => {
      switch (e.name) {
        case AppendedProduct.name:
          this.whenAppendedProduct(new Product((e as AppendedProduct).product))
          break
        case CanceledOrder.name:
          this.whenCanceled()
          break
        case DecreasedProductAmount.name:
          this.whenDecreaseProductAmouint((e as DecreasedProductAmount).payload)
          break
        case IncreasedProductAmount.name:
          this.whenIncreasedProductAmount((e as IncreasedProductAmount).payload)
          break
        case PlacedOrder.name:
          this.whenPlaced()
          break
        case RemovedProduct.name:
          this.whenRemovedProduct((e as RemovedProduct).payload)
          break
      }
    })
  }

  appendProduct(product: Product): void {
    this.pushEvent(
      new AppendedProduct({
        id: product.id,
        amount: product.amount,
        note: product.note
      })
    )
    this.whenAppendedProduct(product)
  }

  private whenAppendedProduct(product: Product): void {
    const { products } = this.props

    if (this.isProductExists(product.id)) {
      this.whenIncreasedProductAmount({
        productId: product.id,
        amount: product.amount
      })
      return
    }

    const newProducts = [...products]
    newProducts.push(product)
    this.props.products = newProducts
  }

  place(): void {
    this.pushEvent(new PlacedOrder())
    this.whenPlaced()
  }

  private whenPlaced(): void {
    if (this.props.products.length === 0) {
      throw new ProductIsEmpty(``)
    }

    if (this.props.status === OrderStatus.placed) {
      return
    }

    if (this.props.status === OrderStatus.pended) {
      this.props.status = OrderStatus.placed
      return
    }
    throw new OrderNotPended(`status : ${this.props.status}`)
  }

  cancel(): void {
    this.pushEvent(new CanceledOrder())
    this.whenCanceled()
  }

  private whenCanceled(): void {
    if (this.props.status === OrderStatus.canceled) {
      return
    }

    if (this.props.status === OrderStatus.placed) {
      this.props.status = OrderStatus.canceled
      return
    }
    throw new OrderNotPlaced(`status: ${this.props.status}`)
  }

  increaseProductAmount(input: { productId: string; amount: number }): void {
    this.pushEvent(new IncreasedProductAmount(input))
    this.whenIncreasedProductAmount(input)
  }

  private whenIncreasedProductAmount(input: {
    productId: string
    amount: number
  }): void {
    const { productId, amount } = input
    const { products } = this.props
    const foundProduct = products.find(elem => {
      return elem.id === productId
    })

    if (foundProduct) {
      foundProduct.increase(amount)
      return
    }

    throw new ProductNotOrdered(`${productId}`)
  }

  decreaseProductAmount(input: { productId: string; amount: number }): void {
    this.pushEvent(new DecreasedProductAmount(input))
    this.whenDecreaseProductAmouint(input)
  }

  private whenDecreaseProductAmouint(input: {
    productId: string
    amount: number
  }): void {
    const { productId, amount } = input
    const { products: products } = this.props
    const foundProduct = products.find(elem => {
      return elem.id === productId
    })

    if (foundProduct && foundProduct.amount === amount) {
      this.removeProduct({ productId })
      return
    }

    if (foundProduct) {
      foundProduct.decrease(amount)
      return
    }

    throw new ProductNotOrdered(`${productId}`)
  }

  removeProduct(input: { productId: string }): void {
    this.pushEvent(new RemovedProduct(input))
    this.whenRemovedProduct(input)
  }

  private whenRemovedProduct(input: { productId: string }): void {
    const { productId } = input
    const { products: products } = this.props
    const foundIndex = products.findIndex(elem => {
      return elem.id === productId
    })
    if (foundIndex < 0) {
      return
    }
    products.splice(foundIndex, 1)
  }

  isOwnedBy(userId: string): boolean {
    return this.props.createdBy === userId
  }

  isProductExists(productId: string): boolean {
    const index = this.products.findIndex(p => {
      console.log(`WTF ${p.id === productId}, ${p.id} ${productId}`)
      return p.id === productId
    })
    return index > -1
  }

  appendTo(takeOutId: string) {
    this.props = {
      ...this.props,
      takeOutId
    }
  }
}
