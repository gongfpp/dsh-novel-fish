# 公开发布记录

## 0.2.0：1.0 功能定稿（2026-11-04）

- 范围：合并 0.1.6 的兼容声明与发布记录、0.1.7 的兼容候选和 0.1.8 的阅读行为，作为 1.0 的功能基线；此后只做数据安全、验证覆盖和发布流程收敛，不再改阅读功能。0.1.7 与 0.1.8 均未单独发布，随本版一起发布。
- 兼容声明从 0.1.6 的 `>=0.2.1-rc.2 <0.3.0-0` 收紧为 `>=0.2.1-rc.2 <=0.2.2-alpha.2`：区间是准入策略，不是验收结论；真实页面验收只在 alpha.2 完成，rc.3–rc.5 为宿主契约探针结果。收紧后未知 alpha 版本失败关闭，不静默降级。
- 新增设置「同一区域再次展开续读」（默认关闭，关闭时行为与 0.1.6 相同）；聊天 DOM 观察合并到一帧；宿主契约探针增至 7 项（标题 shimmer 层、DisclosureRow、会话身份、turn-process 折叠锚点）。
- `pnpm verify`：110 项测试、109 通过、0 失败、1 跳过（HOST_ROOT 缺省时跳过真实宿主集成）。`HOST_ROOT` 探针：ok=true、7 项通过、claims=0（宿主 DSH 0.2.2-alpha.2）。
- 真实页面验收：在运行中的 127.0.0.1:3080 实例上，用独立临时浏览器 profile 先以 0.1.7 得到第 1 段基线，再安装 0.2.0 候选包；页面未刷新即完成客户端热更新（timeOrigin、会话与展开状态不变），插件详情页版本更新，服务 PID 97856 未重启。续读开关默认关闭，开启后同一区域依次得到第 2、3、4 段；关闭后重复展开保持第 4 段；另一区域读到第 5 段；进度保留。证据见 [0.2.0 验收证据](evidence/continuous-reading-020-result.json)。
- 尚未验证：真实聊天中的键盘、悬停、触屏展开路径，展示模式切换与 turn-process 折叠 reset，虚拟化重挂载，以及用户已打开的浏览器标签页。

## 0.1.6 宿主兼容区间与 npm 同步（2026-11-03）

- 改动只有兼容声明：`engines.dsh` 从精确 `0.2.1-rc.2` 改为区间 `>=0.2.1-rc.2 <0.3.0-0`，使 rc.3 及之后的 0.2.x 宿主能通过 preflight。阅读行为、书库、进度和浏览器 bundle 未变。
- npm 上此前只有 `0.1.4`（`0.1.5` 当时没有 npm 登录态，只走了 GitHub Release）。本次直接发 `0.1.6`，一次包含 0.1.5 的原生设置和本版兼容区间；没有单独补发 `0.1.5`，因为商店按 `latest` 取包，补一个只差兼容声明的中间版本只会让用户装到旧行为。`npm view` 现有版本为 `0.0.0-stage`、`0.1.4`、`0.1.6`。
- **区间是准入策略，不是验收结论。** 真实宿主上完整跑过的仍只有 DSH Web `0.2.1-rc.2`；`0.2.1-rc.3` 及之后的 GUI 行为未实测，不以后续版本的真实表现为默认成立。
- `pnpm verify`：`pnpm run build` 重建后 `lib/client.js` 与 HEAD 逐字一致（先用 npm 装依赖时出现过 `node_modules/.pnpm/...` 路径差异，已回滚并改用 pnpm 重装后重建，确认可复现），`pnpm test` **100/100** 通过。
- 发布契约测试同步更新：清单断言改为新区间；索引契约从「每个历史条目都必须等于当前清单」改为「最新条目必须等于清单，历史条目保留各自声明」，否则 0.1.0/0.1.4 的精确声明会被追溯篡改。
- npm 已发布 [@gongfpp/dsh-novel-fish@0.1.6](https://www.npmjs.com/package/@gongfpp/dsh-novel-fish)，registry 时间 `2026-11-03T07:29:09.855Z`，`dist-tags.latest` 指向 `0.1.6`，75 个文件。
  - shasum（SHA-1）`2365afae37252ecc84e1ec6aa67b41765021eede`
  - integrity `sha512-VUqcMZEar18bEvsHe48/CC+Hv2FERo8nXdQn0J7PBzMe87x+OkQ4tKaCa8sALwvVrOheX/+0uHa0wgdYIz4DBA==`
  - 本地 `npm pack @gongfpp/dsh-novel-fish@0.1.6` 取得的 tarball 与 registry shasum 一致，作为本次 Release 附件；该文件 SHA-256 为 `07e045ae43695cb82014cd25c00261ca52b361a321f311bfcff8a3ec1aa08d7e`（早前一次 npm 装依赖产出的本地包 SHA-256 为 `9ca23410…`，已废弃，不要用）。
- 账号启用了 2FA，`npm publish` 首次返回 `EOTP`；改用带 `Bypass 2FA` 的 granular access token（权限 `Read and write (publish and stage)`、仅限本包、90 天）完成发布，未关闭账号 2FA。
- [GitHub Release v0.1.6](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.6) 于 `2026-11-03T07:34:50Z` 公开（tag 指向 `16f7c31`，非 prerelease）。附件：安装包、源码 ZIP（`git archive` 取自标签，91 项、无不安全路径）、`SHA256SUMS`。三个附件匿名下载均 HTTP 200，下载后 `sha256sum -c SHA256SUMS` 两项 OK。
- 索引条目 `source.commit` 固定为 `16f7c31e7747395af4dbc527f2717b759833b098`（源码提交）。**注意：`index.json` 和 `docs/**` 都在 `package.json` 的发布文件列表里**，所以已发布 tarball 内的 `index.json` 只到 `0.1.5`、`docs/release.md` 也没有本节。追加记录本身会改变包内容，因此不在本版内回填——tarball 与 registry 的对应关系以 shasum 为准，仓库主干另行补记。
- `index.json` 的 `versions` 是「公开发布目录」，来源可以是 npm 也可以是 GitHub Release，**不等价于 npm 上存在该版本**：`0.1.0`、`0.1.5` 都从未出现在 npm。因此不能用它去校验 npm 安装能力。

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
