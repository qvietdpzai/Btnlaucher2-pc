import type {
  Btnlauncher2Account,
  Btnlauncher2AccountIdentity,
  Btnlauncher2AccountSnapshot,
  Btnlauncher2BackupStoragePolicy,
  Btnlauncher2MergePreview,
  Btnlauncher2OAuthProvider,
  Btnlauncher2SessionSummary,
} from '@btnlauncher2/runtime-api'

export const M1_LOCAL_CONTRACT_VERSION = 'm1-local-proposal-2026-07-22+shared-v1'
export const Btnlauncher2_SHARED_CONTRACT_VERSION = 'shared/v1'

export interface Btnlauncher2SessionCredential extends Btnlauncher2SessionSummary {
  accessToken: string
  refreshToken?: string
}

export interface Btnlauncher2AuthResult {
  account: Btnlauncher2Account
  identities?: Array<Btnlauncher2AccountIdentity & { subject?: string }>
  session: Btnlauncher2SessionCredential
  bindingDisposition?: 'created' | 'restored' | 'linked'
}

export interface Btnlauncher2BrowserExchange {
  provider: Extract<Btnlauncher2OAuthProvider, 'google' | 'discord'>
  transactionId: string
  code: string
  state: string
  codeVerifier: string
  redirectUri: string
}

export interface Btnlauncher2BrowserAuthorization {
  transactionId: string
  authorizationUrl: string
  expiresAt: string
}

interface ApiErrorBody {
  error?: string
  message?: string
  requestId?: string
  details?: {
    mergeId?: string
  }
}

export class Btnlauncher2AccountApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly requestId?: string,
    readonly mergeId?: string,
  ) {
    super(code)
    this.name = 'Btnlauncher2AccountApiError'
  }
}

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>
type BaseUrlProvider = string | (() => Promise<string>)

export class Btnlauncher2AccountApi {
  constructor(
    private readonly fetch: FetchLike,
    private readonly baseUrl: BaseUrlProvider = 'https://api.btnlauncher2.app',
  ) {}

  async beginBrowserAuthorization(
    provider: Extract<Btnlauncher2OAuthProvider, 'google' | 'discord'>,
    request: {
      state: string
      redirectUri: string
      codeChallenge: string
    },
    credential?: Btnlauncher2SessionCredential,
  ): Promise<Btnlauncher2BrowserAuthorization> {
    const path = credential
      ? `/v1/account/identities/${provider}/authorize`
      : `/v1/auth/${provider}/authorize?${new URLSearchParams({
          state: request.state,
          redirectUri: request.redirectUri,
          codeChallenge: request.codeChallenge,
        })}`
    const body = await this.request<unknown>(
      path,
      credential ? { method: 'POST', body: JSON.stringify(request) } : { method: 'GET' },
      credential,
      credential ? crypto.randomUUID() : undefined,
    )
    if (
      !isRecord(body) ||
      typeof body.transactionId !== 'string' ||
      typeof body.authorizationUrl !== 'string' ||
      typeof body.expiresAt !== 'string'
    ) {
      throw new TypeError('Invalid btnlauncher2 authorization response')
    }
    return {
      transactionId: body.transactionId,
      authorizationUrl: body.authorizationUrl,
      expiresAt: body.expiresAt,
    }
  }

  async launcherExchange(
    provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>,
    providerCredential: string,
    currentCredential?: Btnlauncher2SessionCredential,
  ): Promise<Btnlauncher2AuthResult> {
    const body = await this.request<unknown>(
      `/v1/auth/${provider}/launcher-exchange`,
      {
        method: 'POST',
        body: JSON.stringify({
          loginTransactionId: crypto.randomUUID(),
          completedAt: new Date().toISOString(),
          credential: providerCredential,
        }),
      },
      currentCredential,
      crypto.randomUUID(),
    )
    return parseAuthResult(body)
  }

  async exchangeBrowser(
    request: Btnlauncher2BrowserExchange,
    currentCredential?: Btnlauncher2SessionCredential,
  ): Promise<Btnlauncher2AuthResult> {
    const linking = currentCredential !== undefined
    const body = await this.request<unknown>(
      linking
        ? `/v1/account/identities/${request.provider}/complete`
        : `/v1/auth/${request.provider}/exchange`,
      {
        method: 'POST',
        body: JSON.stringify({
          transactionId: request.transactionId,
          code: request.code,
          state: request.state,
          codeVerifier: request.codeVerifier,
        }),
      },
      currentCredential,
      crypto.randomUUID(),
    )
    if (linking) {
      const snapshot = await this.getSnapshot(currentCredential)
      if (!snapshot.account) throw new TypeError('Missing btnlauncher2 account after identity link')
      return {
        account: snapshot.account,
        identities: snapshot.identities,
        session: currentCredential,
        bindingDisposition:
          isRecord(body) && isBindingDisposition(body.bindingDisposition)
            ? body.bindingDisposition
            : undefined,
      }
    }
    return parseAuthResult(body)
  }

