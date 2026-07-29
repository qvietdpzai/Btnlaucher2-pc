import { AUTHORITY_DEV, AUTHORITY_MICROSOFT, AUTHORITY_MOJANG } from '@btnlauncher2/runtime-api'
import { LauncherAppPlugin } from '~/app'
import { UserTokenStorage, kUserTokenStorage } from './userTokenStore'

export const pluginUserTokenStorage: LauncherAppPlugin = (app) => {
  const cache: Record<string, string> = {}
  const getStorageKey = (url: string) => {
    if (url === AUTHORITY_DEV) return 'dev'
    if (url === AUTHORITY_MICROSOFT) return 'microsoft'
    if (url === AUTHORITY_MOJANG) return 'mojang'
    try {
      const parsed = new URL(url)
      return parsed.host
    } catch {
      return url
    }
  }
  const storage: UserTokenStorage = {
    put: async (user, token) => {
      cache[`btnlauncher2/${getStorageKey(user.authority)}/${user.id}`] = token
      await app.secretStorage.put(`btnlauncher2/${getStorageKey(user.authority)}`, user.id, token)
    },
    get: async (user) => {
      const cached = cache[`btnlauncher2/${getStorageKey(user.authority)}/${user.id}`]
      if (cached) return cached
      const token = await app.secretStorage.get(`btnlauncher2/${getStorageKey(user.authority)}`, user.id)
      if (token) {
        const isValidJWT = /^[\w-]+\.[\w-]+\.[\w-]+$/g.test(token)
        if (!isValidJWT && user.authority === AUTHORITY_MICROSOFT) {
          return undefined
        }
        cache[`btnlauncher2/${getStorageKey(user.authority)}/${user.id}`] = token
      }
      return token || undefined
    },
  }
  app.registry.register(kUserTokenStorage, storage)
}
