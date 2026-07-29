# Model Module

[![npm version](https://img.shields.io/npm/v/@btnlauncher2/model.svg)](https://www.npmjs.com/package/@btnlauncher2/model)
[![Downloads](https://img.shields.io/npm/dm/@btnlauncher2/model.svg)](https://npmjs.com/@btnlauncher2/model)
[![Install size](https://packagephobia.now.sh/badge?p=@btnlauncher2/model)](https://packagephobia.now.sh/result?p=@btnlauncher2/model)
[![npm](https://img.shields.io/npm/l/@btnlauncher2/minecraft-launcher-core.svg)](https://github.com/voxelum/minecraft-launcher-core-node/blob/master/LICENSE)
[![Build Status](https://github.com/voxelum/minecraft-launcher-core-node/workflows/Build/badge.svg)](https://github.com/Voxelum/minecraft-launcher-core-node/actions?query=workflow%3ABuild)
[![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)](https://github.com/emersion/stability-badges#experimental)

_This module can only used for browser environment_

## Usage

### Build THREE.js model for block and player

_Please read how to use [resourcepacks](https://github.com/Voxelum/minecraft-launcher-core-node/tree/master/packages/resourcepack/README.md) before this_

Create THREE.js block model:

```ts
    import { BlockModelFactory } from "@btnlauncher2/model";

    const textureRegistry: TextureRegistry;

    const factory = new BlockModelFactory(textureRegistry);
    const model: BlockModel.Resolved;
    const o3d: THREE.Object3D = factory.getObject(model);
    // add o3d to your three scene
```

Create THREE.js player model:

```ts
    import { PlayerModel } from "@btnlauncher2/model";

    const player: PlayerModel = new PlayerModel();
    const isSlimSkin: boolean; // if this skin use alex model
    player.setSkin("http://your-skin-url", isSlimSkin);

    const o3d: THREE.Object3D = player.playerObject3d;
    // add o3d to your three scene
```
