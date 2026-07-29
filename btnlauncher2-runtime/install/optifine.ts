import { OptifineVersion } from '@btnlauncher2/runtime-api'
import { InjectionKey } from '~/app'

export const kOptifineInstaller: InjectionKey<(version: OptifineVersion) => Promise<string>> = Symbol('kOptifineInstaller')
