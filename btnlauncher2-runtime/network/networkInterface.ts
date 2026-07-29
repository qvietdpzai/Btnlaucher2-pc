import { DownloadBaseOptions } from '@btnlauncher2/file-transfer'
import { NetworkStatus } from '@btnlauncher2/runtime-api'
import { InjectionKey } from '~/app'
import { BmclDownloadController } from './BmclDownloadController'

export const kNetworkInterface: InjectionKey<NetworkInterface> = Symbol('NetworkInterface')
export const kDownloadOptions : InjectionKey<DownloadBaseOptions> = Symbol('DownloadOptions')
export const kDownloadController: InjectionKey<BmclDownloadController> = Symbol('DownloadController')

export interface NetworkInterface {
  getNetworkStatus(): NetworkStatus
  destroyPool(origin: string): Promise<void>
  onNetworkActivityChange(callback: (active: boolean) => void): void
}
