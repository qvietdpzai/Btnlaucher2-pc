import { defineConfig } from 'vitest/config'
import { join } from 'path'

// `@/` is the renderer's path alias (btnlauncher2-keystone-ui/src). Map it so unit
// tests can import composables/utils that use it. The regex form only matches
// `@/...` and leaves scoped packages like `@btnlauncher2/...` untouched.
const keystoneSrc = join(__dirname, 'btnlauncher2-keystone-ui/src').replace(/\\/g, '/')
const runtimeSrc = join(__dirname, 'btnlauncher2-runtime').replace(/\\/g, '/')

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: keystoneSrc + '/' },
      { find: /^~\//, replacement: runtimeSrc + '/' },
    ],
  },
  test: {
    setupFiles: [join(__dirname, './test-setup.ts')],
    // The `e2e/` package is a separate Playwright project (see e2e/README.md)
    // and is intentionally outside the pnpm workspace. Vitest still walks the
    // tree, so we exclude its specs explicitly to avoid empty "0 test" runs.
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    sequence: {
    },
    globals: true,
    coverage: {
      provider: 'v8',
    },
  },
})
