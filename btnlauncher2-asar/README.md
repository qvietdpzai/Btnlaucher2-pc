# @btnlauncher2/app-&lt;platform&gt;

Prebuilt `app.asar` bundles of [Btn Minecraft Launcher](https://btnlauncher2.app), one
package per platform.

These packages are **not** meant to be installed as a dependency. They exist
only to mirror the launcher's asar payload through the npm CDN so that users
behind the GFW (via [npmmirror.com](https://npmmirror.com)) can fetch hot
updates and bootstrap the portable installer quickly.

One package is published per platform, each matching a launcher release:

```
@btnlauncher2/app-win        @btnlauncher2/app-win-ia32
@btnlauncher2/app-mac        @btnlauncher2/app-mac-arm64
@btnlauncher2/app-linux      @btnlauncher2/app-linux-arm64
```

Each package contains the uncompressed asar, its checksum, and (on Windows) the
exe icon:

```
app.asar
app.asar.sha256
icon.ico          # win packages only
```

The `package.json` also carries a custom `electron` field pinning the exact
Electron version the asar was built against, which the portable script
installer ([`installer/install.ps1`](../installer/install.ps1)) reads to fetch
the matching Electron prebuilt from the mirror.

Consumers download the **package tarball** (npmmirror's per-file `/files/`
endpoint is whitelist-only; tarballs are unrestricted) and extract `app.asar`:

```
https://registry.npmmirror.com/@btnlauncher2/app-win/-/app-win-<version>.tgz
```

Publishing is automated by the release pipeline
(`.github/workflows/deploy-release.yml`); the asar files are populated in CI and
are not committed to the repository. `package.json` here is a template — its
`name`/`version`/`electron` are overwritten per platform at publish time.
