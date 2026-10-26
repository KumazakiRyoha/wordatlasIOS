# Windows 编译和 iPhone 测试

你可以始终使用 Windows：在 GitHub 的 macOS 运行器编译，再在 Windows 上签名并安装到自己的 iPhone。无需购买 Mac。本流程无需在 GitHub 保存 Apple 密码、签名证书或开发者密钥，也不会上传到 App Store / TestFlight。

## 获取 IPA

1. 打开 https://github.com/KumazakiRyoha/wordatlasIOS/actions 。
2. 选择 **Build iPhone IPA**，打开最新一次成功的运行。
3. 在运行底部 **Artifacts** 下载 **WordAtlas-iPhone-unsigned**（需要登录 GitHub）。
4. 在 Windows 解压下载的 ZIP，得到 `WordAtlas-unsigned.ipa` 和 SHA-256 校验文件。

每次推送到 `codex/ios-app` 或 `main` 都会触发构建。需要重跑时，可在已有运行右上角选择 **Re-run all jobs**。工作流进入默认分支后，也可以使用 **Run workflow** 手动选择分支运行。

IPA 包含完整词库、插画和录音，下载文件较大。为减少产物存储占用，只保留 **1 天**；过期后重新运行工作流即可。

## 在 Windows 安装到 iPhone

1. 从 https://sideloadly.io/ 下载官方 Windows 版 Sideloadly，按其要求安装 Apple 的设备驱动及 iTunes / iCloud 组件。
2. 用数据线连接并解锁 iPhone，选择“信任此电脑”。
3. 在 Sideloadly 选择你的手机，把 `WordAtlas-unsigned.ipa` 拖进去。
4. 在本机 Sideloadly 中登录你自己的 Apple 账号，完成验证，再点击 **Start**。不要把密码或验证码写进仓库或聊天。
5. 根据手机提示，在 **设置 → 通用 → VPN 与设备管理** 中信任开发者；若要求开发者模式，在 **设置 → 隐私与安全性 → 开发者模式** 中开启并重启确认。
6. 在手机桌面打开 **词光**。

这是给真机使用的 arm64 构建；下载 IPA 后还需要签名，不能通过“文件”App 直接点击安装。免费 Apple 账号的个人测试签名通常有效 7 天，需要重新签名或使用 Sideloadly 的刷新功能。

刷新和更新时保持相同 Apple 账号及 Bundle ID，并覆盖安装。卸载前务必从“我的”导出备份，避免丢失本地进度。

## 首轮真机检查

- 首次启动、底部导航、深浅主题和安全区。
- 搜索和拼写键盘，词卡关闭及切换。
- 单词英美发音、例句与环境声。
- 完成学习后强退重开，确认进度保留。
- 开启飞行模式后重新启动，确认词库、插画和录音可用。
- “我的”导出备份到“文件”，再通过文件选择器导入。

CI 编译成功只证明工程可构建，不代表上述真机行为已验证。Sideloadly 的安装、Apple 账号验证和手机信任操作由设备所有者在本机完成。

## 来源

- GitHub macOS 运行器：https://docs.github.com/en/actions/reference/runners/github-hosted-runners
- Sideloadly：https://sideloadly.io/
- Apple 个人测试账号限制：https://developer.apple.com/help/account/basics/about-your-developer-account/
