# 公共社区市场与收录进展

核验日期：2026-10-27。插件 `@gongfpp/dsh-novel-fish` **0.1.4**，仅声明适配 DSH Web **0.2.1-rc.2**。

## 哪个来源优先

本轮优先 **[awesome-dsh-plugin 主目录](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)**，不是本项目自己的索引。核验时主目录约 2.09 万星、6,896 条独立 YAML 登记；更重要的是，[dsh-market 客户端](https://github.com/dsh-market/dsh-market)明确消费该目录，[Harness Desktop 的市场接入源码](https://github.com/anywhere-labs/dsh-desktop/blob/9cea9ddd8c90f9fb15bd4d392f6a2360c191c821/dsh-desktop-next/src/client/market-toggle.ts)也有集成，且目录仍在维护并接受外部投稿。

这些证据支持把它作为首选社区目录，不证明它是所有 DSH 用户唯一或官方认可的商店。官方原版 DSH 与第三方桌面／Web 分支也不是同一应用；第三方客户端内置某个源，不代表原版 DSH 默认内置该源。多个镜像或消费同一上游的客户端不重复投稿。

## 实际操作和状态

“合并”“网页目录已收录”“可在原生市场安装”是三个不同状态，下表不混用。

| 独立来源 | 本轮操作与核验结果 | 当前限制 |
| --- | --- | --- |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 已合并 [PR #9655](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/9655)，固定 v0.1.4 的公开 tarball 已进入社区目录；[DSH Market](https://dshmarket.com/) 当前在线目录和 [插件详情页](https://awesome-dsh-plugin.com/p/gongfpp/dsh-novel-fish/)均能检索、提供 tarball 安装命令。 | npm 包现已公开发布，列表的 npm 映射按仓库源自动识别，无需手工添加 `npm:`（贡献指南明确拒绝该字段）；2026-10-27 实查 npm-served 和网页 format-1 索引仍未包含本插件，等待目录生成任务同步。可视化市场的 GitHub Release 安装入口仍可用。 |
| [imsai 公共目录 / 1024store 上游](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | [PR #707](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/pull/707) 已通过静态审核并于 14:58:51 UTC 合并；主分支的[插件条目](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/main/catalog/plugins/gongfpp--dsh-novel-fish.json)已可读取。 | npm 包已公开发布。1024 Store 公开搜索 API 已收录本插件，但截至 2026-10-27 仍返回 GitHub 安装命令；其贡献规则明确表示 npm 新上架会自动识别，无需为相同条目再建重复 PR。未确认 1024 Store 内的 npm 安装选项已刷新。 |
| [dshopen](https://dshopen.org/) | 维护者已同意并关闭 [申请 #101](https://github.com/polang233/dsh-plugin-index/issues/101)；[公开 format-1 索引](https://dshopen.org/index.json)已有准确的 0.1.4、固定 Git 提交和 `verified`（已审查）标记。 | 可以在原版 DSH 发现页添加公共索引、搜索并安装；仍只声明 rc.2 兼容，本轮未实际完成新版 GUI 安装实拍。 |
| [dpharness](https://dpharness.com/) | 使用公开投稿表单对应接口提交仓库；HTTP 200，返回 `ok: true`、`moderated: true`、`hidden: true`。 | 已进入审核，不是公开上架；随后公开搜索仍为 0 条。 |
| [dsh-web 社区目录](https://github.com/zhu1090093659/dsh-community-plugins) | 已提交 [PR #60](https://github.com/zhu1090093659/dsh-community-plugins/pull/60)，仅追加一个条目；在本地执行上游校验及 9 项测试通过。 | 等待人工审核。文案明确仅 rc.2，不声称兼容该索引包当前依赖的 rc.3+ Web 壳；没有虚构 npm 包。 |
| [dshfind](https://dshfind.com/en/plugins/gongfpp/dsh-novel-fish) | 网页／公共 API 目录已自动收录准确的新仓库，首次发现为 2026-10-23；已有 topic，无须重复投稿。 | 先前快照仍旧；2026-10-27 再次请求其 npm-only format-1 索引遇到超时，尚无法核实本次 npm 上架后的同步结果。 |
| [brade 公共目录](https://github.com/bradeGithub/DSH-Plugins-Marketplace) | 实读公开 `registry.json`，20,820 条中有准确的新仓库与包名；按 topic 自动收录，无须重复 issue。 | 当前元数据版本仍为 0.1.0，不当成 0.1.4 验收。该 JSON 不是原版 DSH 的 format-1 索引。 |
| [2BingLing DSH Market](https://dsh.market/) | 实读公开 `plugins.json`，15,182 条中已有准确的新仓库与 Cordis 类型、安装命令；无须重复提交。 | README 摘要和 tarball 命令仍为旧版快照，不声称新版已刷新；使用该市场自己的 schema。 |
| [bruc 社区来源](https://github.com/bruc3van/awesome-dsh-plugin) | `data/approved.json` 已有准确的新仓库，批准日期为 2026-10-23；不重复申请已存在的批准记录。 | 当前公开 CATALOG、`data/market.json` 和 1,000 条 format-1 索引都没有本插件，不能称可搜索／可安装。推荐展示区要求 >10 星，本仓库不满足，未走该通道。 |
| [dshmarketplace.dev](https://dshmarketplace.dev/submit) | 遵从站点推荐的自动途径：保留 `dsh-plugin` topic，更新本仓库公开简介以反映当前功能；主目录 PR 是另一条明确投稿路径。 | 当前站点搜索为 0；手工表单静态脚本读取返回 403，未绕过访问控制、未伪造手工提交回执。等待自动同步不能写成已经收录。 |

此外发现规模较小的 vbarter/dsh-plugin-registry，但未找到足够的独立消费／采用证据，不称为主流并未额外刷申请。生态兼容性雷达不当作可安装市场；归档仓库、单作者集合、派生镜像以及同名无关项目均排除。

## 原生索引与 npm 的边界

本插件已经能从 Git 标签、完整提交与公开 tarball 安装，不必为了某个目录改变宿主兼容范围。主目录投稿使用固定产物：

- [v0.1.4 发行页](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.4)
- 完整源码提交：`7c25fa93c7c253a8b1925cc1ddff35a47064c633`
- 公开 tarball：<https://github.com/gongfpp/dsh-novel-fish/releases/download/v0.1.4/gongfpp-dsh-novel-fish-0.1.4.tgz>

**npm 官方仓库现已公开发布** `@gongfpp/dsh-novel-fish@0.1.4`，公开 tarball 与原始产物校验一致，匿名 npm 下载和全新临时 DSH `0.2.1-rc.2` 安装实测通过（证据见 [发布记录](release.md)）。已收录的 awesome 目录和 1024 Store 均通过 npm registry 自动发现对应包；其中 awesome 源明确拒绝手写 `npm:` 字段，因此无需重复投稿。目录网站、host 的 format-1 索引刷新时间未必与 npm 发布同步；2026-10-27 抽查仍存在滞后，不能因此宣称所有市场已一键安装。

原版 DSH 现可添加 [dshopen 公共 format-1 索引](https://dshopen.org/index.json) 搜索并安装 `0.1.4`；独立 [DSH Market](https://dshmarket.com/) 也可搜索、使用 GitHub Release 包安装，仍可选用[项目自建索引](marketplace.md)或 README 的固定版本命令。**npm 发布已完成，但部分 npm-only 市场索引尚未刷新或尚未核实**；继续区分官网 npm 可安装、公共目录收录和第三方市场可搜索安装三个状态。

## 投稿依据和证据

- [主目录贡献规则](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md)：单条 YAML、真实 DSH bundle、准确简介；npm 推荐但不是目录收录前提，GitHub Release tarball 可选。
- [imsai 目录规则](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/main/CONTRIBUTING.md)：新增条目静态审核与自动合并；未发 npm 不等于目录拒收。
- [dshopen 贡献规则](https://github.com/polang233/dsh-plugin-index/blob/main/.github/CONTRIBUTING.md)：未发布 npm 可由维护者确认完整 Git 源。
- [dshfind 收录说明](https://github.com/hikariming/dshfind#submit-your-plugin)、[brade 收录标准](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/main/STANDARD.md)、[2BingLing 贡献规则](https://github.com/2BingLing/dsh-market/blob/master/CONTRIBUTING.md)。
- [dsh-web 索引 AGENTS](https://github.com/zhu1090093659/dsh-community-plugins/blob/main/AGENTS.md)及[实际 validator](https://github.com/zhu1090093659/dsh-community-plugins/blob/main/scripts/community-index.cjs)：追加元数据，不填不存在的 npm 包；使用当前契约而非过时的 rank 文字要求。
- [bruc 贡献规则](https://github.com/bruc3van/awesome-dsh-plugin/blob/main/CONTRIBUTING.md)、[可安装索引规则](https://github.com/bruc3van/awesome-dsh-plugin/blob/main/scripts/host-market/README.md)。
- [结构化结果](evidence/community-market-014-result.json)保存精简回执、PR、审核状态及已核验公开目录 URL。未保存登录凭据、个人浏览器数据或完整投稿响应里的 README 副本。

这些是公开 HTTP/API、目录数据和 GitHub 审核记录的核验，不是新一轮真实 DSH GUI 截图。0.1.4 的 GUI A/B/C、悬停和键盘复验缺口保持原样，没有因收录申请变成“已验证”。
