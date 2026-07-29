import type { Logger } from '~/infra'

export const DEFAULT_Btnlauncher2_API_BASE_URL = 'https://api.btnlauncher2.app'
export const Btnlauncher2_API_BASE_URL_FLIGHT = 'btnlauncher2ApiBaseUrl'

/**
 * Resolves the Btnlauncher2-owned API origin used by main-process API consumers.
 */
export function resolveBtnlauncher2ApiBaseUrl(override: unknown, logger?: Pick<Logger, 'warn'>): string {
  if (typeof override !== 'string' || !override.trim()) {
    return DEFAULT_Btnlauncher2_API_BASE_URL
  }

  try {
    const url = new URL(override.trim())
    const isOrigin =
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname.replace(/\/+$/, '') === ''
    if (isOrigin) return url.origin
  } catch {
    // Fall through to the safe default.
  }

  logger?.warn('Ignoring invalid btnlauncher2ApiBaseUrl flight; using the default btnlauncher2 API origin.')
  return DEFAULT_Btnlauncher2_API_BASE_URL
}
