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
import { RemovedProduct } from "./event/removed-product"
import { UpdateProduct } from "./event/update-product"
import { DomainError } from "domain-error"

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
      throw new CreatedByNotValid("createdBy  empty.")
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
        case PlacedOrder.name:
          this.whenPlaced()
          break
        case RemovedProduct.name:
          this.whenRemovedProduct((e as RemovedProduct).payload)
          break
        case UpdateProduct.name:
          this.whenUpdateProduct((e as UpdateProduct).payload)
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

  updateProduct({
    index,
    amount,
    note
  }: {
    index: number
    amount: number
    note: string
  }): void {
    this.pushEvent(
      new UpdateProduct({
        index,
        amount,
        note
      })
    )
    this.whenUpdateProduct({ index, amount, note })
  }

  private whenUpdateProduct({
    index,
    amount,
    note
  }: {
    index: number
    amount: number
    note: string
  }): void {
    const { products } = this.props

    const product = products[index]

    if (!product) {
      throw new DomainError({
        message: "product not found.",
        payload: {
          index,
          amount,
          note
        }
      })
    }

    products[index] = new Product({
      id: product.id,
      amount,
      note
    })

    console.log(products)

    this.props = {
      ...this.props,
      products: [...products]
    }
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

  removeProduct(input: { index: number }): void {
    this.pushEvent(new RemovedProduct(input))
    this.whenRemovedProduct(input)
  }

  private whenRemovedProduct({ index }: { index: number }): void {
    const { products } = this.props

    const foundProduct = products[index]

    if (foundProduct) {
      products.splice(index, 1)
      return
    }
  }

  isOwnedBy(userId: string): boolean {
    return this.props.createdBy === userId
  }

  isProductExists(productId: string): boolean {
    const index = this.products.findIndex(p => {
      return p.id === productId
    })
    return index > -1
  }

  appendTo(takeOutId: string): void {
    this.props = {
      ...this.props,
      takeOutId
    }
  }
}
