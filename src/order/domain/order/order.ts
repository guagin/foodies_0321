import { Entity } from "entity"
import { EntityId } from "entity-id"
import { CreatedByNotValid } from "./error/created-by-not-valid"
import { OrderNotPended } from "./error/order-not-pended"
import { OrderNotPlaced } from "./error/order-not-placed"

export class OrderId extends EntityId {}

interface OrderProps {
  createdBy: string
  orderedProducts: OrderedProduct[]
  status: OrderStatus
}

interface OrderedProduct {
  id: string
  amount: number
  note: string
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
      orderedProducts: OrderedProduct[]
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

  addProduct(): void {}

  removeProduct(): void {}
}