  async getSnapshot(credential: Btnlauncher2SessionCredential): Promise<Btnlauncher2AccountSnapshot> {
    const [accountBody, identitiesBody, backupStoragePolicy] = await Promise.all([
      this.request<unknown>('/v1/account', { method: 'GET' }, credential),
      this.request<unknown>('/v1/account/identities', { method: 'GET' }, credential),
      this.getBackupStoragePolicy(credential).catch(() => undefined),
    ])
    const account = parseAccount(accountBody)
    const identities = parseIdentities(identitiesBody)
    return {
      account,
      identities,
      session: toSessionSummary(credential),
      backupStoragePolicy,
    }
  }

  /** Consumes the published D1/D4 shared v1 policy, never M6 accounting. */
  async getBackupStoragePolicy(
    credential: Btnlauncher2SessionCredential,
  ): Promise<Btnlauncher2BackupStoragePolicy> {
    return parseBackupStoragePolicy(
      await this.request<unknown>('/v1/backup-storage-policy', { method: 'GET' }, credential),
    )
  }

  async refreshSession(credential: Btnlauncher2SessionCredential): Promise<Btnlauncher2SessionCredential> {
    const body = await this.request<unknown>(
      '/v1/sessions/refresh',
      {
        method: 'POST',
        body: JSON.stringify({
          sessionId: credential.sessionId,
          refreshToken: credential.refreshToken,
        }),
      },
      credential,
      crypto.randomUUID(),
    )
    return parseSession(body)
  }

  async prepareMerge(
    credential: Btnlauncher2SessionCredential,
    target: {
      provider: Extract<Btnlauncher2OAuthProvider, 'microsoft' | 'modrinth'>
      credential: string
      completedAt: string
    },
  ): Promise<Btnlauncher2MergePreview> {
    const body = await this.request<unknown>(
      '/v1/account/merge/prepare',
      {
        method: 'POST',
        body: JSON.stringify(target),
      },
      credential,
      crypto.randomUUID(),
    )
    if (
      !isRecord(body) ||
      typeof body.mergeId !== 'string' ||
      !Array.isArray(body.resources) ||
      !body.resources.every(
        (resource) =>
          isRecord(resource) &&
          typeof resource.type === 'string' &&
          (resource.count === undefined || typeof resource.count === 'number'),
      ) ||
      (body.expiresAt !== undefined && typeof body.expiresAt !== 'string')
    ) {
      throw new TypeError('Invalid btnlauncher2 merge preview response')
    }
    return {
      mergeId: body.mergeId,
      resources: body.resources.map((resource) => ({
        type: resource.type,
        count: resource.count,
      })),
      expiresAt: body.expiresAt,
    }
  }

  async confirmMerge(credential: Btnlauncher2SessionCredential, mergeId: string): Promise<string> {
    const body = await this.request<unknown>(
      '/v1/account/merge/confirm',
      {
        method: 'POST',
        body: JSON.stringify({ mergeId, confirmed: true }),
      },
      credential,
      crypto.randomUUID(),
    )
    if (!isRecord(body) || typeof body.taskId !== 'string') {
      throw new TypeError('Invalid btnlauncher2 merge task response')
    }
    return body.taskId
  }

  async revokeSession(credential: Btnlauncher2SessionCredential, allDevices: boolean): Promise<void> {
    await this.request(
      '/v1/sessions/revoke',
      {
        method: 'POST',
        body: JSON.stringify({
          sessionId: credential.sessionId,
          all: allDevices,
        }),
      },
      credential,
      crypto.randomUUID(),
    )
  }

  private async request<T = unknown>(
    path: string,
    init: RequestInit,
    credential?: Btnlauncher2SessionCredential,
    idempotencyKey?: string,
  ): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('Accept', 'application/json')
    if (init.body) headers.set('Content-Type', 'application/json')
    if (credential) headers.set('Authorization', `Bearer ${credential.accessToken}`)
    if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey)

    const baseUrl = typeof this.baseUrl === 'function' ? await this.baseUrl() : this.baseUrl
    const response = await this.fetch(new URL(path, baseUrl), {
      ...init,
      headers,
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as ApiErrorBody
      throw new Btnlauncher2AccountApiError(
        response.status,
        typeof body.error === 'string' ? body.error : 'btnlauncher2_account_request_failed',
        typeof body.requestId === 'string' ? body.requestId : undefined,
        typeof body.details?.mergeId === 'string' ? body.details.mergeId : undefined,
      )
    }
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  }
}

