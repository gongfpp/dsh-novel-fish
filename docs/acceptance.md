# 验收记录

日期：2026-10-22。宿主：实际运行的 DSH Web `0.2.1-rc.2`，发布 commit `332895e`；浏览器：本机 Google Chrome，真实地址 `http://127.0.0.1:3080`。源码不是旧仓库的删减版，未改宿主安装文件。

## 真实聊天验证

通过正常聊天输入发送两道心算问题，真实模型产生两条思考及回答；没有伪造会话事件、插入假步骤或给模型发送小说。生成验收对话有两次正常模型请求；后续阅读动作不请求模型。截图中的 `1591` / `2491` 是原回答，正文和用量仍由 DSH 原生显示。截图时底部模型选择器可能已切换到新的待发送模型，不代表历史回答提供方。

| 行为 | 实测结果与依据 |
| --- | --- |
| 选择历史目标步骤、标题/图标生效 | 精确选中两个已完成思考步骤；显示 `◎ 思考 · Checking project structure`，[折叠截图](evidence/live-collapsed.png)。选择不推进，进度 0。 |
| A 重复展开、B 首次展开 | A 首次读到 A，进度 1；收起再展开仍 A、进度 1；B 首次读到 B、进度 2。[实际 A/B 阅读截图](evidence/live-ab.png)。 |
| 刷新续读 | 刷新不推进，仍为 2；再主动展开旧 A 读到 C、进度 3，不恢复旧 A 段。[刷新续读截图](evidence/live-resume.png)。 |
| EPUB / TXT / MD / 粘贴 | 均通过设置中的真实输入导入，并在同一个真实思考步骤中读出。EPUB 按 spine 第一章开始，而非 manifest 文件排列；[EPUB 实拍](evidence/live-epub.png)。损坏 EPUB 明确报错。 |
| 切换书籍 | 每次切书后目标步骤读取新书；已展开的旧缓存清空，不串入新书。 |
| 长篇和连点 | 实际导入 1,007,000 字符、分成 1900 段；聊天仅渲染 528 字符。反复点击 12 次，进度仍为 1。 |
| 不触发模型 | 阅读阶段额外监听页面网络：8 次反复展开产生 0 个非 GET 请求。插件代码没有远程 Session/模型服务调用。 |
| 关闭聊天内阅读 | 小说和标题覆盖消失，原生思考正文正常展开，[开关关闭截图](evidence/live-disabled.png)。 |
| 整包停用 | 实际关闭插件组合包；客户端从 boot entries 移除，装饰清理，原始思考仍可正常展开，[整包停用截图](evidence/live-unloaded.png)。 |

机器可读的运行摘要：[A/B/C](evidence/abc-result.json)、[格式/开关/网络](evidence/formats-result.json)、[长篇](evidence/long-result.json)、[整包停用](evidence/unload-result.json)。图中小说全部为原创短验收文本。

## 自动测试

实际执行 `pnpm verify`：**34 通过、0 失败、0 跳过**。构建产物约 639 KiB（未压缩）。

测试覆盖：可信用户展开门控与非目标步骤不改动；DOM 更新/合成点击不续读；正文挂载、重挂载、流式更新与完成仅查缓存；重复与并发点击；读失败重试；书末停止；刷新新实例；切书读写竞争及回滚；快速选书和目标增删；删除竞争不复活；加载失败禁止覆盖原设置；IDB 分离存储；TXT/MD 章节与 Unicode 分段；EPUB spine 顺序、坏导航/缺章节拒绝、脚本与隐藏文本排除。

## 安装及环境处理

本地路径安装已用 `dsh plugin --profile web add /Users/mass/Developer/Playground/dsh-touch-fish-novel` 成功执行。随后实际执行 `dsh plugin --profile web add /Users/mass/Developer/Playground/dsh-touch-fish-novel/dist/local-dsh-touch-fish-novel-0.1.0.tgz`，以复制安装的 tarball 版本重新跑通 A/B/C、刷新续读及整包停用，均无浏览器错误。普通用户使用随附 tarball，不需安装解析器或转换 EPUB。

此环境原有旧阅读插件同时接管思考渲染，触发展开时报 `renderSlot is not a function`。为隔离验收，只临时关闭其启用开关；旧项目源码、依赖安装与旧书库不动。验收后已恢复旧插件原启用状态，新插件保留安装但停用。使用新插件前，请先在插件页关闭旧阅读插件，再开启“小说摸鱼”。

## 明确未覆盖

- 只在上述 DSH 版本的 Web/Chrome 验收；未验证其他 DSH 版本、Desktop、Firefox、Safari。标题是窄 DOM 适配，不宣称稳定公共 API。
- 流式正文、自动展开和故障竞争主要由确定性自动测试覆盖；真实浏览器核心证据使用已完成的历史步骤，未进行第二次付费长时间流式模型实验。
- 未模拟浏览器配额耗尽、断电、多个浏览器标签同时读同一本书；不提供跨标签协调或同步。
- EPUB 验收使用实际 ZIP/OPF/XHTML 结构的原创测试书与坏文件，不宣称支持所有商业 DRM、图像型书籍和原书排版。
