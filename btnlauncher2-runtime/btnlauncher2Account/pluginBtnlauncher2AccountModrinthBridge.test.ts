import { EventEmitter } from 'events'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  type ExternalCredentialAccessTokenResult,
  type ExternalCredentialChange,
  ExternalCredentialService,
} from '../credential/ExternalCredentialService'
import { Btnlauncher2AccountService } from './Btnlauncher2AccountService'
import { pluginBtnlauncher2AccountModrinthBridge } from './pluginBtnlauncher2AccountModrinthBridge'

vi.mock('./Btnlauncher2AccountService', () => ({
  Btnlauncher2AccountService: class Btnlauncher2AccountService {},
}))

class CredentialLifecycle {
  private listener: ((change: ExternalCredentialChange) => void) | undefined
  getValidAccessToken = vi.fn()

  constructor(result: ExternalCredentialAccessTokenResult) {
    this.getValidAccessToken.mockResolvedValue(result)
  }

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
  token: ExternalCredentialAccessTokenResult = { status: 'missing' },
  bootstrap = vi.fn().mockResolvedValue(undefined),
) {
  const logger = { warn: vi.fn() }
  const credentials = new CredentialLifecycle(token)
  const app = Object.assign(new EventEmitter(), {
    registry: {
      getOrCreate: vi.fn((service) => {
        if (service === ExternalCredentialService) return Promise.resolve(credentials)
        if (service === Btnlauncher2AccountService) return Promise.resolve({ bootstrapModrinth: bootstrap })
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

describe('Btnlauncher2 Modrinth bridge', () => {
  it('bridges one stored credential signal exactly once', async () => {
    const { app, bootstrap, credentials } = createApp()
    pluginBtnlauncher2AccountModrinthBridge(app as any, {} as any)
    await vi.waitFor(() => expect(credentials.onCredentialChange).toHaveBeenCalledTimes(1))

    const change: ExternalCredentialChange = {
      provider: 'modrinth',
      type: 'stored',
      occurredAt: Date.now(),
    }
    credentials.emit(change)
    credentials.emit(change)

    await vi.waitFor(() => expect(bootstrap).toHaveBeenCalledTimes(1))
  })

  it('keeps credential changes nonblocking when btnlauncher2 bootstrap fails', async () => {
    const bootstrap = vi.fn().mockRejectedValue(new Error('btnlauncher2 bootstrap failed'))
    const { app, credentials, logger } = createApp({ status: 'missing' }, bootstrap)
    pluginBtnlauncher2AccountModrinthBridge(app as any, {} as any)
    await vi.waitFor(() => expect(credentials.onCredentialChange).toHaveBeenCalledTimes(1))

    expect(() =>
      credentials.emit({
        provider: 'modrinth',
        type: 'stored',
        occurredAt: Date.now(),
      }),
    ).not.toThrow()

    await vi.waitFor(() => {
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed to bootstrap btnlauncher2 Btnlauncher2 account from Modrinth authentication; retrying later.',
        expect.any(Error),
      )
    })
  })

  it('bridges a valid credential found during startup', async () => {
    const { app, bootstrap } = createApp({
      status: 'valid',
      accessToken: 'cached-modrinth-access-token',
    })

    pluginBtnlauncher2AccountModrinthBridge(app as any, {} as any)

    await vi.waitFor(() => expect(bootstrap).toHaveBeenCalledTimes(1))
  })
})
