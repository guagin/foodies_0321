import { Status } from "./status"

export interface BaseHttpResponse<Data> {
  status: Status
  data?: Data
}
