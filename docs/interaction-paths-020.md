# 0.2.x 交互路径补验：悬停与键盘

日期：2026-11-04。宿主 0.2.2-alpha.2（全局安装，PID 未重启），插件 0.2.1（当前 profile 已装）。

## 方法

用 headless Chrome 通过 CDP 驱动独立临时 profile（`/tmp/dsh-interact/profile`），打开同一个运行中的 `127.0.0.1:3080` 实例。点击用 `Input.dispatchMouseEvent`、按键用 `Input.dispatchKeyEvent`，都是浏览器可信事件，能穿过适配器的 `isTrusted` 门控；没有改写门控、没有重写宿主事件。

为不接触用户书库，先在该临时 profile 的 IndexedDB 里写入一本三段的验证用书和设置（主标题「思考」、补充文字「验证中」），再刷新页面让 store 从持久化层水合；随后只读打开账号里的真实会话，观察「思考」行。会话 DOM 的展开/折叠由宿主负责，插件只负责在可信点击/按键通过门控后追加书页。

## 结果

| 路径 | 观察 |
| --- | --- |
| 可信鼠标点击折叠的思考行 | 行展开；行内出现 `data-novel-append`，带标签「小说 · 第二章」和对应段落；进度跨页面刷新保留（首次运领取第一章，再次运领取第二章）。 |
| 悬停（`mouseMoved` 移到行上再移开） | 没有新增领取，已渲染的书页不变，无告警。 |
| 键盘 Enter（先 `focus()` 到 `DIV role=button tabindex=0` 的宿主披露行，再发可信 keyDown/keyUp） | 第一次回车折叠、第二次回车重新展开；同一个步骤重新展开后显示的段落与第一次一致（该书已读完时显示「本书已读完」），没有重复领取或报错。 |
| 页面告警 | 全程 `[role=alert]` 为空。 |

补充说明：在仍有智能体流式输出的会话里，行会随流式刷新重建，行索引不稳定，键盘与行的一一对应会变模糊；补验时应选已结束的会话。触摸、展示模式切换、过程分组折叠 reset、虚拟化重挂载仍未验证。

## 探针进 CI

`.github/workflows/verify.yml` 新增 `host-contracts` 任务：安装固定版本 `@deepseek-ai/dsh@0.2.2-alpha.2`（`--ignore-scripts`），用 `HOST_ROOT` 跑 `scripts/check-host-contracts.mjs` 与 `test/host-contracts.test.js`。探针原本只认全局安装的嵌套布局，现在同时兼容 `npm install` 的提升布局（`existsSync` 判断，同级 `@deepseek-ai` 目录兜底）。首次运行 `host-contracts` 1m10s 通过，`verify` 15s 通过。
