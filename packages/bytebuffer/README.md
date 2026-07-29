# ByteBuffer Module

[![npm version](https://img.shields.io/npm/v/@btnlauncher2/bytebuffer.svg)](https://www.npmjs.com/package/@btnlauncher2/bytebuffer)
[![Downloads](https://img.shields.io/npm/dm/@btnlauncher2/bytebuffer.svg)](https://npmjs.com/@btnlauncher2/bytebuffer)
[![Install size](https://packagephobia.now.sh/badge?p=@btnlauncher2/bytebuffer)](https://packagephobia.now.sh/result?p=@btnlauncher2/bytebuffer)
[![npm](https://img.shields.io/npm/l/@btnlauncher2/minecraft-launcher-core.svg)](https://github.com/voxelum/minecraft-launcher-core-node/blob/master/LICENSE)
[![Build Status](https://github.com/voxelum/minecraft-launcher-core-node/workflows/Build/badge.svg)](https://github.com/Voxelum/minecraft-launcher-core-node/actions?query=workflow%3ABuild)

Provide some functions to query Minecraft server status. Port from [bytebuffer.js](https://github.com/protobufjs/bytebuffer.js).

## Usage

Should similar to the bytebuffer in java.

You can also reference the [bytebuffer.js](https://github.com/protobufjs/bytebuffer.js).

There are sevearl notable differences:

- Remove string methods as nodejs have better string encoding/decoding support.
- This module only release one version using `DataView`. Should compatible for both browser and nodejs.
- This module use `BigInt` to represent the `long` type.
- Split non-common methods support into separate files. (Hope to reduce the build size)
- Support esm (mjs)

Common usage:

```ts
import { ByteBuffer } from '@btnlauncher2/bytebuffer'
const bb = ByteBuffer.allocate(10)
// similar to java's ByteBuffer
```

Using extra methods:

```ts
import { ByteBuffer } from '@btnlauncher2/bytebuffer'
import '@btnlauncher2/bytebuffer/varint64' // importing this will inject the varint64 methods to ByteBuffer

const bb = ByteBuffer.allocate(10)
bb.writeVarint64(BigInt(1234567890)) // now this is avaiable!
```
