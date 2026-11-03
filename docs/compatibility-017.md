# 0.1.7 宿主兼容验证

## 范围与状态

本地候选版：`@gongfpp/dsh-novel-fish@0.1.7`。公开 npm、GitHub Release 和市场索引尚未发布本版。

宿主声明为 `>=0.2.1-rc.2 <=0.2.2-alpha.2`。DSH 安装预检使用 `includePrerelease: true`；范围覆盖目前发布的 rc.2、rc.3、rc.4、rc.5、0.2.2-alpha.2。早于 rc.2 的版本缺少本项目最初验证的接口基础；晚于 alpha.2 的版本未验证。不移除版本检查，不授予版本豁免，不承诺任意未来版本。

原先主分支 0.1.5 精确要求 `0.2.1-rc.2`，本地 0.1.6 的 `<0.2.2-0` 又明确排除了 alpha.2；即使源码能运行，宿主也会先拒绝加载。0.1.7 修正声明，同时核验实际宿主构建，而不把“能装”当成完整交互验证。

## 本地安装（非公开发布入口）

在本仓库运行：

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm verify
pnpm pack --pack-destination dist
dsh plugin --profile web add ./dist/gongfpp-dsh-novel-fish-0.1.7.tgz
```

书库及进度仍使用同一站点的 IndexedDB，不迁移或清空。刷新原有 DSH 页面以加载客户端代码；若宿主提示需要重启，重启原有服务，不另开服务器。

本地 tgz/Git/link 来源没有第三方 npm 自动更新通路。若要使用宿主的“更新”按钮，需另行发布新版到 npm，并以完整包名 `@gongfpp/dsh-novel-fish` 从 npm 安装。不能用本地修改冒充已完成公开发布。

## 自动检查

- 普通回归：`pnpm verify`，涵盖书库、进度、导入、类型选择、可信展开意图契约、原文保留和卸载恢复。
- 版本预检：使用与 DSH 相同的 prerelease semver 选项，确认上述已发布版本放行，rc.1、alpha.3、0.2.2 正式版和未来大版本不误放行。
- 历史市场条目的兼容声明保持原值，不把新版范围写回旧发布记录，也不添加未发布版本的伪标签或提交。

### 实际宿主构建矩阵

2026-11-02 执行 [宿主契约探针](../scripts/check-host-contracts.mjs)：

| 宿主 | 结果 | 非可信展开后书籍进度 |
| --- | --- | --- |
| 0.2.1-rc.2 | 6 项通过 | 0 |
| 0.2.1-rc.3 | 6 项通过 | 0 |
| 0.2.1-rc.4 | 6 项通过 | 0 |
| 0.2.1-rc.5 | 6 项通过 | 0 |
| 0.2.2-alpha.2 | 6 项通过 | 0 |

历史版本取自 npm 对应正式构建，28 个构件下载均校验 registry 的 SHA-512 integrity；alpha.2 使用本机现有安装。各版本在 JSDOM 内加载其自身前端静态模块表里的 React、SlotCore 和原生控件，并调用真实 `registerChatNodeRenderers` 及当前插件源码的 `apply`。验证正文插槽优先级接管且默认实现仍保留、真实 ReasoningRow / DisclosureRow / TextShimmer 双层标题及图标保留、`text/running` 原样交给官方正文 Factory、真实设置控件挂载、非可信展开不消耗书籍以及关闭恢复。

复现单个已安装宿主（参数为宿主包根目录，不是用户 profile）：

```sh
node scripts/check-host-contracts.mjs /absolute/path/to/@deepseek-ai/dsh
HOST_ROOT=/absolute/path/to/@deepseek-ai/dsh node --test test/host-contracts.test.js
```

普通 `pnpm verify` 会跳过需要 `HOST_ROOT` 的可选真实构建集成，不把跳过当作矩阵通过。探针只在内存暴露宿主私有导出，不改安装文件，不启动服务器，不访问用户书库；测试使用全新内存 IndexedDB。

这些结果不是完整宿主启动证明：最外层 chat.node / config seat 在静态核验后由小型上下文桥接；未启动完整 UI renderer。工具/Bash 仅核验宿主 DOM 标记；设置菜单和弹窗仅闭态挂载；未验证布局、动画、焦点、真实点击、键盘或悬停。探针内存构建当前源码，产物另由 `pnpm verify` 重建。

### 已连接页面的实时插槽核验

在已运行 `0.2.2-alpha.2` 的真实 DSH Web 页面上，通过 Client Inspect 的 `Slots.listSubTree` 读取活插槽状态。此操作不另起浏览器、不重启服务、不读用户 profile，也不修改页面：

- `conversation.chat.reasoning.body` 是 `single`、`session` 作用域的插槽，实占两个注册者：本插件 `priority -10`（`active: true`）与官方 `priority 100`（`active: false`，被替换）。这说明 0.1.7 客户端代码在该页面已加载并接管正文插槽；官方正文 Factory 仍由插件调用，停用后可回退。
- 该插槽 `ownerProps` 只有 `text`、`running`，仍无标题或图标接口；`plugins.bundle.config` 的 keyed 座位存在 `@gongfpp/dsh-novel-fish` 且 `active: true`，说明详情页设置行已注册。

若页面未加载本插件，同一插槽只会出现 `priority 100` 一项，可据此区分「代码未加载」与「交互失效」。这类证据只证明模块加载、槽位注册与替换关系，不证明视觉布局、真实点击或读段结果，因此不替代下列验收。

## 验证边界

自动化处理器契约探针不等于真实浏览器的 `isTrusted` 点击。原生键盘、悬停、真实聊天 A/B/C 全流程、多浏览器行为，以及展示模式切换、过程分组收起/reset、虚拟化重挂载时不跳段仍需单独验收；历史截图不作 alpha.2 交互证据。本轮不启动替代 Web 服务，不改宿主安装文件或其他不兼容插件。
