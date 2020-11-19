import { OrderId } from "../model/order"
import { OrderRepository } from "../model/order-repository"

export const makeUpdateProduct: (depends: {
  orderRepository: OrderRepository
}) => (input: {
  id: OrderId
  index: number
  amount: number
  note: string
}) => Promise<void> = ({ orderRepository }) => {
  return async ({ id, index, amount, note }) => {
    const order = await orderRepository.ofId(id)
    order.updateProduct({ index, amount, note })

    await orderRepository.save(order)
  }
}
