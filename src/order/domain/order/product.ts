import { Entity } from "entity"

interface ProductProps {
  id: string
  amount: number
  note: string
}

export class Product {
  private props: ProductProps
  constructor(props: ProductProps) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  get amount(): number {
    return this.props.amount
  }

  increase(amount: number) {
    this.props = {
      ...this.props,
      amount: this.props.amount + amount
    }
  }

  decrease(amount: number) {
    this.props = {
      ...this.props,
      amount: this.props.amount - amount
    }
  }
}
