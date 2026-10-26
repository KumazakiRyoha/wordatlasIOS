# 词光 iOS

本分支基于 https://github.com/designfuchen/word-atlas ，使用 Capacitor 8 + WKWebView 将原 React 界面打包为 iOS 应用。今日、图鉴、练习、我的、星图、学习流程沿用上游代码、字体、插画和配色。

**只有 Windows？** 参见 [Windows 编译和 iPhone 安装](windows-iphone.md)：GitHub Actions 编译 IPA，Windows 使用 Sideloadly 签名安装。

## 已实现

- 本地打包完整公开词库、插画、音频；核心学习功能无需联网。
- 保留原移动端底部导航；补齐刘海、灵动岛、横屏和 Home 指示条安全区。
- 键盘出现时隐藏底部导航，搜索弹层随 WebView 高度缩放，输入字号避免系统自动放大。
- 系统状态栏跟随应用深浅主题。
- 通过系统分享菜单导出 JSON 备份，可保存到“文件”或 AirDrop；导入沿用系统文件选择器。
- 原生包不注册网页 Service Worker，资源更新随应用版本交付。

## 在 Mac 上运行

需要 Node.js 22+、Xcode 26+，支持 iOS 15+。安装 Xcode 的 iOS 平台和模拟器。

```sh
npm ci
npm run ios:sync
npm run ios:open
```

也可用 `pnpm install --frozen-lockfile`，再运行同名脚本。工程使用 Swift Package Manager，首次打开需要下载官方 Capacitor Swift 依赖。

在 Xcode 选择 App target → Signing & Capabilities，选择自己的 Team，并将默认 Bundle Identifier `com.wordatlas.ios` 改为自己的唯一标识。同步修改根目录 `capacitor.config.json` 的 appId。选择 iPhone 模拟器或已配对的真机，点击 Run。

```sh
npm run ios:build  # 只生成 Web 资源，Windows 也可运行
npm run ios:sync   # 构建并同步本地资源、插件和原生工程
```

`ios/App/App/public` 为生成文件，不提交到 Git；每次修改网页后都要执行 `ios:sync`。不要将 server.url 设置为线上网页：本实现使用本地资源。资源量较大，首次构建/同步耗时较长。

## 数据与授权

进度使用原项目的本地存储，网页和 App 不自动同步。卸载应用前请导出备份。备份导入有原项目的格式校验和 30 MB 大小限制。

代码及 UI：MIT（见根目录 LICENSE）。词库、插画与录音：**Word Atlas contributors — CC BY 4.0**，https://creativecommons.org/licenses/by/4.0/ 。此分支修改了 iOS 容器、布局适配和备份导出，未修改词库内容。Fraunces 字体保留原 OFL 许可。

## 验证与发布边界

Windows 可进行 TypeScript 构建、Web 测试和词库校验，不能替代 Xcode 编译和真机测试。发布前在 Mac 验证：首次启动、深浅主题、刘海和横屏、搜索和拼写键盘、英美音/例句朗读、离线启动、导出到文件再导入、强退重开后进度保持、VoiceOver 和大字体。

Xcode 工程包含文件时间戳访问隐私声明（Filesystem 插件要求）。未启用分析、跟踪、账号或后台音频。App Store 上传前仍需配置自己的签名、版本、图标和隐私信息，并完成真机与审核验证；当前交付不是已签名 IPA。

本次 Windows 验证：TypeScript 与 iOS Web 生产构建通过，21 项现有测试通过，7,298 个词条和配套媒体校验通过（0 个资源错误）；plist 与 storyboard XML 解析通过；Capacitor iOS 同步通过，4 个原生插件已接入，Swift Package 依赖已生成。浏览器访问本地预览未获授权，未完成点击和视觉检查；未进行 Xcode 编译、模拟器或真机测试。

## GitHub Fork

开发仓库：https://github.com/KumazakiRyoha/wordatlasIOS 。开发分支为 `codex/ios-app`，`upstream` 指向原仓库。

```sh
git remote add origin https://github.com/KumazakiRyoha/wordatlasIOS.git
git push -u origin codex/ios-app
```
