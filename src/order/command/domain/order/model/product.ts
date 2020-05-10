import { AmountIsZero } from "../error/amount-is-zero"
import { AmountIsFloat as AmountIsNotInteger } from "../error/amount-is-float"
import { AmountIsNegtaive } from "../error/amount-is-negative-integer"
import { AmountIsGreaterThanProductAmount } from "../error/amount-is-greater-than-product-amount"

interface ProductProps {
  id: string
  amount: number
  note: string
}
const checkAmount: (amount: number) => void = amount => {
  if (amount === 0) {
    throw new AmountIsZero("")
  }

  if (!Number.isInteger(amount)) {
    throw new AmountIsNotInteger(`amount: ${amount}`)
  }

  if (amount < 0) {
    throw new AmountIsNegtaive("")
  }
}
export class Product {
  private props: ProductProps
  constructor(props: ProductProps) {
    const { amount } = props
    checkAmount(amount)
    this.props = props
  }

  get id(): string {
    return this.props.id
  }

  get amount(): number {
    return this.props.amount
  }

  get note(): string {
    return this.props.note
  }

  increase(amount: number) {
    checkAmount(amount)
    this.props = {
      ...this.props,
      amount: this.props.amount + amount
    }
  }

  decrease(amount: number) {
    checkAmount(amount)
    if (this.props.amount - amount <= 0) {
      throw new AmountIsGreaterThanProductAmount("")
    }
    this.props = {
      ...this.props,
      amount: this.props.amount - amount
    }
  }
}
