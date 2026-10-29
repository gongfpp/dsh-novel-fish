# 公开发布记录

## 0.1.5 原生设置（2026-10-29）

- 设置统一使用宿主 Button、Switch、Input、Menu 和 Modal；移至本插件详情页，去掉浏览器默认文件按钮和重复外框，不改书库、进度或阅读逻辑。
- `pnpm verify` 全量 **100/100** 通过（0 失败／跳过，1910.950958 ms），重建浏览器 bundle 和 10 项依赖许可；`git diff --check` 通过。
- 真实 DSH 验证原生菜单、全选、自定义输入框和系统文件选择器。新控件的文件导入／切书／删除 GUI 全流程及真实聊天 A/B/C 没有重新完成，不能以组件测试代替；[详细验收与实拍](native-settings-update.md)。
- [源码 PR #1](https://github.com/gongfpp/dsh-novel-fish/pull/1) 已合并，源码与标签 `v0.1.5` 固定为 `61a0e62d7caa06f3101b450277f3ef530e1561f8`；[PR CI](https://github.com/gongfpp/dsh-novel-fish/actions/runs/40887341400) 和[主分支 CI](https://github.com/gongfpp/dsh-novel-fish/actions/runs/40887491392) 均成功，功能分支已删除。
- [GitHub Release](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.5) 于 `2026-10-29T14:06:33Z` 公开，包含安装包、源码 ZIP 和校验文件。三个附件匿名下载均 HTTP 200，包与源码 SHA-256 一致。
- 安装包 `gongfpp-dsh-novel-fish-0.1.5.tgz`：`a6b52477815f6c1e5d5aa453cbf6366eda3438aa69d6001aea97701ab53e2392`；源码 ZIP：`3819e37020c4fa0cbe02e01512b1a007efc86939000764056281c9f9fa6f0deb`。归档分别为 74／90 项，无不安全路径，浏览器 bundle 与标签逐字一致。
- 全新临时 `DSH_HOME` 的三个空 profile 中，README 标签、匿名下载的安装包、完整固定 SHA 三条路线均通过真实 DSH CLI 安装并列出 `0.1.5`，三个 bundle 哈希一致；未改日常 profile，不触发模型请求。[结构化回执](evidence/public-release-015-result.json)。
- 按授权以 `launchctl kickstart -k gui/501/com.user.dsh-web` 重启原服务：PID 从 `72959` 变为 `71224`，仍监听 `127.0.0.1:3080`。匿名根请求返回预期的认证 `401`；通过 Cua 的官方启动链接进入真实详情页，再次看到 `0.1.5` 和原生设置，日常 profile 仍链接本项目。未新开替代服务，也未读取或改写私人书库。
- npm 当前仍是 **0.1.4**。本机缺少 npm 发布登录态；本轮通过 GitHub 固定版本分发，不宣称已发布 npm 0.1.5。[各市场更新与待审状态](community-markets.md#015-更新) 分别记录，不把提交申请当成审核通过。


## npm 市场映射复核（2026-10-28）

- Awesome 官网 format-1 索引及 `dsh-plugin-catalog@2026.1028.11655` 已有准确的 npm `0.1.4`；安装版 DSH `0.2.1-rc.2` 官方解析器接受整个索引并生成固定 npm spec。无版本 jsDelivr 地址仍命中旧 `2026.1027.11136`，不是 npm 尚未发布或缺少清单。可用地址见 [社区市场记录](community-markets.md)。
- 重新校验官方 npm tarball 的 SHA-512 integrity、SHA-1、SHA-256、66 个归档文件及浏览器 bundle 一致性；再次在全新临时 `DSH_HOME` 安装并列出 `0.1.4` 成功。未改日常 profile、没有模型请求，不代替新版 GUI 阅读或安装实拍。
- 在原 Workshop PR #60 新条目中仅补一行 scoped npm 包名，保留全部其他元数据和精确 rc.2 声明，上游 gate、9 项测试和远端读回通过。PR 仍待审。其他严格 schema 的目录由自动采集映射，不添加非法字段、不重复投稿、不重新发布相同版本。
- [本次结构化证据](evidence/npm-market-014-result.json)与原 10 月 26 日投稿快照分别保留。

## npm 官方仓库上架（2026-10-27）

- [@gongfpp/dsh-novel-fish@0.1.4](https://www.npmjs.com/package/@gongfpp/dsh-novel-fish) 已正式公开发布，registry 时间为 `2026-10-27T04:44:37.774Z`，dist-tag `latest` 指向 `0.1.4`，不再需要开发者 npm 登录即可下载。
- 官方仓库 tarball 的 SHA-1 为 `31cdf3ab76fc2bcb3ce4be9e3feab7018e5752de`，SHA-256 为 `f0ccc58e7059525cdb8e2be087eb3f3e3537bebf14a4ea9297ca120c1171a8eb`；与本地准备的 1,140,705 字节、66 文件安装包逐字一致。
- 完成不带登录凭据的独立 `npm install @gongfpp/dsh-novel-fish@0.1.4 --ignore-scripts` 测试：版本、宿主补丁 `cordis.patch.yml`、构建完成的 `lib/client.js` 均存在。另在全新临时 `DSH_HOME` 使用 **DSH 0.2.1-rc.2** 的真实 `dsh plugin --profile web add @gongfpp/dsh-novel-fish@0.1.4` 安装并执行 `dsh plugin --profile web list --depth 0`：均成功，日常 profile 未变动，临时目录已清理。
- 本次未更改插件业务代码和浏览器 bundle，仍只保证 DSH Web `0.2.1-rc.2` 兼容，未追加最新版本的真实 GUI 验收。
- 各社区索引的自动识别有同步延迟；npm 上架与某个第三方市场索引已经刷新，是两个不同的状态。可安装的公共市场和待刷新索引详见 [社区市场状态](community-markets.md)。

---

## 0.1.4（2026-10-26）

- 当日通过 GitHub Release 首次发布 [0.1.4](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.4) 并保留 0.1.0 供回退；随后于 2026-10-27 补发 npm，见上方记录。
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
