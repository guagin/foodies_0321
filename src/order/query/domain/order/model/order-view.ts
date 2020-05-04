import { ProductView } from "./product"

export interface OrderView {
  id: string
  createdBy: string
  products: ProductView[]
  status: number
  takeOutId: string
}
