import { AUTHORITY_MICROSOFT, type UserProfile } from '@btnlauncher2/runtime-api'
import { EventEmitter } from 'events'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  type ExternalCredentialChange,
  ExternalCredentialService,
} from '../credential/ExternalCredentialService'
import { Btnlauncher2AccountService } from './Btnlauncher2AccountService'
import { pluginBtnlauncher2AccountMicrosoftBridge } from './pluginBtnlauncher2AccountMicrosoftBridge'

vi.mock('./Btnlauncher2AccountService', () => ({
  Btnlauncher2AccountService: class Btnlauncher2AccountService {},
}))

vi.mock('../user/UserService', () => ({
  UserService: class UserService {},
}))

const microsoftUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'microsoft-user-id',
  username: 'player@example.com',
  authority: AUTHORITY_MICROSOFT,
  invalidated: false,
  expiredAt: Date.now() + 60_000,
  profiles: {},
  selectedProfile: '',
  ...overrides,
})

class CredentialLifecycle {
  private listener: ((change: ExternalCredentialChange) => void) | undefined

  onCredentialChange = vi.fn((listener: (change: ExternalCredentialChange) => void) => {
    this.listener = listener
    return () => {
      this.listener = undefined
    }
  })

  emit(change: ExternalCredentialChange) {
    this.listener?.(change)
  }
}

function createApp(
  users: Record<string, UserProfile> = {},
  bootstrap = vi.fn().mockResolvedValue(undefined),
) {
  const logger = { warn: vi.fn() }
  const userService = Object.assign(new EventEmitter(), {
    getUserState: vi.fn().mockResolvedValue({ users }),
  })
  const credentials = new CredentialLifecycle()
  const app = Object.assign(new EventEmitter(), {
    registry: {
      get: vi.fn().mockResolvedValue(userService),
      getOrCreate: vi.fn((service) => {
        if (service === ExternalCredentialService) return Promise.resolve(credentials)
        if (service === Btnlauncher2AccountService)
          return Promise.resolve({ bootstrapMicrosoft: bootstrap })
        throw new Error('unexpected service')
      }),
    },
    getLogger: vi.fn().mockReturnValue(logger),
  })
  return { app, bootstrap, credentials, logger }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Btnlauncher2 Microsoft bridge', () => {
  it('bridges a Microsoft lifecycle notification once using its persisted profile id', async () => {
    const { app, bootstrap, credentials } = createApp()
    pluginBtnlauncher2AccountMicrosoftBridge(app as any, {} as any)
    await vi.waitFor(() => expect(credentials.onCredentialChange).toHaveBeenCalledTimes(1))

    credentials.emit({
      provider: 'microsoft',
      type: 'microsoft-authenticated',
      occurredAt: Date.now(),
      subject: 'persisted-microsoft-id',
    })

    await vi.waitFor(() => {
      expect(bootstrap).toHaveBeenCalledTimes(1)
      expect(bootstrap).toHaveBeenCalledWith('persisted-microsoft-id')
    })
  })

  it('does not fail the lifecycle notification when btnlauncher2 bootstrap fails', async () => {
    const bootstrap = vi.fn().mockRejectedValue(new Error('btnlauncher2 bootstrap failed'))
    const { app, credentials, logger } = createApp({}, bootstrap)
    pluginBtnlauncher2AccountMicrosoftBridge(app as any, {} as any)
    await vi.waitFor(() => expect(credentials.onCredentialChange).toHaveBeenCalledTimes(1))

    expect(() =>
      credentials.emit({
        provider: 'microsoft',
        type: 'microsoft-authenticated',
        occurredAt: Date.now(),
        subject: 'microsoft-user-id',
      }),
    ).not.toThrow()

    await vi.waitFor(() => {
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed to bootstrap btnlauncher2 Btnlauncher2 account from Microsoft authentication; retrying later.',
        expect.any(Error),
      )
    })
  })

  it('bridges only valid cached Microsoft users during startup', async () => {
    const valid = microsoftUser({ id: 'cached-microsoft-id' })
    const { app, bootstrap } = createApp({
      [valid.id]: valid,
      invalidated: microsoftUser({ id: 'invalidated-microsoft-id', invalidated: true }),
      expired: microsoftUser({ id: 'expired-microsoft-id', expiredAt: Date.now() - 1 }),
      custom: microsoftUser({ id: 'custom-user-id', authority: 'https://authserver.example.com' }),
    })

    pluginBtnlauncher2AccountMicrosoftBridge(app as any, {} as any)

    await vi.waitFor(() => {
      expect(bootstrap).toHaveBeenCalledTimes(1)
      expect(bootstrap).toHaveBeenCalledWith('cached-microsoft-id')
    })
  })
})
