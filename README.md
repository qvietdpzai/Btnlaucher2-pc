<p align="center">
  <a href="https://btnlauncher2.app" target="_blank">
    <img alt="Logo" width="100" src="https://github.com/qvietdpzai/Btnlaucher2-pc/blob/master/btnlauncher2-electron-app/icons/dark@256x256.png">
  </a>
</p>

<p align="center">
  <a href="https://github.com/qvietdpzai/Btnlaucher2-pc">
    <img src="https://github.com/qvietdpzai/Btnlaucher2-pc/workflows/Build/badge.svg" alt="Build">
  </a>
  <a href="https://github.com/qvietdpzai/Btnlaucher2-pc/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@btnlauncher2/core.svg" alt="License">
  </a>
  <a href="https://conventionalcommits.org">
    <img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="Commit">
  </a>
  <a href="https://flathub.org/en/apps/app.btnlauncher2">
    <img src="https://img.shields.io/flathub/v/app.btnlauncher2?logo=flathub&label=Flathub" alt="Flathub">
  </a>
</p>

<p align="center">
  <a href="https://discord.gg/W5XVwYY7GQ">
    <img src="https://img.shields.io/discord/405213567118213121?logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord">
  </a>
  <a href="https://www.reddit.com/r/BTNLAUNCHER2/">
    <img src="https://img.shields.io/badge/Reddit-r%2FBTNLAUNCHER2-FF4500?logo=reddit&logoColor=white" alt="Reddit">
  </a>
  <a href="https://kook.top/gqjSHh">
    <img src="https://img.shields.io/endpoint?url=https://api.btnlauncher2.app/kook-badge" alt="Kook">
  </a>
</p>

<p align="center">
  <a href="https://afdian.com/@ci010">
    <img src="https://img.shields.io/endpoint?url=https://api.btnlauncher2.app/afdian-badge" alt="afdian">
  </a>
  <a href="https://patreon.com/btnlauncher2">
    <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dbtnlauncher2%26type%3Dpledges" alt="patreon">
  </a>
</p>

