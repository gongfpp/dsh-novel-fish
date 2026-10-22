# 公开发布记录

## 发布身份

- 仓库：<https://github.com/gongfpp/dsh-novel-fish>，独立的新 public 仓库；旧 `gongfpp/dsh-touch-fish-novel` 保持只读。
- 包名：`@gongfpp/dsh-novel-fish`，版本 `0.1.0`；通过 GitHub/Release 分发，不宣称已经发布到 npm。
- 宿主：精确适配 DSH Web `0.2.1-rc.2`。不因公开发布扩大兼容范围。
- 源码包含浏览器构建产物、测试、原生聊天截图与第三方许可；Release 提供可安装 tarball 和 SHA-256。

## 证据范围

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

## 公开检查

检查当前跟踪文件与全部可达 Git 历史（最初仅一个实现提交），以及六张真实截图和运行摘要。未发现凭据、私人会话正文、账号标识或截图隐藏元数据。文档中的个人安装绝对路径已泛化；原始历史中的本地路径不是密钥，未重写既有历史。

原图仅含原创验收文本、两道心算及 DSH 原生界面。许可证覆盖 MIT 项目及构建中嵌套的第三方代码：额外收集 JSZip 预打包的 pako、lie、immediate、setimmediate 原许可和 pako 的 zlib 移植声明，避免仅依赖 esbuild 模块图漏收。

以上是已检查范围内的结论，不是“绝对无风险”的承诺。插件没有云同步或跨标签协调；其他未验证环境仍以原验收限制为准。
