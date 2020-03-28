import { Entity } from "entity"
import { EntityId } from "entity-id"
import { CreatedByNotValid } from "./error/created-by-not-valid"
import { OrderNotPended } from "./error/order-not-pended"
import { OrderNotPlaced } from "./error/order-not-placed"
import { Product } from "./product"
import { ProductNotOrdered } from "./error/product-not-ordered"

export class OrderId extends EntityId {}

interface OrderProps {
  createdBy: string
  orderedProducts: Product[]
  status: OrderStatus
}
export enum OrderStatus {
  pended,
  placed,
  canceled
}

export class Order extends Entity {
  private props: OrderProps
  constructor(
    id: OrderId,
    propsInput: {
      createdBy: string
      orderedProducts: Product[]
      status: OrderStatus
    }
  ) {
    super(id)
    const { createdBy } = propsInput
    if (!createdBy) {
      throw new CreatedByNotValid("create empty.")
    }
    this.props = { ...propsInput }
  }

  get product(): Product[] {
    return this.props.orderedProducts
  }

  place(): void {
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
    if (this.props.status === OrderStatus.canceled) {
      return
    }

    if (this.props.status === OrderStatus.placed) {
      this.props.status = OrderStatus.canceled
      return
    }
    throw new OrderNotPlaced(`status: ${this.props.status}`)
  }

  appendProduct(product: Product): void {
    const { orderedProducts } = this.props
    const foundIndex = orderedProducts.findIndex(elem => {
      return elem.id === product.id
    })
    if (foundIndex) {
      return
    }
    const newProducts = [...orderedProducts]
    newProducts.push(product)
    this.props.orderedProducts = newProducts
  }

  increateProductAmount(productId: string, amount: number): void {
    const { orderedProducts } = this.props
    const foundProduct = orderedProducts.find(elem => {
      return elem.id === productId
    })

    if (foundProduct) {
      foundProduct.increase(amount)
      return
    }

    throw new ProductNotOrdered(`${productId}`)
  }

  decreaseProductAmount(productId: string, amount: number): void {
    const { orderedProducts } = this.props
    const foundProduct = orderedProducts.find(elem => {
      return elem.id === productId
    })

    if (foundProduct) {
      foundProduct.decrease(amount)
      return
    }

    throw new ProductNotOrdered(`${productId}`)
  }

  removeProduct(productId: string): void {
    const { orderedProducts } = this.props
    const foundIndex = orderedProducts.findIndex(elem => {
      return elem.id === productId
    })
    if (!foundIndex) {
      return
    }
    orderedProducts.splice(foundIndex, 1)
  }
}
