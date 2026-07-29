import {
  AUTHORITY_MICROSOFT,
  Btnlauncher2AccountServiceKey,
  Btnlauncher2AccountState,
  type Btnlauncher2AccountSnapshot,
  type Btnlauncher2OAuthProvider,
  type Btnlauncher2AccountService as IBtnlauncher2AccountService,
  type Btnlauncher2MicrosoftBootstrapResult,
  type SharedState,
} from '@btnlauncher2/runtime-api'
import { createHash, randomBytes } from 'crypto'
import { Inject, LauncherApp, LauncherAppKey } from '~/app'
import { resolveBtnlauncher2ApiBaseUrl } from '~/app/btnlauncher2ApiBaseUrl'
import { ExternalCredentialService } from '~/credential/ExternalCredentialService'
import { ExposeServiceKey, ServiceStateManager, Singleton, StatefulService } from '~/service'
import { UserService } from '~/user'
import { kFlights } from '~/infra'
import {
  MICROSOFT_GRAPH_USER_READ_SCOPE,
  MicrosoftOAuthClient,
} from '~/user/accountSystems/MicrosoftOAuthClient'
import {
  Btnlauncher2AccountApi,
  Btnlauncher2AccountApiError,
  type Btnlauncher2AuthResult,
  type Btnlauncher2SessionCredential,
  toSessionSummary,
} from './Btnlauncher2AccountApi'
import { ProviderCredentialExchangeCache } from './ProviderCredentialExchangeCache'

const MICROSOFT_LAUNCHER_CLIENT_ID = '1363d629-5b06-48a9-a5fb-c65de945f13e'
const SESSION_SERVICE = 'btnlauncher2-btnlauncher2-account'
const SESSION_ACCOUNT = 'current-session'
const BROWSER_AUTH_TIMEOUT = 5 * 60 * 1000

interface StoredBtnlauncher2Session {
  credential: Btnlauncher2SessionCredential
  snapshot: Btnlauncher2AccountSnapshot
}

interface PendingBrowserAuthorization {
  resolve(code: string): void
  reject(error: Error): void
}

interface PendingMergeCredential {
  provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>
  credential: string
  completedAt: string
}

export interface Btnlauncher2SessionAuthorization {
  readonly accessToken: string
}

/**
 * Internal-only session accessor. A symbol prevents the generic renderer
 * service-call transport from resolving a method that returns token material.
 */
export const kBtnlauncher2SessionAuthorization = Symbol('btnlauncher2-session-authorization')

