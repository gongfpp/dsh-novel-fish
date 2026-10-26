# 公开发布记录

## 0.1.4（2026-10-26）

- 当前发布：[@gongfpp/dsh-novel-fish 0.1.4](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.4)。保留 0.1.0 供回退，不发布 npm 包。
- 将本地 0.1.1–0.1.4 的设置简化、类型追加、原生控件修正和七项审计修复一并公开。功能代码以 `1bd5659` 为基线，发布准备不改阅读逻辑。
- 发布前重新执行 `pnpm verify`：93 项自动测试（原有 92 项加市场契约），并核对重新构建的浏览器产物和许可声明不漂移。
- 索引继续使用 `format: 1` 和完整提交 SHA；只声明精确适配 DSH Web `0.2.1-rc.2`。当前官方指南仍是用户添加索引源，不是官方集中审核商店。
- 重新检查相对已公开 `ac5a687` 的四个功能提交、变更 blob、六张新增截图和第三方许可。已检查范围未发现阻止公开的凭据或私人信息；截图中的通用项目会话片段是真实验收，不冒充合成夹具。新增 `crc-32@1.2.2` 的 Apache-2.0 许可已完整随包附带。
- **新版真实 GUI 全流程仍未复验**，发布不能补足 Cua 访问/绑定限制；详情及手工补验见 [0.1.4 功能验证](multi-region-update.md)。无本轮新版实拍截图，不沿用旧截图作为新版证明。

### 分发实测

- 源码标签 `v0.1.4` 指向 `7c25fa93c7c253a8b1925cc1ddff35a47064c633`；市场提交为 `6840c6380907af4fb33304e32e263560c1f1ebcf`。保留此前本地候选产物，正式发布资产另存到 `dist/release-0.1.4/`。
- [市场提交 CI](https://github.com/gongfpp/dsh-novel-fish/actions/runs/40333436191) 成功。通过匿名 HTTP 请求重新下载安装包、源码 ZIP 和校验文件，三者均返回 200 且逐字等于待发布文件；包内 63 个文件和源码 ZIP 的 66 个文件对齐标签源码（仅包内 JSON 格式化按语义比对）。
- 在全新隔离 DSH_HOME 中分别通过 README 标签、市场生成的固定提交安装 spec、公开 Release tarball 安装；三种方式均成功得到 `0.1.4`。宿主入口导出、客户端 loader 注册和安装后浏览器 bundle 哈希均核对一致，没有更改日常 profile。这里没有启动 GUI 或模型，也不声称代替真实阅读验收。
- 官方宿主索引解析器读取远端 URL 后推荐 `0.1.4`，图标 HTTP 200；没有声称本轮已实拍新版市场卡片。

| Release 文件 | SHA256 |
| --- | --- |
| `gongfpp-dsh-novel-fish-0.1.4.tgz` | `a221eb37bfb6d4f94feba58b7bdb01cd153ead3b1f894d7fd9e14ac655eea7dd` |
| `dsh-novel-fish-source-0.1.4.zip` | `0a163eaa8a654ba8d87fa34ea10690679934eca78fd32cc5bb0b2fcd5bec2b1c` |

机器可核对的完整结果见 [0.1.4 分发记录](evidence/public-release-014-result.json)。

## 0.1.0 历史发布身份

- 仓库：<https://github.com/gongfpp/dsh-novel-fish>，独立的新 public 仓库；旧 `gongfpp/dsh-touch-fish-novel` 保持只读。
- 包名：`@gongfpp/dsh-novel-fish`，版本 `0.1.0`；通过 GitHub/Release 分发，不宣称已经发布到 npm。
- 宿主：精确适配 DSH Web `0.2.1-rc.2`。不因公开发布扩大兼容范围。
- 源码包含浏览器构建产物、测试、原生聊天截图与第三方许可；Release 提供可安装 tarball 和 SHA-256。

## 0.1.0 历史证据范围

原有真实聊天 A/B/C、格式、长篇和停用截图保留在 [验收记录](acceptance.md)。这些验证发生在本地包名时期；公开发布只更改包身份、文档、许可生成和分发接入，不引入阅读功能。

公开版本已重新运行 `pnpm install --frozen-lockfile --ignore-scripts`、`pnpm verify` 和 `pnpm pack --pack-destination dist`：37 项测试全部通过，第三方声明包含 9 个打包依赖。开发配置显式拒绝三个不需要的依赖构建脚本，安装不要求批准执行它们。

### 已完成的公开验证

- [v0.1.0 Release](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.0) 不是草稿，包含可安装包、固定标签源码 ZIP 和 `SHA256SUMS.txt`。
- 使用不带 GitHub 凭据的普通 HTTPS 请求下载两个产物及校验文件，均为 HTTP 200，两个产物的 SHA-256 与本地完全一致。
- 在独立临时 `DSH_HOME` 的三个空 profile 中，分别实际执行 GitHub 标签安装、市场生成的完整 SHA 安装、公开下载 tarball 安装，均成功，未更动日常 `web` profile 的阅读插件状态。
- 安装后的 `--dump-config` 确认 Host patch 被组合；执行安装后客户端产物，确认注册 `@gongfpp/dsh-novel-fish`，导出工厂和 Host `apply` 完整。
- 匿名读取公开索引与图标均为 HTTP 200；用**安装版 DSH 0.2.1-rc.2 的官方解析器**校验 `format: 1`、精确宿主要求和完整 SHA，所得安装 spec 与上面实际安装一致。
- 在本机现有真实 DSH Web 的「发现」页通过 UI 添加了公开索引；卡片显示“小说摸鱼 / 0.1.0 / gongfpp”，安装按钮可用，浏览器无错误。只增加索引源，没有点击日常 profile 的安装按钮，也没有切换阅读插件或书籍。
- GitHub Actions 的[标签源提交构建](https://github.com/gongfpp/dsh-novel-fish/actions/runs/39770634304)与[索引发布构建](https://github.com/gongfpp/dsh-novel-fish/actions/runs/39770816229)均成功；校验重新构建的浏览器产物、许可声明与提交一致。

源码锁定提交：`cf9c931866b1d557ce9e63497c4aaa2ddc9f3bbe`。摘要见 [公开发布验证结果](evidence/public-release-result.json)。本次不宣称把改名后的包在真实聊天中重新执行了全部 A/B/C；原始交互证据与未覆盖环境依然以原验收记录为准。

## 0.1.0 历史公开检查

检查当前跟踪文件与全部可达 Git 历史（最初仅一个实现提交），以及六张真实截图和运行摘要。未发现凭据、私人会话正文、账号标识或截图隐藏元数据。文档中的个人安装绝对路径已泛化；原始历史中的本地路径不是密钥，未重写既有历史。

原图仅含原创验收文本、两道心算及 DSH 原生界面。许可证覆盖 MIT 项目及构建中嵌套的第三方代码：额外收集 JSZip 预打包的 pako、lie、immediate、setimmediate 原许可和 pako 的 zlib 移植声明，避免仅依赖 esbuild 模块图漏收。

以上是已检查范围内的结论，不是“绝对无风险”的承诺。插件没有云同步或跨标签协调；其他未验证环境仍以原验收限制为准。
