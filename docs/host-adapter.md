# 宿主接入依据

当前安装 DSH `0.2.1-rc.2`，Web 发布构建 `332895e`，验收地址 `http://127.0.0.1:3080`。插件不修改安装目录、不新增服务器。

## 正文接口不等于标题接口

安装包 `@deepseek-ai/dsh-client-ui-chat/lib/types/client/contract/slots.d.ts` 的 `ReasoningBodyOwnerProps` 仅提供 `text`、`running`；`conversation.chat.reasoning.body` 是展开后的正文插槽，不能更改标题和图标，也没有主动点击通知或稳定步骤身份。

同包 `lib/client.js` 的 `ReasoningRow`（安装构建行 6164–6215）直接将原生 Think 图标和 `t('message.think')` 传入 `DisclosureRow`，没有标题/图标扩展插槽。公开 `./client` 导出不包含 `ReasoningRow`。仅替换正文绝不能满足本项目要求。

曾验证 `conversation.chat.node` 的 `assistant-step` 替换路径；重新声明原生两个子插槽会被实际宿主拒绝：`slot "conversation.chat.reasoning.body" is already declared`。重新实现整个 assistant 渲染器也会扩大影响面，因此最终不采用该路径。

## 最小本地适配

唯一宿主适配文件是 [chat-adapter.js](../src/chat-adapter.js)。正文仍通过官方 `conversation.chat.reasoning.body` 和 `conversation.chat.reasoning.content` Factory 渲染；非目标步骤直接委托原生 Factory，不重绘聊天正文、图片或工具日志。

标题适配仅匹配真实聊天的 `[data-chat-flow-kind="assistant-step"] [data-variant="think"]`，身份取自其 `[data-chat-node-key]` 和最近的 `[data-conversation-session]`。目标设置保存这些精确定位值，不保存任何片段索引或小说绑定。标题和图标以本地 DOM 覆盖层展示，保留原生节点、折叠组件、字体主题和事件处理；停用后移除覆盖层和样式。

只有可信的用户 `click` 或 Enter/空格事件、且原生头部 `aria-expanded="false"` 时，才调用阅读服务。DOM 观察只恢复目标标题显示，不加载小说；正文挂载/更新的 effect 只识别节点身份，不推进阅读。无任意文本匹配、React 私有属性、全局思考替换或复杂规则引擎。

## 限制

这不是宿主承诺稳定的标题 API，而是对上述具体 DOM 标记的窄适配，因此安装范围固定为当前版本。未来 DSH 若改变标记，必须重新验收；不悄悄切换到独立页。没有可见思考正文的模型步骤不能被选择，用户需在真实聊天已有的原生“已完成／工作过程”分组内展开步骤。插件不会替模型生成思考。
