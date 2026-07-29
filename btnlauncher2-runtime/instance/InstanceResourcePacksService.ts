import { InstanceResourcePacksService as IInstanceResourcePacksService, InstanceResourcePacksServiceKey } from '@btnlauncher2/runtime-api'
import { Inject, LauncherAppKey } from '~/app'
import { ExposeServiceKey } from '~/service'
import { LauncherApp } from '../app/LauncherApp'
import { AbstractInstanceDomainService } from './AbstractInstanceDomainService'
import { ResourceDomain } from '@btnlauncher2/resource'

/**
 * Provide the abilities to import resource pack and resource packs files to instance
 */
@ExposeServiceKey(InstanceResourcePacksServiceKey)
export class InstanceResourcePackService extends AbstractInstanceDomainService implements IInstanceResourcePacksService {
  constructor(@Inject(LauncherAppKey) app: LauncherApp) {
    super(app, ResourceDomain.ResourcePacks)
  }
}
