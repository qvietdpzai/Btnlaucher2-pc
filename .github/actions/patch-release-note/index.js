
const core = require('@actions/core');

async function main() {
  const body = core.getInput('body')
  const version = core.getInput('version')

  let content = body

  const rpmUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-x86_64.rpm`
  const rpmArmUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-aarch64.rpm`
  const tarUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-x64.tar.xz`
  const tarArmUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-arm64.tar.xz`
  const debUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-amd64.deb`
  const debArmUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-arm64.deb`
  const appImageUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-x86_64.AppImage`
  const appImageArmUrl = `https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-arm64.AppImage`

  content += `\n\n## Downloads\n\n`
  content += `- Windows (x64): [zip](https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-win32-x64.zip)\n`
  content += `- Linux (x64): [AppImage](${appImageUrl}) [deb](${debUrl}) [tar.xz](${tarUrl}) [rpm](${rpmUrl})\n`
  content += `- Linux (arm64): [AppImage](${appImageArmUrl}) [deb](${debArmUrl}) [tar.xz](${tarArmUrl}) [rpm](${rpmArmUrl})\n`
  content += `- Mac (x64): [dmg](https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-x64.dmg)\n`
  content += `- Mac (arm64): [dmg](https://github.com/qvietdpzai/Btnlaucher2-pc/releases/download/v${version}/btnlauncher2-${version}-arm64.dmg)\n`

  core.setOutput('body', content)
}

main();

