# 宿主接入依据

当前目标为 DSH Web `0.2.1-rc.2`，发布构建 `332895e`。插件不修改安装目录、不新增服务器。

## 正文接口不等于标题接口

安装包 `@deepseek-ai/dsh-client-ui-chat/lib/types/client/contract/slots.d.ts` 的 `ReasoningBodyOwnerProps` 仅提供 `text`、`running`；`conversation.chat.reasoning.body` 是展开后的正文插槽，不能更改标题和图标，也没有主动点击通知或稳定步骤身份。

同包 `lib/client.js` 的 `ReasoningRow`（当前安装构建行 6164–6215）直接将原生 Think 图标和 `t('message.think')` 传入 `DisclosureRow`，没有标题/图标扩展插槽。公开 `./client` 导出不包含 `ReasoningRow`。仅替换正文不能满足标题定制。

曾验证 `conversation.chat.node` 的 `assistant-step` 替换路径；重新声明原生两个子插槽会被实际宿主拒绝：`slot "conversation.chat.reasoning.body" is already declared`。重新实现整个 assistant 渲染器会扩大影响面，因此不采用。

## 最小本地适配（0.1.4）

唯一宿主适配文件是 [chat-adapter.js](../src/chat-adapter.js)。思考正文使用官方 body 插槽，原始 `text` 和 `running` 始终委托 `conversation.chat.reasoning.content` Factory。小说不再送入 Markdown Factory，而由 [novel-content.js](../src/novel-content.js) 提供统一纯文本模型、宿主字体/颜色 token 和分隔线样式。React 文本节点或 `textContent` 保证小说不会变成公式、HTML、链接或控件。

### 定位与缓存身份

设置只保存 `targetTypes` 类型数组，不保存具体会话／步骤位置：

- 思考：`[data-chat-flow-kind="assistant-step"] [data-variant="think"]`。
- 工具：`[data-chat-call-id] [data-tool]`；当前专用命令行另有 `[data-sample="bash"]`。
- `read` / `read_image` 分到打开文件，`grep` / `glob` 分到文件搜索，`data-variant="bash"` 分到运行命令，其余是工具调用，不重复分类。

工具依据来自当前 `@deepseek-ai/dsh-client-ui-tool/lib/client.js`：`ToolRow` 根节点带 `data-tool` / `data-variant`（安装构建行 1829–1851），`ToolNode` 提供 `data-chat-call-id`（行 1963），专用命令行带 `data-sample="bash"`（行 2522–2523）。这不是由显示标题猜测工具类型。

最近的 `[data-conversation-session]`、`[data-chat-node-key]`、类型和原生思考序号／工具 callId 组成页面内临时键，不持久化、不永久绑定小说。相同 callId 的原生节点重挂载不主动读书。没有身份或可展开控件时保留原文、不生成伪控件。

### 保留原生内容和交互

只改原生标题、已有补充文字及其 shimmer 层中的文字。图标、箭头、按钮、布局和事件处理不替换；没有原生补充位置时不另建一行。停用后恢复仍由插件持有的文字。

思考原文之后追加横线、章节和一段纯文本。工具没有公开的正文末尾 slot，因此只在已定位的原生工具卡片末尾添加自有节点，不替换工具 renderer，不修改原工具输入输出、文件链接、复制控件或内容节点。关闭、收起及卸载时移除自有工具节点。

只监听可信 `click` 或 Enter/空格意图，不拦截、不取消、不重新派发宿主事件。区分整行切换与仅左侧按钮切换，忽略嵌套控件、按键重复和已展开状态。捕获时必须为 `aria-expanded="false"`，下一帧还必须是同一控件实际变为 `true`；书籍、类型、启用状态、意图身份和代次都要有效，才调用 `claimPassage(key, actualType)`。

设置取消即撤销待执行帧／微任务；关闭后重开、取消类型后重选、切书后切回不能复活旧意图。DOM 观察、正文挂载和流式更新只同步显示，不读书。

## 限制与证据

这些 DOM 标记不是宿主承诺稳定的公开扩展协议，安装范围固定为当前 DSH 版本。原生过程分组、系统／上下文卡片不是本轮目标。隐藏在过程分组内的行需先展开分组；没有原生内容或折叠控件的卡片不提供阅读区。

本轮自动化与真实 GUI 限制见 [0.1.4 验证记录](multi-region-update.md)。未完成的可信点击、键盘、悬停和新版真实 A/B/C 需要补验；历史截图不作为新候选版的运行证明。
