export type Btnlauncher2OAuthProvider = 'microsoft' | 'modrinth' | 'google' | 'discord'

export type Btnlauncher2AccountStatus = 'active' | 'merged' | 'deletion_pending' | 'deleted'

export interface Btnlauncher2Account {
  accountId: string
  status: Btnlauncher2AccountStatus
  createdAt: string
}

export interface Btnlauncher2AccountIdentity {
  provider: Btnlauncher2OAuthProvider
  displayName?: string
  linkedBy: 'launcher_bootstrap' | 'launcher_link' | 'web_link'
  linkedAt: string
}

export interface Btnlauncher2SessionSummary {
  sessionId: string
  accountId: string
  scopes: string[]
  issuedAt: string
  expiresAt: string
}

/** D1/D4 shared-contract v1 read-only policy; M6 owns account-specific accounting. */
export interface Btnlauncher2BackupStoragePolicy {
  freeBytes: 1_073_741_824
  policyVersion: 1
}

export interface Btnlauncher2IdentityConflict {
  provider: Btnlauncher2OAuthProvider
  mergeId?: string
}

export interface Btnlauncher2MergePreview {
  mergeId: string
  resources: Array<{
    type: string
    count?: number
  }>
  expiresAt?: string
}

export interface Btnlauncher2AccountError {
  code: string
  message: string
}

export interface Btnlauncher2AccountSnapshot {
  account?: Btnlauncher2Account
  identities: Btnlauncher2AccountIdentity[]
  session?: Btnlauncher2SessionSummary
  backupStoragePolicy?: Btnlauncher2BackupStoragePolicy
}

export class Btnlauncher2AccountState {
  account: Btnlauncher2Account | undefined
  identities: Btnlauncher2AccountIdentity[] = []
  session: Btnlauncher2SessionSummary | undefined
  backupStoragePolicy: Btnlauncher2BackupStoragePolicy | undefined
  conflict: Btnlauncher2IdentityConflict | undefined
  mergePreview: Btnlauncher2MergePreview | undefined
  mergeTaskId: string | undefined
  error: Btnlauncher2AccountError | undefined

  snapshot(snapshot: Btnlauncher2AccountSnapshot) {
    this.account = snapshot.account
    this.identities = snapshot.identities
    this.session = snapshot.session
    this.backupStoragePolicy = snapshot.backupStoragePolicy
    this.conflict = undefined
    this.mergePreview = undefined
    this.mergeTaskId = undefined
    this.error = undefined
  }

  identityConflict(conflict: Btnlauncher2IdentityConflict) {
    this.conflict = conflict
    this.error = undefined
  }

  mergePrepared(preview: Btnlauncher2MergePreview) {
    this.mergePreview = preview
    this.error = undefined
  }

  mergeQueued(taskId: string) {
    this.mergeTaskId = taskId
    this.mergePreview = undefined
    this.error = undefined
  }

  operationError(error: Btnlauncher2AccountError) {
    this.error = error
  }

  clearError() {
    this.error = undefined
  }

  guest() {
    this.account = undefined
    this.identities = []
    this.session = undefined
    this.backupStoragePolicy = undefined
    this.conflict = undefined
    this.mergePreview = undefined
    this.mergeTaskId = undefined
    this.error = undefined
  }
}
