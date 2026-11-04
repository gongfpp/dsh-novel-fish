# 0.2.0 同区域续读与刷新合并

## 范围与状态

本地候选版：`@gongfpp/dsh-novel-fish@0.2.0`。公开 npm、GitHub Release 和市场索引尚未发布本版。

本版包含 0.1.7 的 alpha.2 兼容修正（0.1.7 未单独发布，兼容矩阵与限制见 [0.1.7 宿主兼容验证](compatibility-017.md)），以及本轮两组改动：同一区域续读、宿主 DOM 观察的帧合并。宿主范围仍为 `>=0.2.1-rc.2 <=0.2.2-alpha.2`，不因本轮改动扩大或缩小。

## 新行为：同一区域接着读

设置位于 **插件 → 小说摸鱼详情页 → 聊天内阅读 → 同一区域再次展开续读**，默认关闭。

- **关闭（默认）**：与 0.1.5–0.1.7 相同。重复展开同一区域只用该区域的缓存，不推进；首次主动展开另一处所选区域才读下一段。
- **开启**：收起后再次主动展开同一区域，从这本书保存的进度接着读下一段，仍要求可信用户事件、原生 `closed → open` 转换和 rAF 内复核；自动恢复展开、加载历史、流式更新、程序化展开不读。
- 进度、切书、停读和书末语义不变：开启后每次续读推进一次进度；书末返回结束状态，不循环；停读或移除类型后不再推进；切书清空临时缓存，从新书自己的进度继续。
- 缓存键不变：同一区域始终只有一个片段缓存键，续读是用新段落覆盖该区域最后一页，不按片段新建区域；关闭开关后重新展开显示该区域最后读到的段落。

## 刷新合并（内部）

`MutationObserver` 回调改为帧内合并：有 `requestAnimationFrame` 时合并到下一帧，没有时合并到微任务；同一帧里的流式文字、属性变更共享一次重扫。设置与片段订阅仍然立即刷新。长会话不再让每个流式 token 都触发一次全量 `querySelectorAll`。阅读语义、装饰结果和恢复原文的行为不变。

## 探针第 7 项

[宿主契约探针](../scripts/check-host-contracts.mjs) 新增 `adapter anchors for title layers and fold state`：检查宿主仍发货插件依赖的锚点——外壳里的 `data-shimmer-text`、`data-disclosure-row`，chat 里的 `data-shimmer-decoration`、`data-chat-flow-key`、`data-turn-process-member`、`data-turn-process-hidden`，以及 conversation 里的 `data-conversation-session`。

alpha.2 上按 7 项复跑通过；rc.2–rc.5 的历史矩阵仍是 0.1.7 时的六项结果，未重跑历史构件。

## 验证

- `pnpm verify`：**110 项，109 通过，0 失败，1 跳过**；跳过项是未设置 `HOST_ROOT` 时的真实宿主集成。
- `HOST_ROOT=<DSH 安装目录> node scripts/check-host-contracts.mjs`：`ok=true`，7 项检查，非可信展开后书籍进度仍为 0。
- 新增用例覆盖：设置默认关闭与布尔归一化、`continuePassage` 在同一区域推进而 `claimPassage` 保留缓存页、停读和切书后的续读、默认/开启两种展开路径的调用分支、帧内合并只重扫一次。
- 真实页面验收（2026-11-03，宿主 0.2.2-alpha.2，同一运行中的 `127.0.0.1:3080` 实例）：用独立临时浏览器 profile 打开已认证页面，先在 0.1.7 上展开一个区域得到第 1 段并确认重复展开保持第 1 段；再安装 0.2.0 的本地 tgz，页面未刷新即完成客户端热更新（`timeOrigin`、会话与已展开状态不变，`client.js` 从 rev `0ade15c36a55` 换到 `107c001d69b8`），插件详情页显示当前版本 0.2.0；新开关默认为关，开启后连续收起再展开同一区域依次得到第 2、3、4 段，关闭后重复展开保持第 4 段，另一区域展开读到第 5 段，已读进度在更新后保留。服务进程未重启（PID 97856）。
- 验收截图含个人数据（账户余额、头像、会话标题、个人路径），未写入仓库；本轮浏览器证据是 DOM 断言，不是截图。
- 仍未验证：键盘/悬停/触屏展开路径、展示模式切换与过程分组折叠/reset、虚拟化重挂载，以及用户自己已开标签页里的表现（本次验收只用独立临时 profile）。

## 本地安装（非公开发布入口）

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm verify
pnpm pack --pack-destination dist
dsh plugin --profile web add ./dist/gongfpp-dsh-novel-fish-0.2.0.tgz
```

替换已安装包后，客户端代码经 HMR 热替换，通常不需要刷新页面；若页面未更新，刷新原有 DSH 页面，仍不另开服务器。本地 tgz/Git/link 来源没有第三方 npm 自动更新通路。
