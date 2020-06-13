import { ProviderView } from "./provider-view"

export interface ProviderViewRepository {
  ofId(id: string): Promise<ProviderView | null>
  ofIds(ids: string[]): Promise<ProviderView[]>
  ofCreatedBy(userid: string): Promise<ProviderView[]>
  ofPage(input: {
    toPage: number
    count: number
  }): Promise<{
    providers: ProviderView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }>
  save(provider: ProviderView): Promise<void>
}
