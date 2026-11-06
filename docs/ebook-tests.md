# 离线电子书与浏览器测试（2026-11-07）

当前只内置英文 TXT《百万英镑及其他新故事》和中文 MD《阿Q正传》，共 **462708 字节（451.9 KiB）**。《山海经》及其制作材料已移出当前样书；EPUB 导入功能保留，但不再附带 EPUB 样书。图书许可独立于插件 MIT，见[来源清单](<../samples/ebooks/sources.json>)与[完整离线声明](<../samples/ebooks/LICENSE.md>)。

## 当前样书与版本范围

| 样书 | 格式 | 字节 | 新导入段数 | 范围 |
| --- | --- | ---: | ---: | --- |
| [百万英镑及其他新故事（英文）](<../samples/ebooks/million-pound-bank-note-pg61522.txt>) | TXT | 394538 | 820 | [PG #61522](https://www.gutenberg.org/ebooks/61522) 的 1893 年合集，完整题篇与另外八篇，不是独立单篇；下载字节未改 |
| [阿Q正传](<../samples/ebooks/aq-zheng-zhuan-wikisource.md>) | MD | 68170 | 100 | [维基文库](https://zh.wikisource.org/wiki/阿Q正傳) 完整九章繁体原文导出的本地 Markdown 衍生版；只加 `# 阿Q正傳` 标题与空行 |

AQ 标题前缀为 14 个 UTF-8 字节，去掉后可逐字节恢复 **68156 字节**的原始官方 TXT，包含数字版声明、CC BY-SA 3.0 / GFDL 链接和全部贡献者；不冒称原站下载的原生 MD。段数包括来源和许可，不等于纯故事长度。

**旧库迁移与新导入不同：**只对带明确 `bundledId` 的旧默认书执行目录升级，移除旧山海经默认书及其分段；匹配旧内容的 AQ 默认书从 TXT 标为 MD，但保留 ID、标题、分段、98 段总数和阅读位置，不重分段。未标记的用户导入书不归插件接管，已删默认书不会恢复。实现与边界回归见[书库测试](<../test/bundled-library.test.js>)。

## 普通离线回归

[真实样书测试](<../test/ebooks.test.js>)只读仓库样书，不依赖下载、个人路径或网络：固定两书 ID、格式、字节与哈希；检验英文叙事与结尾、八篇其他标题，AQ 顺序九章、结尾、声明与贡献者；验证原选书/设置/正文/进度不变、同一步骤领取去重及重建 Store 后续读。AQ MD 后缀还与原 TXT 固定哈希比对。EPUB 的线性 spine、缺失/损坏文件、编码、实体、CRC 和解压预算由[独立 EPUB 测试](<../test/epub.test.js>)的合成 ZIP 夹具覆盖，不依赖已移除样书。

```sh
node --test test/ebooks.test.js test/epub.test.js
# 全量验证会重新构建；只在允许更新编译产物时运行
HOST_ROOT=/absolute/path/to/installed/dsh pnpm verify
# 已有最终编译产物时可只执行测试，不重建
HOST_ROOT=/absolute/path/to/installed/dsh pnpm test
```

原样书与 EPUB 定向测试 **16/16 通过**；正式发布前补齐 PG 片段声明后，带真实 `HOST_ROOT` 重建并运行 `pnpm verify`，**165/165 通过、0 跳过**，包含 PG 标记识别、旧书续读、取消时不推进和两种正文渲染路径的许可回归。缺少 `HOST_ROOT` 时真实宿主集成一项会跳过；本机宿主版本为 DSH `0.2.2-alpha.2`。

## 编译产物的离线浏览器组件验收

[浏览器探针](<../scripts/test-browser-samples.mjs>)直接加载[编译产物](<../lib/client.js>)，不是改测源码入口。使用隔离 headless Chrome、原生 IndexedDB、真实文件输入和可信鼠标/键盘事件；Host 控件与思考行是模拟夹具，**不是官方 DSH GUI E2E**。不连接用户浏览器/profile、不安装依赖或插件、不启动 HTTP 服务。

```sh
PLAYWRIGHT_MODULE=/path/to/playwright-core/index.js \
REACT_DOM_MODULE=/path/to/react-dom/client.js \
node scripts/test-browser-samples.mjs
```

2026-11-07 实测通过：Chrome **157.0.8103.39**、React/ReactDOM **19.3.0**；正式发布 bundle **1382671 字节**，SHA-256 `6ffb7a11400540faccee721e1faa6e447d98f67ffecb02bd8a2a999aef7a952e`。脚本结束再次核对哈希，确认本轮没有混入并发重建结果。

- 四个独立离线上下文：空库、已有书库、初始化标记写入前的已导入样书、带旧目录标记的三本默认书升级。当前两书直接进入同一个选书菜单，没有单独的内置书导入入口。
- 当前 TXT/MD 经真正 file input 导入为 **820/100 段**，使用真实解析结果构造旧导入去重夹具；不伪造新旧标题相同。另从 MD 回收原始 AQ TXT，核验原字节数/哈希后经 file input 导入为 **98 段**，用于 tagged v1 升级夹具。
- v1 升级只移除旧山海经默认记录/分段；AQ 格式升级为 MD，原分段、标题、进度仍在；原选中山海经时回退到 AQ。已有个人书、保存标题和进度保留。
- 实际点击选书、展开模拟思考行、删除取消/确认、菜单「书籍信息」和弹窗关闭；原思考保留，分隔线后追加小说；刷新后选择/进度不变。删除一本后不恢复，逐本删空后连续刷新两次仍为空；空库仍可打开书籍信息。
- 默认设置页没有单独的许可/说明块。实际下载离线声明 **20903 UTF-8 字节**，与随包声明逐字节相同，含两书署名和 PG 完整 Section 1–5；不再含山海经声明。
- PG 英文默认书、旧 ID 复用书及真实 file input 导入书，每个片段旁均显示 §1.E.1 完整声明（含 ™），不在正文滚动区域或折叠层中；实际点击片段旁链接并下载完整离线许可，字节与随包声明一致。AQ 和普通用户书不出现 PG 提示。
- **87 个虚拟请求，0 额外请求，0 外部请求**；只有路由返回的 HTML、夹具与既有 bundle，不请求样书或网络。

### 旧长段与窄屏

[分段实现](<../src/segments.js>)默认 800 半角显示单位（汉字/宽字符约 2，英文约 1，换行 40），硬上限 1000；优先句段边界、平衡章尾，不拆可容纳的单词/字素。已有书不重分段或重置进度。

小说正文有 `max-height: min(40vh, 20.8em)` 与键盘可达的内部滚动，不删文本、不限制宿主原思考。浏览器用原有 81 行长段，在正文宽 **320/600 px**、视口高 640 px 时均测得显示高 **256 px**、完整滚动高 **1685 px**，原思考高 22 px，距离折叠按钮约 60.8 px；End 键可滚到末尾，收起重开不重复领取。这仅是模拟行布局证据，不能推断任意长的宿主原思考都不会把按钮推远。

## 本地扩展格式语料

[扩展探针](<../scripts/test-ebook-corpus.mjs>)复制当前两书到忽略输出目录，从完整 AQ 导出生成**明确标注的测试专用 EPUB**，再读取本机已有四个真实 Alice 负例；不下载文件、不读旧山海经，也不把测试 EPUB 放入发布包。

```sh
node scripts/test-ebook-corpus.mjs
# 换机器后，需提供已下载的四个 Alice 负例
node scripts/test-ebook-corpus.mjs --copy-from /path/to/download-directory
```

2026-11-06T19:22:51Z（本地 2026-11-07）实测 **7/7 符合支持范围**：TXT、MD 和测试衍生 EPUB 均可读，正文/声明完整；HTML、AZW3、MOBI、PDF 全部明确返回 `只支持 EPUB、TXT、MD 文件`，书籍、设置、选书、进度、正文和已领取段均不变。**当前没有随包的原生下载 EPUB 样书**；衍生 EPUB 是容器/提取回归，不作为原站 EPUB 版本真实性证据，也不宣称新增图像阅读功能。

| 本地额外文件 | 字节 | 作用 / 来源 |
| --- | ---: | --- |
| AQ 衍生测试 EPUB | 69923 | 脚本生成，100 段；完整原 TXT 经 XML 转义放入 XHTML，含声明与贡献者；仅测试 |
| Alice HTML | 192539 | [PG HTML](https://www.gutenberg.org/ebooks/11.html.images)，拒绝负例 |
| Alice AZW3 | 255506 | [PG KF8](https://www.gutenberg.org/ebooks/11.kf8.images)，拒绝负例 |
| Alice MOBI | 190274 | [PG MOBI](https://www.gutenberg.org/ebooks/11.kindle.noimages)，拒绝负例 |
| Alice PDF | 3083601 | [Adobe PDF](https://www.adobe.com/be_en/active-use/pdf/Alice_in_Wonderland.pdf)，拒绝负例，未确认再分发权 |

ZIP CRC、EPUB mimetype、PDF `%PDF-`、MOBI/AZW3 `BOOKMOBI` 和 HTML 文档头均实际检查，不是改扩展名的 TXT。输出与负例留在忽略目录，普通测试不依赖它们。

```text
4f36f8ce3837afd6c28a23684153a946e39c8970a27486d36f6f4c64b92bb0d2  million-pound-bank-note-pg61522.txt
228f5e9504caecc97460e815461df7ac60de80ea311f289f7de23760c69c9643  aq-zheng-zhuan-wikisource.md
15a60f2d6e105c0869c4a11516eaba0d6726e6df68a91c40836dad51c1016b51  recovered original AQ TXT (not a bundled file)
c44cafffb439290516d1edf2bcd74bfdd1203997360ef3923ac5832f8b4d63c1  aq-derived-test-fixture.epub (test only)
7df9c19e9fccac5b3ae9b1f837b247db1c1da93845dfb9e1903dce85013c43d3  alice.html
d8211269aed55ded8302f289950936db8368b4d4d384c463b722034152f8f1d2  alice.azw3
c6de8f83459904177eac2623aa653ef57483ed6968078c8fc3d3171f20e06408  alice.mobi
1c0c562156d0cc0d61f42e5c3c05585399b1507c5a65fcec7949b298385f8715  alice.pdf
```

## 实机图片与 GIF 的证据边界

[历史设置实拍](<evidence/settings-110.png>)、[历史阅读实拍](<evidence/reading-demo-110.png>)及[裁剪/哈希记录](<evidence/samples-110-capture.json>)来自 2026-11-06 运行中的 DSH Web `0.2.2-alpha.2`，记录的是**旧三书、单独导入入口和 AQ TXT**候选，不代表当前两书统一菜单。真实页面当时只验证 AQ 导入/阅读，不能代替其他书、迁移或离线持久化验收。

### 当前两次展开实拍（2026-11-07）

[原尺寸 GIF](<evidence/reading-two-expansions-110.gif>)与[画面/哈希记录](<evidence/reading-two-expansions-110.json>)来自当前正在运行的 DSH Web `0.2.2-alpha.2`，不是模拟 Host。经用户同意，用 native Cua 在已有公开项目会话中展开第一条思考、滚动、收起，再展开另一条思考、滚动、收起；实际看到两段不同的 AQ 正文。没有发送模型消息、改写思考文字或制造页面状态。

为避免录入另一应用的私密屏幕，采用目标窗口的真实操作前后帧，顺序合成为约 20 秒、**1567 × 856** 的 GIF，压缩等待时间；不是连续桌面视频。保留 DeepSeek 标识、导航、当前项目/会话和对话框架；仅裁去浏览器外框/底部统计，并对侧栏无关会话、额度和账户施加不透明遮挡。未经遮挡的原图与 Cua 轨迹只留在忽略输出目录，不进入发布包。

实拍沿用用户原有 **AQ TXT（98 段）**，证明新版阅读行为能保留旧库、接续正文，不宣称它是新内置 MD 的导入演示。新 MD 文件、统一菜单、新空库和 v1 目录迁移由上文四个隔离浏览器场景及 165 项测试分别验证。完整截图哈希、裁剪/遮挡坐标、帧顺序与**拍摄时** bundle 哈希（`48678d32…`）记在证据 JSON；拍摄后为英文 PG 书补齐片段声明，未重拍或伪改旧证据哈希。最终发布 bundle 为上文 `6ffb7a11…`，PG 改动不影响实拍中的中文 AQ。可用[转换脚本](<../scripts/make-readme-gif.mjs>)和拍摄时编译产物从原始窗口捕获重建。
