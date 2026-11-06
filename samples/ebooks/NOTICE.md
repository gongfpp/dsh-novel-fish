# 内置两本样书的来源、范围与许可

书源核对日期：2026-11-06；目录调整日期：2026-11-07。此目录只选择下面两本作为 1.1.0 内置样书。未选候选、版权地区受限的《骆驼祥子》以及已移除的《山海经》及制作材料均不随当前包分发。

| 书名 / 范围 | 作者 | 格式 | 大小 |
| --- | --- | --- | ---: |
| [《百万英镑及其他新故事》英文原文](<million-pound-bank-note-pg61522.txt>) | Mark Twain / 马克·吐温（1835–1910） | UTF-8 TXT | 394538 bytes |
| [《阿Q正传》完整九章繁体原文](<aq-zheng-zhuan-wikisource.md>) | 鲁迅（1881–1936） | UTF-8 MD | 68170 bytes |

两个图书文件合计 **462708 bytes（约 451.9 KiB）**。文件 URL、精确 SHA-256、数字版来源和分发条件见[来源清单](<sources.json>)。

## 真实版本边界

- 《百万英镑》使用 Project Gutenberg #61522 原样下载，实际是 1893 年英文合集，包含完整同名故事及另外八篇，不冒称独立单篇版。完整 PG 头尾、制作署名和全部许可证保留。
- 《阿Q正传》是维基文库官方 TXT 完整导出的本地 Markdown 衍生版，只在文件前增加 `# 阿Q正傳` 标题及空行。移除这个 14 字节 UTF-8 前缀即可恢复原始 68156 字节 TXT；第一章“序”至第九章“大團圓”、小说结尾、数字版全部贡献者与许可逐字节保留。不冒称原站原生 MD，不包含现代译注或改写。
- EPUB 导入功能保留，但当前包没有 EPUB 样书；测试专用衍生 EPUB 和四种真实拒绝负例只留在本地测试输出，不随包分发。

## 不将“可免费阅读”等同于“可再分发”

图书不继承插件的 MIT 软件许可证。[LICENSE.md](<LICENSE.md>) 是可立即离线访问的完整综合声明，包含两书署名、来源/贡献历史、适用许可链接、修改范围和逐字复制的完整 Project Gutenberg License；原书内各自声明仍须保留。

1. 英文原作发表于 1893 年，作者卒于 1910 年；PG 标注美国公版。保留 PG 标识时仍须遵守 PG 分发条款，收费分发另有条件，非 PG 背书。
2. 鲁迅原作 1921–1922 年连载，作者卒于 1936 年；来源明确说明中国/台湾及美国公版。数字导出声明 CC BY-SA 3.0 Unported 或 GFDL，保留原导出贡献者和声明；当前站点 CC BY-SA 4.0 条款也可能适用。MD 衍生版应保留署名、来源、修改说明和适用的相同方式共享条款，不加 DRM 或额外限制。历史原作公版不自动豁免现代转录、译注或图片的单独条件。

其他地区须自行适用当地法律，不作全球一概合法的保证。

## 英文 Project Gutenberg 文件的显著声明

下述 §1.E.1 声明**仅适用于英文 PG 样书**，不是 AQ 的许可证：

> This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the Project Gutenberg™ License included with this eBook or online at [www.gutenberg.org](https://www.gutenberg.org/policy/license.html). If you are not located in the United States, you will have to check the laws of the country where you are located before using this eBook.

完整许可可立即读取 [LICENSE.md](<LICENSE.md>)，同时保留 [PG 官方许可页](https://www.gutenberg.org/policy/license.html) 链接。原选书菜单的「书籍信息」提供署名/来源和完整离线声明下载，不能因只显示小说片段而删除署名或许可可达性。
