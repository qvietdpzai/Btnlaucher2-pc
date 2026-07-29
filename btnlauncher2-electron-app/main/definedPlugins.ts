import { pluginAutoUpdate } from './pluginAutoUpdate'
import { pluginIconProtocol } from './pluginIconProtocol'
import { pluginDiscreteGPULinux } from './pluginDiscreteGPULinux'
import { pluginPowerMonitor } from './pluginPowerMonitor'

import { pluginApiFallback } from '@btnlauncher2/runtime/app/pluginApiFallback'
import { pluginAgentBridge } from '@btnlauncher2/runtime/agent'
import { pluginCommonProtocol } from '@btnlauncher2/runtime/app/pluginCommonProtocol'
import { pluginMediaProtocol } from '@btnlauncher2/runtime/app/pluginMediaProtocol'
import { pluginCli } from '@btnlauncher2/runtime/commands/pluginCli'
import { pluginCommandHost } from '@btnlauncher2/runtime/commands/pluginCommandHost'
import { pluginBtnlauncher2AccountMicrosoftBridge } from '@btnlauncher2/runtime/btnlauncher2Account/pluginBtnlauncher2AccountMicrosoftBridge'
import { pluginBtnlauncher2AccountModrinthBridge } from '@btnlauncher2/runtime/btnlauncher2Account/pluginBtnlauncher2AccountModrinthBridge'
import { pluginExternalCredentialLifecycle } from '@btnlauncher2/runtime/credential/pluginExternalCredentialLifecycle'
import { elyByPlugin } from '@btnlauncher2/runtime/elyby/elyByPlugin'
import { pluginEncodingWorker } from '@btnlauncher2/runtime/encoding/pluginEncodingWorker'
import {
  pluginClientToken,
  pluginFlights,
  pluginGFW,
  pluginImageStorage,
  pluginLogConsumer,
  pluginTasks,
  pluginTelemetry,
  pluginUncaughtError,
} from '@btnlauncher2/runtime/infra/plugins'
import { pluginLaunchPrecheck } from '@btnlauncher2/runtime/launch/pluginLaunchPrecheck'
import { pluginMarketProvider } from '@btnlauncher2/runtime/market/pluginMarketProvider'
import { pluginNativeReplacer } from '@btnlauncher2/runtime/nativeReplacer/pluginNativeReplacer'
import { pluginNetworkInterface } from '@btnlauncher2/runtime/network/pluginNetworkInterface'
import { pluginUndiciLogger } from '@btnlauncher2/runtime/network/pluginUndiciLogger'
import { pluginUserPlaytime } from '@btnlauncher2/runtime/playTime/pluginUserPlaytime'
import { pluginResourceWorker } from '@btnlauncher2/runtime/resource/pluginResourceWorker'
import { pluginResourcePackLink } from '@btnlauncher2/runtime/resourcePack/pluginResourcePackLink'
import { pluginSaveWorker } from '@btnlauncher2/runtime/save/pluginSaveWorker'
import { pluginServicesHandler } from '@btnlauncher2/runtime/service/pluginServicesHandler'
import { pluginSettings } from '@btnlauncher2/runtime/settings/pluginSettings'
import { pluginSetup } from '@btnlauncher2/runtime/setup/pluginSetup'
import { pluginModrinthAccess } from '@btnlauncher2/runtime/user/pluginModrinthAccess'
import { pluginOfficialUserApi } from '@btnlauncher2/runtime/user/pluginOfficialUserApi'
import { pluginOffineUser } from '@btnlauncher2/runtime/user/pluginOfflineUser'
import { pluginUserTokenStorage } from '@btnlauncher2/runtime/user/pluginUserTokenStorage'
import { pluginYggdrasilApi } from '@btnlauncher2/runtime/user/pluginYggdrasilApi'
import { pluginYggdrasilHandler } from '@btnlauncher2/runtime/yggdrasilServer/pluginYggdrasilHandler'

import { LauncherAppPlugin } from '~/app'
import { definedServices } from './definedServices'

export const definedPlugins: LauncherAppPlugin[] = [
  pluginAgentBridge,
  pluginCommandHost({ services: definedServices }),
  pluginCli,
  pluginAutoUpdate,
  pluginPowerMonitor,
  pluginIconProtocol,
  pluginApiFallback,
  pluginResourceWorker,
  pluginEncodingWorker,
  pluginSaveWorker,
  pluginSetup,
  pluginLaunchPrecheck,
  pluginDiscreteGPULinux,
  pluginUncaughtError,
  pluginNativeReplacer,
  elyByPlugin,
  pluginMarketProvider,
  pluginYggdrasilApi,

  pluginMediaProtocol,
  pluginResourcePackLink,
  pluginUserPlaytime,
  pluginYggdrasilHandler,
  pluginClientToken,
  pluginServicesHandler(definedServices),
  pluginTelemetry,
  pluginLogConsumer,
  pluginSettings,
  pluginGFW,
  pluginTasks,
  pluginImageStorage,
  pluginFlights,
  pluginNetworkInterface,
  pluginExternalCredentialLifecycle,
  pluginOfficialUserApi,
  pluginOffineUser,
  pluginUndiciLogger,
  pluginUserTokenStorage,

  pluginModrinthAccess,
  pluginBtnlauncher2AccountMicrosoftBridge,
  pluginBtnlauncher2AccountModrinthBridge,

  pluginCommonProtocol,
]
