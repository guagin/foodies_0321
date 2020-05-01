import { ProductView } from "./product"

export interface OrderView {
  id: string
  createdBy: string
  orderProducts: ProductView[]
  status: number
  takeOutId: string
}
