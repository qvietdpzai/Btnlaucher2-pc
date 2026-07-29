# Gamesetting Module

[![npm version](https://img.shields.io/npm/v/@btnlauncher2/gamesetting.svg)](https://www.npmjs.com/package/@btnlauncher2/gamesetting)
[![Downloads](https://img.shields.io/npm/dm/@btnlauncher2/gamesetting.svg)](https://npmjs.com/@btnlauncher2/gamesetting)
[![Install size](https://packagephobia.now.sh/badge?p=@btnlauncher2/gamesetting)](https://packagephobia.now.sh/result?p=@btnlauncher2/gamesetting)
[![npm](https://img.shields.io/npm/l/@btnlauncher2/minecraft-launcher-core.svg)](https://github.com/voxelum/minecraft-launcher-core-node/blob/master/LICENSE)
[![Build Status](https://github.com/voxelum/minecraft-launcher-core-node/workflows/Build/badge.svg)](https://github.com/Voxelum/minecraft-launcher-core-node/actions?query=workflow%3ABuild)

Provide function to parse Minecraft game settings

## Usage

### Parse GameSetting (options.txt)

Serialize/Deserialize the minecraft game setting string.

```ts
import { GameSetting } from '@btnlauncher2/gamesetting'
const settingString;
const setting: GameSetting = GameSetting.parse(settingString);
const string: string = GameSetting.stringify(setting);
```
