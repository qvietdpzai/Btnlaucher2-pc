import type { SharedState } from '../util/SharedState'
import type { Btnlauncher2AccountState, Btnlauncher2OAuthProvider } from '../entities/btnlauncher2Account'
import type { ServiceKey } from './Service'

export type Btnlauncher2MicrosoftBootstrapResult = 'bootstrapped' | 'pending-consent' | 'not-applicable'

export interface Btnlauncher2AccountService {
  getBtnlauncher2AccountState(): Promise<SharedState<Btnlauncher2AccountState>>
  refreshAccount(): Promise<void>
  bootstrapMicrosoft(userId: string): Promise<Btnlauncher2MicrosoftBootstrapResult>
  bootstrapModrinth(): Promise<void>
  authorizeProvider(provider: Extract<Btnlauncher2OAuthProvider, 'google' | 'discord'>): Promise<void>
  prepareMerge(): Promise<void>
  confirmMerge(): Promise<void>
  refreshSession(): Promise<void>
  revokeSession(allDevices?: boolean): Promise<void>
}

export const Btnlauncher2AccountServiceKey: ServiceKey<Btnlauncher2AccountService> = 'Btnlauncher2AccountService'
