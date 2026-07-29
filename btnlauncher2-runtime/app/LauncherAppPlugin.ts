import { AppManifest } from '@btnlauncher2/runtime-api'
import { LauncherApp } from './LauncherApp'

export interface LauncherAppPlugin {
  (app: LauncherApp, manifest: AppManifest): void
}
