import { Provider, ProviderId } from "./model/provider"

export interface ProviderRepository {
  nextId(): Promise<ProviderId>
  all(): Promise<Provider[]>
  ofId(id: string): Promise<Provider | null>
  save(provider: Provider): Promise<void>
}
