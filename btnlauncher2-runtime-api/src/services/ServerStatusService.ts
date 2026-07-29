import type { Status } from '@btnlauncher2/client'
import { ServiceKey } from './Service'

export interface PingServerOptions {
  host: string
  port?: number
  protocol?: number
}

export interface ServerStatusService {
  pingServer(options: PingServerOptions): Promise<Status>
}

export const ServerStatusServiceKey: ServiceKey<ServerStatusService> = 'ServerStatusService'
