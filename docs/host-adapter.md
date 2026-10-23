# 宿主接入依据

当前安装 DSH `0.2.1-rc.2`，Web 发布构建 `332895e`，验收地址 `http://127.0.0.1:3080`。插件不修改安装目录、不新增服务器。

## 正文接口不等于标题接口

安装包 `@deepseek-ai/dsh-client-ui-chat/lib/types/client/contract/slots.d.ts` 的 `ReasoningBodyOwnerProps` 仅提供 `text`、`running`；`conversation.chat.reasoning.body` 是展开后的正文插槽，不能更改标题和图标，也没有主动点击通知或稳定步骤身份。

同包 `lib/client.js` 的 `ReasoningRow`（安装构建行 6164–6215）直接将原生 Think 图标和 `t('message.think')` 传入 `DisclosureRow`，没有标题/图标扩展插槽。公开 `./client` 导出不包含 `ReasoningRow`。仅替换正文绝不能满足本项目要求。

曾验证 `conversation.chat.node` 的 `assistant-step` 替换路径；重新声明原生两个子插槽会被实际宿主拒绝：`slot "conversation.chat.reasoning.body" is already declared`。重新实现整个 assistant 渲染器也会扩大影响面，因此最终不采用该路径。

## 最小本地适配

唯一宿主适配文件是 [chat-adapter.js](../src/chat-adapter.js)。0.1.3 的正文使用官方 `conversation.chat.reasoning.body` 插槽，并始终将原始 `text` 和 `running` 委托给 `conversation.chat.reasoning.content` Factory；原文渲染在上，小说单独追加在其后，同样使用原生正文 Factory，不另加分隔线、边框、颜色、字号或间距。小说中的 Markdown 语法被转义，避免生成额外图片、链接或交互控件。身份尚不可用、加载失败、自动展开和书末也不隐藏真实思考。不重绘聊天正文、图片或工具日志。

设置只保存 `targetType: 'reasoning'`，表示原生“思考”类型，适用于任意会话中的该类型，不列举或保存具体轮次／步骤位置。类型定位依据是实际宿主标记 `[data-chat-flow-kind="assistant-step"] [data-variant="think"]`，不是标题文字匹配。`[data-chat-node-key]`、最近的 `[data-conversation-session]` 和同一节点内思考区域序号只组成页面内临时缓存键，不写入设置、不永久绑定小说。同一个 assistant-step 的两个思考区域各自首次展开可读取一段。只修改原生标题、已有补充文字节点及其 shimmer 高亮层的文本，不插入或移除任何原生图标、箭头、按钮、分隔符和排版节点，不注入样式或伪造图标。空标题跟随宿主；没有原生补充文字位置时，不为展示自定义文字新建一行。停用后恢复仍由插件持有的文字。

只监听可信的用户 `click` 或 Enter/空格意图，不拦截、不取消和不重新派发宿主事件。依据原生 DOM 区分“整行可点击”和“仅左侧按钮可点击”：后者点击文字不续读；忽略链接等嵌套控件、键盘重复、已展开状态。意图发生时要求 `aria-expanded="false"`，下一帧确认同一原生控件实际变为 `true`，且书籍、类型和启用状态未变化，才调用阅读服务；取消、无效点击、连续开关、离开页面或切书都不提前消耗内容。DOM 观察只恢复目标文字显示，不加载小说；正文挂载/更新的 effect 只识别节点身份，不推进阅读。无任意文本匹配、React 私有属性、全局思考替换或复杂规则引擎。

## 限制

这不是宿主承诺稳定的标题 API，而是对上述具体 DOM 标记的窄适配，因此安装范围固定为当前版本。未来 DSH 若改变标记，必须重新验收；不悄悄切换到独立页。没有可见思考正文的模型步骤不提供阅读区；隐藏在原生“已完成／工作过程”分组内的思考，需先展开该分组。插件不会替模型生成思考。