export function toSessionSummary(session: Btnlauncher2SessionCredential): Btnlauncher2SessionSummary {
  return {
    sessionId: session.sessionId,
    accountId: session.accountId,
    scopes: [...session.scopes],
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
  }
}

function parseAuthResult(value: unknown): Btnlauncher2AuthResult {
  if (!isRecord(value)) throw new TypeError('Invalid btnlauncher2 auth response')
  return {
    account: parseAccount(value.account),
    identities: value.identities === undefined ? undefined : parseIdentities(value.identities),
    session: parseSession(value.session),
    bindingDisposition: isBindingDisposition(value.bindingDisposition)
      ? value.bindingDisposition
      : undefined,
  }
}

function parseAccount(value: unknown): Btnlauncher2Account {
  if (
    !isRecord(value) ||
    typeof value.accountId !== 'string' ||
    !isAccountStatus(value.status) ||
    typeof value.createdAt !== 'string'
  ) {
    throw new TypeError('Invalid btnlauncher2 account response')
  }
  return {
    accountId: value.accountId,
    status: value.status,
    createdAt: value.createdAt,
  }
}

function parseBackupStoragePolicy(value: unknown): Btnlauncher2BackupStoragePolicy {
  if (
    !isRecord(value) ||
    Object.keys(value).some((key) => key !== 'freeBytes' && key !== 'policyVersion') ||
    value.freeBytes !== 1_073_741_824 ||
    value.policyVersion !== 1
  ) {
    throw new TypeError('Invalid shared v1 backup storage policy response')
  }
  return {
    freeBytes: 1_073_741_824,
    policyVersion: 1,
  }
}

function parseIdentities(value: unknown): Btnlauncher2AccountIdentity[] {
  if (!Array.isArray(value)) throw new TypeError('Invalid btnlauncher2 identities response')
  return value.map((identity) => {
    if (
      !isRecord(identity) ||
      !isProvider(identity.provider) ||
      !isLinkedBy(identity.linkedBy) ||
      typeof identity.linkedAt !== 'string' ||
      (identity.displayName !== undefined && typeof identity.displayName !== 'string')
    ) {
      throw new TypeError('Invalid btnlauncher2 identity response')
    }
    return {
      provider: identity.provider,
      displayName: identity.displayName,
      linkedBy: identity.linkedBy,
      linkedAt: identity.linkedAt,
    }
  })
}

function parseSession(value: unknown): Btnlauncher2SessionCredential {
  if (
    !isRecord(value) ||
    typeof value.sessionId !== 'string' ||
    typeof value.accountId !== 'string' ||
    typeof value.accessToken !== 'string' ||
    !Array.isArray(value.scopes) ||
    !value.scopes.every((scope) => typeof scope === 'string') ||
    typeof value.issuedAt !== 'string' ||
    typeof value.expiresAt !== 'string' ||
    (value.refreshToken !== undefined && typeof value.refreshToken !== 'string')
  ) {
    throw new TypeError('Invalid btnlauncher2 session response')
  }
  return {
    sessionId: value.sessionId,
    accountId: value.accountId,
    accessToken: value.accessToken,
    refreshToken: value.refreshToken,
    scopes: [...value.scopes],
    issuedAt: value.issuedAt,
    expiresAt: value.expiresAt,
  }
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null
}

function isAccountStatus(value: unknown): value is Btnlauncher2Account['status'] {
  return (
    value === 'active' || value === 'merged' || value === 'deletion_pending' || value === 'deleted'
  )
}

function isProvider(value: unknown): value is Btnlauncher2OAuthProvider {
  return value === 'microsoft' || value === 'modrinth' || value === 'google' || value === 'discord'
}

function isLinkedBy(value: unknown): value is Btnlauncher2AccountIdentity['linkedBy'] {
  return value === 'launcher_bootstrap' || value === 'launcher_link' || value === 'web_link'
}

function isBindingDisposition(
  value: unknown,
): value is NonNullable<Btnlauncher2AuthResult['bindingDisposition']> {
  return value === 'created' || value === 'restored' || value === 'linked'
}
