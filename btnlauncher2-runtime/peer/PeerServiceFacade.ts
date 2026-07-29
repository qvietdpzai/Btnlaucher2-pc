import { GameProfileAndTexture } from '@btnlauncher2/runtime-api'
import { InjectionKey } from '~/app'

export interface PeerServiceFacade {
  queryGameProfile(name: string): Promise<GameProfileAndTexture | undefined>
  getHttpDownloadUrl(url: string): string
}

export const kPeerFacade: InjectionKey<PeerServiceFacade> = Symbol('PeerService')
