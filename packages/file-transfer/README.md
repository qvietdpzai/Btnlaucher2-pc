# Download Core

[![npm version](https://img.shields.io/npm/v/@btnlauncher2/file-transfer.svg)](https://www.npmjs.com/package/@btnlauncher2/file-transfer)
[![Downloads](https://img.shields.io/npm/dm/@btnlauncher2/file-transfer.svg)](https://npmjs.com/@btnlauncher2/file-transfer)
[![Install size](https://packagephobia.now.sh/badge?p=@btnlauncher2/file-transfer)](https://packagephobia.now.sh/result?p=@btnlauncher2/file-transfer)
[![npm](https://img.shields.io/npm/l/@btnlauncher2/minecraft-launcher-core.svg)](https://github.com/voxelum/minecraft-launcher-core-node/blob/master/LICENSE)
[![Build Status](https://github.com/voxelum/minecraft-launcher-core-node/workflows/Build/badge.svg)](https://github.com/Voxelum/minecraft-launcher-core-node/actions?query=workflow%3ABuild)

A high-performance download primitive built on [undici](https://github.com/nodejs/undici).

Features:

- Parallel range requests for large files (configurable threshold and policy)
- Multi-URL fallback — try the next URL when the current one fails
- `AbortSignal` cancellation
- Customizable retry logic via the underlying undici dispatcher
- Progress tracking for single or batched downloads

> **Note on integrity checking.** This package does **not** verify
> downloaded content against a hash. Callers that need integrity
> guarantees must do their own post-download verification (see
> `@btnlauncher2/instance` for an example) or pass an explicit dispatcher
> that enforces it.

> **Note on atomic writes.** `download()` writes directly to
> `destination`. If the download fails or the process is killed
> mid-stream, a partial file may exist at `destination`. Callers that
> need atomic semantics should download to a side path of their
> choice and rename it themselves on success — see
> `btnlauncher2-runtime/market/downloadStaged.ts` for one such helper.

## Usage

### Single download

```ts
import { download } from '@btnlauncher2/file-transfer'

await download({
  // Required
  url: 'http://example.com/file.zip',
  destination: '/abs/path/file.zip',

  // Optional
  headers: { 'X-Custom': 'value' },
  signal: new AbortController().signal,
  // If known up-front, helps the range scheduler decide whether to
  // open parallel range requests.
  expectedTotal: 12345678,
})
```

### Multi-URL fallback

`url` may be a list. The first URL is tried; on failure the next is
attempted. The download succeeds as soon as any URL succeeds.

```ts
import { download } from '@btnlauncher2/file-transfer'

await download({
  url: ['http://primary.example/file.zip', 'http://mirror.example/file.zip'],
  destination: '/abs/path/file.zip',
})
```

### Batched downloads

`downloadMultiple` runs many `download` calls under one shared
dispatcher and tracker. Returns a `PromiseSettledResult` per file so
the caller can decide how to surface partial failures.

```ts
import { downloadMultiple, ProgressTrackerMultiple } from '@btnlauncher2/file-transfer'

const tracker = new ProgressTrackerMultiple()
const results = await downloadMultiple({
  options: [
    { url: 'https://example.com/a.jar', destination: '/abs/a.jar' },
    { url: 'https://example.com/b.jar', destination: '/abs/b.jar' },
  ],
  tracker,
  signal: new AbortController().signal,
})

for (const r of results) {
  if (r.status === 'rejected') console.warn(r.reason)
}
```

### Progress tracking

```ts
import { download, ProgressTrackerSingle } from '@btnlauncher2/file-transfer'

const tracker = new ProgressTrackerSingle()
const t = setInterval(() => {
  console.log(`${tracker.progress}/${tracker.total} ${tracker.url}`)
}, 250)
try {
  await download({
    url: 'https://example.com/big.zip',
    destination: '/abs/big.zip',
    tracker,
  })
} finally {
  clearInterval(t)
}
```

### Range request tuning

By default a file is downloaded with up to 4 parallel range requests
when its declared `expectedTotal` exceeds 5 MB. To tune:

```ts
import { download, DefaultRangePolicy } from '@btnlauncher2/file-transfer'

await download({
  url: 'https://example.com/big.zip',
  destination: '/abs/big.zip',
  rangePolicy: new DefaultRangePolicy(
    /* rangeThreshold */ 8 * 1024 * 1024, // 8MB
    /* concurrency */ 8,
  ),
})
```

Or supply your own `RangePolicy` implementation if you need a
different chunking strategy.

### Sharing a dispatcher

Callers that issue many downloads should share a single undici
`Dispatcher` so connection pools and retry policies are reused:

```ts
import { download, getDefaultAgent } from '@btnlauncher2/file-transfer'

const dispatcher = getDefaultAgent({ maxRetries: 5 })

await Promise.all([
  download({ url: '...', destination: '...', dispatcher }),
  download({ url: '...', destination: '...', dispatcher }),
])
```

