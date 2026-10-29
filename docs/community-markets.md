# 公共社区市场与收录进展

最新发布更新：**2026-10-29**，GitHub **0.1.5**；npm 仍为 **0.1.4**。仅声明适配 DSH Web **0.2.1-rc.2**。下方各站的 10 月 28 日及更早快照保留原日期，不当作本日刷新结果。

## 0.1.5 更新

- [GitHub Release](https://github.com/gongfpp/dsh-novel-fish/releases/tag/v0.1.5) 已公开，源码固定为 `61a0e62d7caa06f3101b450277f3ef530e1561f8`；提供预构建安装包、源码和校验文件。npm 未发布 0.1.5，因此依赖 npm 的自动目录目前不能据此变成新版。
- Awesome 仅更新本插件 YAML 中的固定 tarball：[PR #10407](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/10407)，提交 `38e844f78ef1517053decd493eda2d0af2e6bcce`，等待审核。未修改生成 README 或添加非法 `npm:`。
- dshopen 按规则在[原申请 #101 留言请求复审](https://github.com/polang233/dsh-plugin-index/issues/101#issuecomment-6498960335)，提供新版本与完整 SHA；旧申请关闭不代表新版本已审核。
- Workshop 在[原 PR #60 补充更新说明](https://github.com/zhu1090093659/dsh-community-plugins/pull/60#issuecomment-6498962198)，不重复申请。实际条目只有仓库和 npm 包名，没有固定 tarball，故无需改写清单；PR 仍待审。
- 本轮未宣称这些第三方网站或原生安装索引已刷新到 0.1.5，也未扩大宿主兼容范围。

## 哪个来源优先

本轮优先 **[awesome-dsh-plugin 主目录](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)**，不是本项目自己的索引。10 月 26 日核验时主目录约 2.09 万星、6,896 条独立 YAML 登记；更重要的是，[dsh-market 客户端](https://github.com/dsh-market/dsh-market)明确消费该目录，[Harness Desktop 的市场接入源码](https://github.com/anywhere-labs/dsh-desktop/blob/9cea9ddd8c90f9fb15bd4d392f6a2360c191c821/dsh-desktop-next/src/client/market-toggle.ts)也有集成，且目录仍在维护并接受外部投稿。

这些证据支持把它作为首选社区目录，不证明它是所有 DSH 用户唯一或官方认可的商店。官方原版 DSH 与第三方桌面／Web 分支也不是同一应用；第三方客户端内置某个源，不代表原版 DSH 默认内置该源。多个镜像或消费同一上游的客户端不重复投稿。

## 现在可用的 Awesome 安装索引

在原版 DSH「插件 → 发现」的索引源管理中添加：

```text
https://awesome-dsh-plugin.com/index.json
```

搜索 **dsh-novel-fish** 或 **小说摸鱼**。2026-10-28 实读该索引，3,823 条中已有准确的 npm `0.1.4` 和精确宿主要求；安装版 DSH `0.2.1-rc.2` 的官方解析器接受整个索引，生成 `@gongfpp/dsh-novel-fish@0.1.4`，该命令已在全新隔离 profile 实际安装成功。**本轮未操作真实 GUI 安装按钮**。

同一目录的无版本 jsDelivr 地址 `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` 当时仍命中旧版 `2026.1027.11136`（3,730 条，无本插件）；registry latest 已是 `2026.1028.11655`。这是 CDN 别名缓存滞后，**不是还缺 npm 映射**。新版固定地址已验证与官网逐字一致：

```text
https://cdn.jsdelivr.net/npm/dsh-plugin-catalog@2026.1028.11655/index.json
```

固定版本地址只适合临时验证，不会跟随以后目录更新；日常优先官网地址，已添加官网源的用户可点刷新。[jsDelivr 官方刷新工具](https://www.jsdelivr.com/tools/purge)需要人工验证码，本轮未请求清理、未绕过验证。

## 实际操作和状态

“合并”“网页目录已收录”“可在原生市场安装”是三个不同状态，下表不混用。

| 独立来源 | 本轮操作与核验结果 | 当前限制 |
| --- | --- | --- |
| [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 已合并 [PR #9655](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/9655)，固定 v0.1.4 tarball 保留；**官网 format-1 安装索引已自动收录 npm 0.1.4**。[DSH Market](https://dshmarket.com/)和[详情页](https://awesome-dsh-plugin.com/p/gongfpp/dsh-novel-fish/)也已收录。 | 官网已更新，无版本 CDN 镜像仍有旧缓存。贡献指南拒绝手写 `npm:`，生成的 npm-map 也不是投稿文件，因此不补非法字段、不重复申请。 |
| [imsai 公共目录 / 1024store 上游](https://github.com/imsai-sh/awesome-deepseek-harness-plugins) | [PR #707](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/pull/707) 已合并，[条目](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/main/catalog/plugins/gongfpp--dsh-novel-fish.json)和站点公开 API 均已有本插件。 | 10 月 28 日 API 仍只有 GitHub method，`verification: unknown` / `code: not_checked`，尚无 npm method，不能称 npm 一键安装已上线。该目录 schema 严格禁止 `npm` 字段；实际采集由站点维护者任务完成，公开源码未给出可承诺的刷新周期。 |
| [dshopen](https://dshopen.org/) | 维护者已同意并关闭 [申请 #101](https://github.com/polang233/dsh-plugin-index/issues/101)；[公开 format-1 索引](https://dshopen.org/index.json)已有准确的 0.1.4、固定 Git 提交和 `verified` 标记。 | Git 来源已可用，不必为同版本切换来源重提申请；仍只声明 rc.2 兼容，本轮未完成新版 GUI 安装实拍。 |
| [dpharness](https://dpharness.com/) | 原投稿已可在[公开搜索 API](https://dpharness.com/api/plugins?q=gongfpp%2Fdsh-novel-fish&take=5)查到，10 月 28 日返回准确仓库、1 条结果。 | 网页目录已公开；当日 3,151 条原生安装索引中仍无本插件，不能混作安装索引收录。 |
| [dsh-web 社区目录](https://github.com/zhu1090093659/dsh-community-plugins) | 在原 [PR #60](https://github.com/zhu1090093659/dsh-community-plugins/pull/60) 分支补入 **`npm: @gongfpp/dsh-novel-fish`**，只新增一行，其他条目、说明及兼容范围不变；上游 gate 与 9 项测试通过，远端读回一致。 | PR 仍待人工审核，不算已合并。仅声明 rc.2，不声称兼容该索引包当前依赖的 rc.3+ Web 壳。 |
| [dshfind](https://dshfind.com/en/plugins/gongfpp/dsh-novel-fish) | 网页／公共 API 已自动收录准确的新仓库，首次发现为 2026-10-23；已有 topic，无须重复投稿。 | 10 月 28 日 npm-only format-1 索引可读取，5,781 条中仍无本插件；不再把此前超时当作当前结果。 |
| [brade 公共目录](https://github.com/bradeGithub/DSH-Plugins-Marketplace) | 10 月 26 日实读 `registry.json`，20,820 条中有准确的新仓库与包名；按 topic 自动收录，无须重复 issue。 | 该快照版本为 0.1.0，本轮未重新核验；不当成 0.1.4 验收。该 JSON 不是原版 DSH 的 format-1 索引。 |
| [2BingLing DSH Market](https://dsh.market/) | 10 月 26 日实读 `plugins.json`，15,182 条中已有准确的新仓库与 Cordis 类型、安装命令；无须重复提交。 | 原快照 README 和 tarball 命令仍旧，本轮未复核；使用该市场自己的 schema。 |
| [bruc 社区来源](https://github.com/bruc3van/awesome-dsh-plugin) | 10 月 26 日核验 `data/approved.json` 已有新仓库，批准日期为 2026-10-23；不重复申请批准。 | 当时公开 CATALOG、`data/market.json` 和 1,000 条 format-1 索引均无本插件，本轮未复核。推荐展示区要求 >10 星，本仓库不满足。 |
| [dshmarketplace.dev](https://dshmarketplace.dev/submit) | 保留 `dsh-plugin` topic 与准确公开简介，遵循自动收录路径；主目录 PR 已合并。 | 10 月 28 日 1,718 条原生安装索引中仍无本插件。原手工表单脚本读取返回 403，未绕过访问控制或伪造回执；不以自动收录预期冒充成功。 |

此外发现规模较小的 vbarter/dsh-plugin-registry，但未找到足够独立采用证据，不称为主流并未额外刷申请。生态雷达、归档项目、单作者集合和派生镜像均不当作另一个独立市场。

## npm 与清单更新的边界

npm 官方仓库已公开发布 `@gongfpp/dsh-novel-fish@0.1.4`，时间为 `2026-10-27T04:44:37.774Z`。**本机 `npm whoami` 未登录不代表包未发布**；判断应读取公开 registry，而不是从本地认证状态推断。

10 月 28 日重新验证官方 tarball 的 SHA-512 integrity、SHA-1、SHA-256，66 个文件无不安全路径或特殊条目；浏览器 bundle 与当前源码产物完全一致。用 Awesome 官方解析所得 npm spec 在全新临时 DSH `0.2.1-rc.2` profile 安装及列出版本成功，未改日常 profile，没有模型请求。

主目录 YAML 和 imsai JSON 都不允许手填 npm；无需为自动映射重复建 PR。唯一适用的手工修改是在尚未合并的 Workshop 新条目里补合法 scoped 包名。既有 Git 标签、完整提交、自建索引和固定 Release tarball 保留，不改变宿主兼容范围或重新发布相同版本。

## 投稿依据和证据

- [主目录 npm 映射规则](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md#L234-L242)：自动探测，拒绝手填；[已成功的目录生成任务](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/actions/runs/40621332540)及新版 npm catalog 已包含本插件。
- [imsai 严格 schema](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/main/catalog/schema/plugin.schema.json)、[实际校验](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/blob/main/scripts/lib/catalog-entry.mjs#L82-L103)和[采集任务边界](https://github.com/imsai-sh/dsh-1024store/blob/main/AGENTS.md#L162-L170)。
- [dshopen 贡献规则](https://github.com/polang233/dsh-plugin-index/blob/main/.github/CONTRIBUTING.md)、[dsh-web AGENTS](https://github.com/zhu1090093659/dsh-community-plugins/blob/main/AGENTS.md)及[validator](https://github.com/zhu1090093659/dsh-community-plugins/blob/main/scripts/community-index.cjs)。
- [10 月 28 日 npm／索引核验](evidence/npm-market-014-result.json)记录本次哈希、索引版本、隔离安装和单行清单更新；[10 月 26 日原投稿记录](evidence/community-market-014-result.json)保持历史快照，不覆盖旧证据。[发行安装记录](release.md)保留原 npm 发布验证。

以上是公开 HTTP/API、审核记录和隔离 CLI 验证，不是新一轮真实 DSH GUI 截图。0.1.4 的 GUI A/B/C、悬停和键盘复验缺口保持原样，没有因市场收录变成“已验证”。
