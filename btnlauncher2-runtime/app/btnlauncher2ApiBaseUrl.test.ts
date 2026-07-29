import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_Btnlauncher2_API_BASE_URL, resolveBtnlauncher2ApiBaseUrl } from './btnlauncher2ApiBaseUrl'

describe('resolveBtnlauncher2ApiBaseUrl', () => {
  it('normalizes a HTTPS origin and strips trailing slashes', () => {
    expect(resolveBtnlauncher2ApiBaseUrl('https://edge.example.test///')).toBe('https://edge.example.test')
  })

  it('falls back safely and warns when the override is not a HTTPS origin', () => {
    const logger = { warn: vi.fn() }

    expect(resolveBtnlauncher2ApiBaseUrl('http://example.test/api', logger)).toBe(DEFAULT_Btnlauncher2_API_BASE_URL)
    expect(logger.warn).toHaveBeenCalledWith(
      'Ignoring invalid btnlauncher2ApiBaseUrl flight; using the default btnlauncher2 API origin.',
    )
  })

  it('uses the production API when the flight is absent', () => {
    expect(resolveBtnlauncher2ApiBaseUrl(undefined)).toBe(DEFAULT_Btnlauncher2_API_BASE_URL)
  })
})
