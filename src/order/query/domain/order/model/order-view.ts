import { ProductView } from "./product"

export interface OrderView {
  createdBy: string
  orderProducts: ProductView[]
  status: string
  takeOutId: string
}
