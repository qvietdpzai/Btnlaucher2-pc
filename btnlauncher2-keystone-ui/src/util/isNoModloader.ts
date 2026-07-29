import { RuntimeVersions } from '@btnlauncher2/instance'

export function isNoModLoader(runtime: RuntimeVersions) {
  const noModLoader =
    !runtime.forge && !runtime.fabricLoader && !runtime.quiltLoader && !runtime.neoForged
  return noModLoader
}
