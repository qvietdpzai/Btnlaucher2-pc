import { createHash } from 'crypto'
import type { Btnlauncher2OAuthProvider } from '@btnlauncher2/runtime-api'

export class ProviderCredentialExchangeCache {
  private readonly transactions = new Set<string>()

  has(provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>, credential: string) {
    return this.transactions.has(this.key(provider, credential))
  }

  remember(provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>, credential: string) {
    this.transactions.add(this.key(provider, credential))
  }

  clear() {
    this.transactions.clear()
  }

  private key(provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>, credential: string) {
    return `${provider}:${createHash('sha256').update(credential).digest('hex')}`
  }
}
