import { BaseService } from '@btnlauncher2/runtime/app'
import { AgentService } from '@btnlauncher2/runtime/agent'
import { AuthlibInjectorService } from '@btnlauncher2/runtime/authlibInjector'
import { BedrockService } from '@btnlauncher2/runtime/bedrock'
import { CollectionService } from '@btnlauncher2/runtime/collection'
import { Btnlauncher2AccountService } from '@btnlauncher2/runtime/btnlauncher2Account'
import { ExternalCredentialService } from '@btnlauncher2/runtime/credential/ExternalCredentialService'
import { ElyByService } from '@btnlauncher2/runtime/elyby'
import { InstallService, VersionMetadataService } from '@btnlauncher2/runtime/install'
import {
  InstanceLogService,
  InstanceModsService,
  InstanceOptionsService,
  InstanceSavesService,
  InstanceResourcePackService,
  InstanceScreenshotService,
  InstanceServerInfoService,
  InstanceService,
  InstanceShaderPacksService,
  InstanceThemeService,
  InstanceModsGroupService,
  InstanceBlueprintsService,
} from '@btnlauncher2/runtime/instance'
import {
  InstanceIOService,
  InstanceInstallService,
  InstanceManifestService,
} from '@btnlauncher2/runtime/instanceIO'
import { JavaService } from '@btnlauncher2/runtime/java'
import { LaunchService, VersionService } from '@btnlauncher2/runtime/launch'
import { ProjectMappingService } from '@btnlauncher2/runtime/moddb'
import { ModMetadataService } from '@btnlauncher2/runtime/moddb/ModMetadataService'
import { BlueprintMarketService } from '@btnlauncher2/runtime/market'
import { ModpackService } from '@btnlauncher2/runtime/modpack'
import { PeerService } from '@btnlauncher2/runtime/peer'
import { PresenceService } from '@btnlauncher2/runtime/presence'
import { ResourcePackPreviewService } from '@btnlauncher2/runtime/resourcePack'
import { ServerStatusService } from '@btnlauncher2/runtime/serverStatus'
import { ThemeService } from '@btnlauncher2/runtime/theme'
import { OfficialUserService, UserService, MinecraftFriendsService } from '@btnlauncher2/runtime/user'

export const definedServices = [
  // Main-process-only: it deliberately has no service key, so token access
  // cannot be invoked through renderer service IPC.
  ExternalCredentialService,
  AgentService,
  VersionMetadataService,
  BaseService,
  AuthlibInjectorService,
  CollectionService,
  Btnlauncher2AccountService,
  BedrockService,
  InstallService,
  ProjectMappingService,
  InstanceIOService,
  InstanceLogService,
  ElyByService,
  InstanceModsService,
  InstanceModsGroupService,
  InstanceOptionsService,
  InstanceResourcePackService,
  InstanceSavesService,
  InstanceService,
  InstanceScreenshotService,
  InstanceShaderPacksService,
  InstanceBlueprintsService,
  BlueprintMarketService,
  PresenceService,
  JavaService,
  LaunchService,
  ModpackService,
  InstanceServerInfoService,
  ResourcePackPreviewService,
  InstanceManifestService,
  ServerStatusService,
  OfficialUserService,
  MinecraftFriendsService,
  UserService,
  VersionService,
  InstanceInstallService,
  ModMetadataService,
  PeerService,
  ThemeService,
  InstanceThemeService,
]