@ExposeServiceKey(Btnlauncher2AccountServiceKey)
export class Btnlauncher2AccountService
  extends StatefulService<Btnlauncher2AccountState>
  implements IBtnlauncher2AccountService
{
  private readonly api: Btnlauncher2AccountApi
  private credential: Btnlauncher2SessionCredential | undefined
  private pendingMergeCredential: PendingMergeCredential | undefined
  private readonly exchangedProviderTransactions = new ProviderCredentialExchangeCache()
  private readonly pendingBrowserAuthorizations = new Map<string, PendingBrowserAuthorization>()
  private providerBootstrapQueue: Promise<void> = Promise.resolve()

  constructor(
    @Inject(LauncherAppKey) app: LauncherApp,
    @Inject(ExternalCredentialService) private externalCredentials: ExternalCredentialService,
    @Inject(ServiceStateManager) store: ServiceStateManager,
  ) {
    super(
      app,
      () => store.registerStatic(new Btnlauncher2AccountState(), Btnlauncher2AccountServiceKey),
      () => this.restore(),
    )
    this.api = new Btnlauncher2AccountApi(
      (input, init) => app.fetch(input, init),
      async () => {
        const flights = await app.registry.get(kFlights)
        return resolveBtnlauncher2ApiBaseUrl(flights.btnlauncher2ApiBaseUrl, app.getLogger('ApiBaseUrl'))
      },
    )

    app.protocol.registerHandler('btnlauncher2', ({ request, response }) => {
      if (request.url.host !== 'launcher' || request.url.pathname !== '/btnlauncher2-auth') return
      const state = request.url.searchParams.get('state') ?? ''
      const pending = this.pendingBrowserAuthorizations.get(state)
      if (!pending) {
        response.status = 400
        return
      }
      const error = request.url.searchParams.get('error')
      const code = request.url.searchParams.get('code')
      if (error || !code) {
        pending.reject(new Error(error || 'authorization_callback_invalid'))
      } else {
        pending.resolve(code)
      }
      response.status = 200
      response.headers = { 'Content-Type': 'text/html' }
      response.body = app.controller.getLoginSuccessHTML()
    })
  }

  async getBtnlauncher2AccountState(): Promise<SharedState<Btnlauncher2AccountState>> {
    await this.initialize()
    return this.state
  }

  async [kBtnlauncher2SessionAuthorization](): Promise<Btnlauncher2SessionAuthorization | undefined> {
    await this.initialize()
    return this.credential && { accessToken: this.credential.accessToken }
  }

  @Singleton()
  async refreshAccount(): Promise<void> {
    await this.initialize()
    const credential = this.requireCredential()
    await this.applySnapshot(await this.api.getSnapshot(credential), credential)
  }

  @Singleton((userId) => userId)
  async bootstrapMicrosoft(userId: string): Promise<Btnlauncher2MicrosoftBootstrapResult> {
    await this.initialize()
    const userState = await this.app.registry
      .get(UserService)
      .then((service) => service.getUserState())
    const user = userState.users[userId]
    if (!user || user.authority !== AUTHORITY_MICROSOFT || user.invalidated) {
      return 'not-applicable'
    }

    const oauthClient = new MicrosoftOAuthClient(
      (...args) => this.app.fetch(...args),
      this.app.getLogger('Btnlauncher2MicrosoftIdentity'),
      MICROSOFT_LAUNCHER_CLIENT_ID,
      async () => {
        throw new Error('interactive_microsoft_auth_not_allowed')
      },
      async () => {
        throw new Error('interactive_microsoft_auth_not_allowed')
      },
      () => {},
      this.app.secretStorage,
      () => this.app.controller.getNativeWindowHandle?.(),
    )
    let result: { accessToken: string }
    try {
      ;({ result } = await oauthClient.authenticate(
        user.username,
        [MICROSOFT_GRAPH_USER_READ_SCOPE],
        {
          slientOnly: true,
          useNativeBroker: process.platform === 'win32',
        },
      ))
    } catch (error) {
      if (error instanceof Error && error.name === 'MicrosoftOAuthSlientFailed') {
        this.warn('Btnlauncher2 account bridge is waiting for Microsoft Graph consent.')
        return 'pending-consent'
      }
      throw error
    }
    await this.bootstrapCredential('microsoft', result.accessToken)
    return 'bootstrapped'
  }

  @Singleton()
  async bootstrapModrinth(): Promise<void> {
    await this.initialize()
    const credential = await this.externalCredentials.getValidAccessToken('modrinth')
    if (credential.status !== 'valid') return
    await this.bootstrapCredential('modrinth', credential.accessToken)
  }

  @Singleton((provider) => provider)
  async authorizeProvider(
    provider: Extract<Btnlauncher2OAuthProvider, 'google' | 'discord'>,
  ): Promise<void> {
    await this.initialize()
    const verifier = toBase64Url(randomBytes(32))
    const state = toBase64Url(randomBytes(32))
    const codeChallenge = toBase64Url(createHash('sha256').update(verifier).digest())
    const redirectUri = `http://127.0.0.1:${await this.app.serverPort}/btnlauncher2-auth`
    const authorization = await (
      await this.api
    ).beginBrowserAuthorization(
      provider,
      {
        state,
        redirectUri,
        codeChallenge,
      },
      this.credential,
    )
    const code = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingBrowserAuthorizations.delete(state)
        reject(new Error('authorization_timeout'))
      }, BROWSER_AUTH_TIMEOUT)
      this.pendingBrowserAuthorizations.set(state, {
        resolve: (value) => {
          clearTimeout(timer)
          this.pendingBrowserAuthorizations.delete(state)
          resolve(value)
        },
        reject: (error) => {
          clearTimeout(timer)
          this.pendingBrowserAuthorizations.delete(state)
          reject(error)
        },
      })
      this.app.shell.openInBrowser(authorization.authorizationUrl)
    })

    const result = await (
      await this.api
    ).exchangeBrowser(
      {
        provider,
        transactionId: authorization.transactionId,
        code,
        state,
        codeVerifier: verifier,
        redirectUri,
      },
      this.credential,
    )
    await this.applyAuthResult(result)
  }

  @Singleton()
  async prepareMerge(): Promise<void> {
    await this.initialize()
    if (!this.pendingMergeCredential) {
      throw new Error('btnlauncher2_account_merge_reauthentication_required')
    }
    const preview = await (
      await this.api
    ).prepareMerge(this.requireCredential(), this.pendingMergeCredential)
    this.state.mergePrepared(preview)
  }

  @Singleton()
  async confirmMerge(): Promise<void> {
    await this.initialize()
    const mergeId = this.state.mergePreview?.mergeId
    if (!mergeId) throw new Error('btnlauncher2_account_merge_not_prepared')
    const taskId = await this.api.confirmMerge(this.requireCredential(), mergeId)
    this.state.mergeQueued(taskId)
  }

  @Singleton()
  async refreshSession(): Promise<void> {
    await this.initialize()
    const next = await this.api.refreshSession(this.requireCredential())
    // Refresh-token rotation is already committed server-side when this call
    // resolves. Persist the new credential before any optional account read so
    // a later snapshot failure cannot leave the client retrying the consumed
    // token and revoking its session family.
    await this.applySnapshot(this.currentSnapshot(next), next)
    try {
      await this.applySnapshot(await this.api.getSnapshot(next), next)
    } catch {
      this.warn('Btnlauncher2 session refreshed; account snapshot refresh will retry later.')
    }
  }

  @Singleton()
  async revokeSession(allDevices = false): Promise<void> {
    await this.initialize()
    await this.api.revokeSession(this.requireCredential(), allDevices)
    await this.clearSession()
  }

  private async bootstrapCredential(
    provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>,
    providerCredential: string,
  ) {
    return this.enqueueProviderBootstrap(async () => {
      if (this.exchangedProviderTransactions.has(provider, providerCredential)) return

      try {
        const currentCredential =
          this.credential && Date.parse(this.credential.expiresAt) > Date.now()
            ? this.credential
            : undefined
        const result = await (
          await this.api
        ).launcherExchange(provider, providerCredential, currentCredential)
        this.exchangedProviderTransactions.remember(provider, providerCredential)
        await this.applyAuthResult(result)
      } catch (error) {
        if (error instanceof Btnlauncher2AccountApiError && error.code === 'identity_conflict') {
          this.exchangedProviderTransactions.remember(provider, providerCredential)
          this.pendingMergeCredential = {
            provider,
            credential: providerCredential,
            completedAt: new Date().toISOString(),
          }
          this.state.identityConflict({ provider, mergeId: error.mergeId })
          return
        }
        this.recordError(error)
        throw error
      }
    })
  }

  private enqueueProviderBootstrap(work: () => Promise<void>) {
    const queued = this.providerBootstrapQueue.then(work, work)
    this.providerBootstrapQueue = queued.catch(() => {})
    return queued
  }

  private async applyAuthResult(result: Btnlauncher2AuthResult) {
    const snapshot: Btnlauncher2AccountSnapshot = {
      account: result.account,
      identities: result.identities ?? this.state.identities,
      session: toSessionSummary(result.session),
    }
    await this.applySnapshot(snapshot, result.session)
  }

  private async applySnapshot(snapshot: Btnlauncher2AccountSnapshot, credential: Btnlauncher2SessionCredential) {
    const stored: StoredBtnlauncher2Session = { credential, snapshot }
    await this.app.secretStorage.put(SESSION_SERVICE, SESSION_ACCOUNT, JSON.stringify(stored))
    this.credential = credential
    this.state.snapshot(snapshot)
  }

  private currentSnapshot(credential: Btnlauncher2SessionCredential): Btnlauncher2AccountSnapshot {
    return {
      account: this.state.account,
      identities: this.state.identities,
      session: toSessionSummary(credential),
      backupStoragePolicy: this.state.backupStoragePolicy,
    }
  }

  private async restore() {
    const raw = await this.app.secretStorage.get(SESSION_SERVICE, SESSION_ACCOUNT)
    if (!raw) return
    try {
      const stored = JSON.parse(raw) as StoredBtnlauncher2Session
      if (!isStoredSession(stored)) {
        await this.clearSession()
        return
      }
      this.credential = stored.credential
      this.state.snapshot(stored.snapshot)
    } catch {
      await this.clearSession()
    }
  }

  private requireCredential() {
    if (!this.credential) throw new Error('btnlauncher2_account_session_missing')
    return this.credential
  }

  private async clearSession() {
    this.credential = undefined
    this.pendingMergeCredential = undefined
    this.exchangedProviderTransactions.clear()
    this.state.guest()
    await this.app.secretStorage.put(SESSION_SERVICE, SESSION_ACCOUNT, '')
  }

  private recordError(error: unknown) {
    const code =
      error instanceof Btnlauncher2AccountApiError
        ? error.code
        : error instanceof Error
          ? error.message
          : 'btnlauncher2_account_request_failed'
    this.state.operationError({
      code,
      message: 'Btnlauncher2 account request failed',
    })
  }
}

function toBase64Url(value: Buffer) {
  return value.toString('base64url')
}

function isStoredSession(value: StoredBtnlauncher2Session): value is StoredBtnlauncher2Session {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof value.credential?.sessionId === 'string' &&
    typeof value.credential?.accountId === 'string' &&
    typeof value.credential?.accessToken === 'string' &&
    Array.isArray(value.credential?.scopes) &&
    typeof value.credential?.issuedAt === 'string' &&
    typeof value.credential?.expiresAt === 'string' &&
    typeof value.snapshot === 'object' &&
    Array.isArray(value.snapshot?.identities)
  )
}
