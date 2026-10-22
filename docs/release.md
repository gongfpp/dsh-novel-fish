# 公开发布记录

## 发布身份

- 仓库：<https://github.com/gongfpp/dsh-novel-fish>，独立的新 public 仓库；旧 `gongfpp/dsh-touch-fish-novel` 保持只读。
- 包名：`@gongfpp/dsh-novel-fish`，版本 `0.1.0`；通过 GitHub/Release 分发，不宣称已经发布到 npm。
- 宿主：精确适配 DSH Web `0.2.1-rc.2`。不因公开发布扩大兼容范围。
- 源码包含浏览器构建产物、测试、原生聊天截图与第三方许可；Release 提供可安装 tarball 和 SHA-256。

## 证据范围

原有真实聊天 A/B/C、格式、长篇和停用截图保留在 [验收记录](acceptance.md)。这些验证发生在本地包名时期；公开发布只更改包身份、文档、许可生成和分发接入，不引入阅读功能。

公开版本已重新运行 `pnpm install --frozen-lockfile --ignore-scripts`、`pnpm verify` 和 `pnpm pack --pack-destination dist`：37 项测试全部通过，第三方声明包含 9 个打包依赖。开发配置显式拒绝三个不需要的依赖构建脚本，安装不要求批准执行它们。

接下来分别核对 GitHub 固定提交安装、Release 下载和官方格式的市场索引。公开网络验证的最终结果在发布完成后补记，不把上传仓库等同于安装成功。

## 公开检查

检查当前跟踪文件与全部可达 Git 历史（最初仅一个实现提交），以及六张真实截图和运行摘要。未发现凭据、私人会话正文、账号标识或截图隐藏元数据。文档中的个人安装绝对路径已泛化；原始历史中的本地路径不是密钥，未重写既有历史。

原图仅含原创验收文本、两道心算及 DSH 原生界面。许可证覆盖 MIT 项目及构建中嵌套的第三方代码：额外收集 JSZip 预打包的 pako、lie、immediate、setimmediate 原许可和 pako 的 zlib 移植声明，避免仅依赖 esbuild 模块图漏收。

以上是已检查范围内的结论，不是“绝对无风险”的承诺。插件没有云同步或跨标签协调；其他未验证环境仍以原验收限制为准。
