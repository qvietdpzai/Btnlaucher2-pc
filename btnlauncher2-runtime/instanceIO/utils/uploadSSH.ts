import type { ServerOptions } from '@btnlauncher2/core'
import { ServerSSHExporter } from '@btnlauncher2/instance'

/**
 * Upload instance files to SSH server with progress tracking.
 */
export async function uploadSSH(
  exporter: ServerSSHExporter,
  serverDir: string,
  options: ServerOptions,
  files: string[],
  signal?: AbortSignal,
): Promise<void> {
  signal?.addEventListener('abort', () => {
    exporter.abort()
  })

  await exporter.exportInstance(serverDir, options, files)
}
