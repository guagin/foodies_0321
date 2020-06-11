import { Provider } from "./model/provider"

export interface ProviderRepository {
  all(): Promise<Provider[]>
  ofId(id: string): Promise<Provider | null>
  save(provider: Provider): Promise<void>
}
