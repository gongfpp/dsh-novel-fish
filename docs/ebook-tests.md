# 离线电子书与浏览器测试（2026-11-22）

内置两本纯正文样书：中文 MD《阿Q正傳》与英文 TXT《百万英镑及其他新故事》。打开第一页就是正文。EPUB 导入能力保留，但不再附带 EPUB 样书。

## 当前样书

| 样书 | 格式 | 字节 | 新导入段数 | 章节 |
| --- | --- | ---: | ---: | ---: |
| [阿Q正傳](<../samples/ebooks/aq-zheng-zhuan.md>) | MD | 64260 | 72 | 9（第一章　序 … 第九章　大團圓） |
| [百万英镑及其他新故事（英文）](<../samples/ebooks/million-pound-bank-note.txt>) | TXT | 366099 | 约 500 | 12 篇名 |
| 合计 | — | 430359 | — | — |

两本都由 `scripts/build-samples.mjs` 从 `dev/sample-sources/` 的原始导出生成（`dev/` 不入库不打包）：英文从第一篇故事标题起、到最后一篇正文止；中文从「第一章　序」到故事结束，章节行转为 `## 第X章　标题`。生成脚本可重跑，产物只含正文与篇名/章名。

样书元数据 `samples/ebooks/sources.json` 只有 `id / title / author / format / file / bytes / sha256` 七个字段；中文书排在第一位，空库默认选中它。

**旧库迁移与新导入不同：**只对带明确 `bundledId` 的旧默认书执行目录升级（`bundledCatalog.version = 3` 的 `refreshes`）：删掉旧分段、按新文件重分段，进度按比例换算、`revision` 加一；标题、导入时间、自定义元数据和阅读设置保持不变。已删除的默认书不复活，用户自己导入的同名副本不被接管。回归见[书库测试](<../test/bundled-library.test.js>)。

## 普通离线回归

[真实样书测试](<../test/ebooks.test.js>)只读仓库样书，不依赖下载、个人路径或网络：固定两书的 ID、格式、字节与 SHA-256；断言 `sources.json` 只有上述七个字段；断言首行分别是 `# 阿Q正傳` 与 `THE £1,000,000 BANK-NOTE`，并断言正文不含前置页、导出模板或署名段落的标记（具体字符串见测试）；断言中文章名严格等于九个章节标题、英文章名覆盖十二个篇名，段数落在预期区间；再验证导入、领取去重、重建 Store 后续读。EPUB 的线性 spine、缺失/损坏文件、编码、实体、CRC 和解压预算由[独立 EPUB 测试](<../test/epub.test.js>)的合成 ZIP 夹具覆盖。

```sh
node --test test/ebooks.test.js test/epub.test.js
# 全量验证会重新构建；只在允许更新编译产物时运行
HOST_ROOT=/absolute/path/to/installed/dsh pnpm verify
# 已有最终编译产物时可只执行测试，不重建
HOST_ROOT=/absolute/path/to/installed/dsh pnpm test
```

缺少 `HOST_ROOT` 时真实宿主集成一项会跳过，其余测试照常运行。

## 编译产物的离线浏览器组件验收

[浏览器探针](<../scripts/test-browser-samples.mjs>)直接加载[编译产物](<../lib/client.js>)，不是改测源码入口。使用隔离 headless Chrome、原生 IndexedDB、真实文件输入和可信鼠标/键盘事件；Host 控件与思考行是模拟夹具，**不是官方 DSH GUI E2E**。不连接用户浏览器/profile、不安装依赖或插件、不启动 HTTP 服务。

```sh
PLAYWRIGHT_MODULE=/path/to/playwright-core/index.js \
REACT_DOM_MODULE=/path/to/react-dom/client.js \
node scripts/test-browser-samples.mjs
```

覆盖四个独立离线上下文：空库、已有书库、初始化标记写入前的已导入样书、带旧目录标记的默认书升级。实际点击选书、展开模拟思考行、删除取消/确认、菜单「书籍信息」和弹窗关闭；原思考保留，方框追加在下方；刷新后选择/进度不变；删除后不恢复，逐本删空后连续刷新两次仍为空。

## 阅读方框

[分段实现](<../src/segments.js>)默认 800 半角显示单位（汉字/宽字符约 2，英文约 1，段落空行 28），硬上限 1000；优先句段边界、平衡章尾，不拆可容纳的单词/字素。英文硬换行先做软换行归一化再计宽，所以一段大致就是一段话，不会退化成三四行。

[方框样式](<../src/novel-content.js>)：外框 1px 边框、10px 圆角，框内依次是书名、章节、进度和「下一段」按钮，正文 14px/1.8、`max-height: min(60vh, 32em)`、内部滚动。方框内的文字全部是纯文本，不渲染任何链接、图片或 HTML。

## 本地扩展格式语料

[扩展探针](<../scripts/test-ebook-corpus.mjs>)复制当前两书到忽略输出目录，从完整 AQ 导出生成**明确标注的测试专用 EPUB**，再读取本机已有的真实 Alice 负例；不下载文件，也不把测试 EPUB 放入发布包。

```sh
node scripts/test-ebook-corpus.mjs
# 换机器后，需提供已下载的四个 Alice 负例
node scripts/test-ebook-corpus.mjs --copy-from /path/to/download-directory
```

TXT、MD 和测试衍生 EPUB 均可读；HTML、AZW3、MOBI、PDF 全部明确返回 `只支持 EPUB、TXT、MD 文件`，书籍、设置、选书、进度、正文和已领取段均不变。ZIP CRC、EPUB mimetype、PDF `%PDF-`、MOBI/AZW3 `BOOKMOBI` 和 HTML 文档头均实际检查，不是改扩展名的 TXT。

## 编码

导入文本按 UTF-8（含 BOM）解码；失败时回退 GB18030/GBK（要求至少两个汉字，避免把无 BOM 的 UTF-16 误读成乱码）；带 BOM 的 UTF-16 与 XML 编码声明仍按声明校验。都失败才报 `文本编码无效：请使用 UTF-8、GB18030 或带 BOM 的 UTF-16 文件`。

## 实机截图

[阅读方框实拍](<evidence/reading-box-121.png>)、[设置区实拍](<evidence/settings-121.png>)来自全新 profile 里真实运行的 DSH Web，安装的是 1.2.1 发布包；连读三页的截图与拍摄时的 bundle 哈希记录在[验收记录](<evidence/release-121-screenshots.json>)。