![home](https://raw.githubusercontent.com/qvietdpzai/Btnlaucher2-pc/master/.vitepress/theme/assets/home.png)

Visit the [official site](https://btnlauncher2.app) to download the app!

If you have winget, you can use winget to install

```bash
winget install CI010.XMinecraftLauncher
```

HomeBrew installation also available via tap

```bash
brew tap voxelum/btnlauncher2
brew install --cask voxelum/btnlauncher2/btnlauncher2
sudo xattr -rd com.apple.quarantine /Applications/X\ Minecraft\ Launcher.app
```

On Linux, btnlauncher2 is also available on Flathub:

```bash
flatpak install flathub app.btnlauncher2
```

<kbd>[<img title="Ukraine" alt="Ukraine" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/1280px-Flag_of_Ukraine.svg.png" width="22">](i18n/README.uk.md)</kbd>
<kbd>[<img title="Russia" alt="Russia" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/1280px-Flag_of_Russia.svg.png" width="22">](i18n/README.ru.md)</kbd>
<kbd>[<img title="Germany" alt="Germany" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/1280px-Flag_of_Germany.svg.png" width="22">](i18n/README.de.md)</kbd>
<kbd>[<img title="China" alt="China" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1280px-Flag_of_the_People%27s_Republic_of_China.svg.png" width="22">](i18n/README.zh.md)</kbd>
<kbd>[<img title="Japan" alt="Japan" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1280px-Flag_of_Japan.svg.png" width="22">](i18n/README.jp.md)</kbd>
<kbd>[<img title="Poland" alt="Poland" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Flag_of_Poland.svg/1280px-Flag_of_Poland.svg.png" width="22">](i18n/README.pl.md)</kbd>
<kbd>[<img title="Kazakhstan" alt="Kazakhstan" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/1280px-Flag_of_Kazakhstan.svg.png" width="22">](i18n/README.kz.md)</kbd>
<kbd>[<img title="Spain" alt="Spain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png" width="22">](i18n/README.es.md)</kbd>
<kbd>[<img title="Korean" alt="Korean" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/1280px-Flag_of_South_Korea.svg.png" width="22">](i18n/README.ko.md)</kbd>
<kbd>[<img title="Hungarian" alt="Hungarian" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1280px-Flag_of_Hungary.svg.png" width="22">](i18n/README.hu.md)</kbd>



## Features


- 📥 **Download & auto complete**. Support download `Minecraft`, `Forge`, `Fabric`, `Quilt`, `OptiFine`, `JVM` from official or third party mirrors.
- ⚡️ **Download Fast**. Reuse socket via HTTP/HTTPS agents, and download the files in parts concurrently.
- 💻 **Cross platform**. The launcher is based on Electron, and supports 🗔 Windows 10/11, 🍎 MacOS, and 🐧 Linux.
- 📚 **Multi-Instancing**. Users can create multiple instances to isolate the different versions, mods and launch settings.
- 🗂 **Manage all resources**. Use (hard/symbolic) links to install resources in instances, keep your disk usage optimal. No copies of mods everywhere! 😆
- 🔥 **Built-in support of CurseForge, Modrinth**. You can download resources inside the launcher.
- 📦 **Support import/export** CurseForge & Modrinth modpacks with compliance!
- 🔒 **Support multiple account systems**. Built-in Microsoft login and Mojang Yggdrasil API. It also has builtin support of [ely.by](https://ely.by/) and [littleskin.cn](https://littleskin.cn). You can also add third-party authentication servers!
- 🔗 **Peer to peer connection between users**. You can play multiplayer over LAN even you are not in same physical LAN!
- 🔑 **Code sign & modern packaging**. Under Windows, you can use `appx` and `appinstaller` to install the app. You won't receive blocking messages from your browser or see SmartScreen errors anymore! 😎

## Core Libraries

This repository also includes the **Minecraft Launcher Core** (`@btnlauncher2/*` packages) — a set of npm packages providing useful functions to build a Minecraft launcher. [API Documentation](https://docs.btnlauncher2.app/en/core)

| Package | Description | Version |
| --- | --- | --- |
| [@btnlauncher2/core](packages/core) | Launch Minecraft | [![npm](https://img.shields.io/npm/v/@btnlauncher2/core.svg)](https://www.npmjs.com/package/@btnlauncher2/core) |
| [@btnlauncher2/installer](packages/installer) | Install Minecraft, Forge, Fabric, Quilt, OptiFine, JVM | [![npm](https://img.shields.io/npm/v/@btnlauncher2/installer.svg)](https://www.npmjs.com/package/@btnlauncher2/installer) |
| [@btnlauncher2/user](packages/user) | User authentication and skin | [![npm](https://img.shields.io/npm/v/@btnlauncher2/user.svg)](https://www.npmjs.com/package/@btnlauncher2/user) |
| [@btnlauncher2/mod-parser](packages/mod-parser) | Parse Forge/LiteLoader/Fabric mods | [![npm](https://img.shields.io/npm/v/@btnlauncher2/mod-parser.svg)](https://www.npmjs.com/package/@btnlauncher2/mod-parser) |
| [@btnlauncher2/curseforge](packages/curseforge) | CurseForge API | [![npm](https://img.shields.io/npm/v/@btnlauncher2/curseforge.svg)](https://www.npmjs.com/package/@btnlauncher2/curseforge) |
| [@btnlauncher2/modrinth](packages/modrinth) | Modrinth API | [![npm](https://img.shields.io/npm/v/@btnlauncher2/modrinth.svg)](https://www.npmjs.com/package/@btnlauncher2/modrinth) |
| [@btnlauncher2/nbt](packages/nbt) | Parse NBT | [![npm](https://img.shields.io/npm/v/@btnlauncher2/nbt.svg)](https://www.npmjs.com/package/@btnlauncher2/nbt) |
| [@btnlauncher2/game-data](packages/game-data) | Load level data or servers.dat | [![npm](https://img.shields.io/npm/v/@btnlauncher2/game-data.svg)](https://www.npmjs.com/package/@btnlauncher2/game-data) |
| [@btnlauncher2/resourcepack](packages/resourcepack) | Parse resource packs | [![npm](https://img.shields.io/npm/v/@btnlauncher2/resourcepack.svg)](https://www.npmjs.com/package/@btnlauncher2/resourcepack) |
| [@btnlauncher2/gamesetting](packages/gamesetting) | Parse game settings | [![npm](https://img.shields.io/npm/v/@btnlauncher2/gamesetting.svg)](https://www.npmjs.com/package/@btnlauncher2/gamesetting) |
| [@btnlauncher2/client](packages/client) | Minecraft client network utilities | [![npm](https://img.shields.io/npm/v/@btnlauncher2/client.svg)](https://www.npmjs.com/package/@btnlauncher2/client) |
| [@btnlauncher2/model](packages/model) | Display player/block models | [![npm](https://img.shields.io/npm/v/@btnlauncher2/model.svg)](https://www.npmjs.com/package/@btnlauncher2/model) |
| [@btnlauncher2/text-component](packages/text-component) | Parse Minecraft text components | [![npm](https://img.shields.io/npm/v/@btnlauncher2/text-component.svg)](https://www.npmjs.com/package/@btnlauncher2/text-component) |
| [@btnlauncher2/forge-site-parser](packages/forge-site-parser) | Parse Forge website | [![npm](https://img.shields.io/npm/v/@btnlauncher2/forge-site-parser.svg)](https://www.npmjs.com/package/@btnlauncher2/forge-site-parser) |
| [@btnlauncher2/file-transfer](packages/file-transfer) | High-performance file downloads | [![npm](https://img.shields.io/npm/v/@btnlauncher2/file-transfer.svg)](https://www.npmjs.com/package/@btnlauncher2/file-transfer) |
| [@btnlauncher2/nat-api](packages/nat-api) | UPnP and NAT-PMP port mapping | [![npm](https://img.shields.io/npm/v/@btnlauncher2/nat-api.svg)](https://www.npmjs.com/package/@btnlauncher2/nat-api) |
| [@btnlauncher2/system](packages/system) | FS middleware for browser/Node | [![npm](https://img.shields.io/npm/v/@btnlauncher2/system.svg)](https://www.npmjs.com/package/@btnlauncher2/system) |
| [@btnlauncher2/unzip](packages/unzip) | yauzl unzip wrapper | [![npm](https://img.shields.io/npm/v/@btnlauncher2/unzip.svg)](https://www.npmjs.com/package/@btnlauncher2/unzip) |
| [@btnlauncher2/semver](packages/semver) | Fabric semver format | [![npm](https://img.shields.io/npm/v/@btnlauncher2/semver.svg)](https://www.npmjs.com/package/@btnlauncher2/semver) |
| [@btnlauncher2/bytebuffer](packages/bytebuffer) | ByteBuffer implementation | [![npm](https://img.shields.io/npm/v/@btnlauncher2/bytebuffer.svg)](https://www.npmjs.com/package/@btnlauncher2/bytebuffer) |

## Contribute

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Voxelum/Btnlaucher2-pc)

For general developer, see [Contributing](./CONTRIBUTING.md)

For i18n localization developer, please follow [Getting Started with Localization](https://docs.btnlauncher2.app/en/guide/i18n)

## LICENSE

[MIT](LICENSE)

## Sponsorship

| [![](https://github.com/DGP-Studio/Snap.Hutao/assets/10614984/73ae8b90-f3c7-4033-b2b7-f4126331ce66)](https://signpath.io/) | Free code signing on Windows provided by [SignPath.io](https://signpath.io/), certificate by [SignPath Foundation](https://signpath.org/) |
| :----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
| [![](https://deno.com/images/deno_logo_4.gif)](https://deno.com/deploy) | [Deno Deploy](https://deno.com/deploy), btnlauncher2 leverage its hassle-free platform for serverless JavaScript applications. Provided by [Deno](https://deno.com/)   |
| [![](assets/EdgeOne.png)](https://edgeone.ai/) | [Best Asian CDN, Edge, and Secure Solutions - Tencent EdgeOne](https://edgeone.ai/),CDN acceleration and security protection for this project are sponsored by Tencent EdgeOne. |

### Sponsor (AFDIAN)

<!-- afdian-start -->
<div style="display: flex; align-items: center; justify-items:center; gap: 0.2em; flex-wrap: wrap;">
<a title="爱发电用户_9d663: ￥390.00" href="https://afdian.com/u/9d663ec6fb6711ec9ace52540025c377"> <img width="100" height="100" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-purple.png?imageView2/1/"> </a>
<a title="爱发电用户_19e29: ￥300.00" href="https://afdian.com/u/19e292c21a1d11ee929a52540025c377"> <img width="100" height="100" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-purple.png?imageView2/1/"> </a>
<a title="ahdg: ￥180.00" href="https://afdian.com/u/dd9058ce20df11eba5c052540025c377"> <img width="70" height="70" style="border-radius: 100%" src="https://pic1.afdiancdn.com/user/dd9058ce20df11eba5c052540025c377/avatar/0c776e6de1b1027e951c6d94919eb781_w1280_h1024_s364.jpg"> </a>
<a title="Kandk: ￥30.00" href="https://afdian.com/u/404b86a078e111ecab3652540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/user/404b86a078e111ecab3652540025c377/avatar/dfa3e35a696d8d8af5425dd400d68a8d_w607_h527_s432.png"> </a>
<a title="白雨 楠: ￥30.00" href="https://afdian.com/u/7f6ad7161b3e11eb8d0e52540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/user/7f6ad7161b3e11eb8d0e52540025c377/avatar/1fa3b75648a15aea8da202c6108d659b_w1153_h1153_s319.jpeg"> </a>
<a title="圣剑: ￥30.00" href="https://afdian.com/u/ef50bc78b3d911ecb85352540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/user/user_upload_osl/8a1c4eb2e580b4b8b463ceb2114b6381_w132_h132_s3.jpeg"> </a>
<a title="同谋者: ￥30.00" href="https://afdian.com/u/7c3c65dc004a11eb9a6052540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-blue.png"> </a>
<a title="染川瞳: ￥5.00" href="https://afdian.com/u/89b1218c86e011eaa4d152540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/user/89b1218c86e011eaa4d152540025c377/avatar/9bf08f81d231f3054c98f9e5c1c8ce40_w640_h640_s57.jpg"> </a>
<a title="爱发电用户_CvQb: ￥5.00" href="https://afdian.com/u/177bea3cf47211ec990352540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-purple.png"> </a>
<a title="水合: ￥5.00" href="https://afdian.com/u/039508f2b17d11ebad1052540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-orange.png"> </a>
<a title="爱发电用户_0c5c8: ￥5.00" href="https://afdian.com/u/0c5c865e08ee11ecba1352540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-purple.png?imageView2/1/"> </a>
<a title="DIO: ￥5.00" href="https://afdian.com/u/7ac297b4722211eab4a752540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-purple.png"> </a>
<a title="爱发电用户_DJpu: ￥5.00" href="https://afdian.com/u/8c23a236cf7311ec9c3452540025c377"> <img width="50" height="50" style="border-radius: 100%" src="https://pic1.afdiancdn.com/default/avatar/avatar-purple.png"> </a>
</div>
<!-- afdian-end -->

## Credits & Acknowledgments

### 🌍 Community & Localization

**[BANSAFAn/Baneronetwo](https://github.com/BANSAFAn)**
Community support and moderation

**[Marmur2020](https://github.com/Marmur2020)**
Complete Ukrainian language translation

**[vanja-san](https://github.com/vanja-san)**
Russian language support

## 📦 Package Maintainers

**[VolodiaKraplich](https://github.com/VolodiaKraplich)**
AUR (Arch User Repository) package maintenance

**[0xc0000142](https://github.com/0xc0000142)**
winget package maintenance

### 🛠️ Development Contributors

**[lukechu10](https://github.com/lukechu10) & [HoldYourWaffle](https://github.com/HoldYourWaffle)**
Launcher core development

**[laolarou726](https://github.com/laolarou726)**
Launcher design and UI/UX

### 💙 Special Thanks

A heartfelt thank you to these individuals for their support and contributions:

[Yricky](https://github.com/Yricky) · [Jin](https://github.com/Indexyz) · [LG](https://github.com/LasmGratel) · [Phoebe](https://github.com/PhoebezZ) · [Sumeng Wang](https://github.com/darkkingwsm) · [Luca](https://github.com/LucaIsGenius) · [Charles Tang](https://github.com/CharlesQT)

---
