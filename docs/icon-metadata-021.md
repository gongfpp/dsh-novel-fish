# 0.2.1 图标元信息修正

## 现象

安装 0.2.0 后，插件管理页的「包含的组件」卡片显示：

```text
包元信息错误: Plugin metadata for @gongfpp/dsh-novel-fish: Error: ENOENT: no such file or directory, lstat
'/Users/mass/.dsh/profiles/web/node_modules/@gongfpp/dsh-novel-fish/assets/icon.svg'
```

同时卡片图标回退为默认占位图，插件仍正常运行。

## 宿主如何读取插件图标

宿主 `dsh-app-boot` 的插件元信息读取函数（本机安装路径 `node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-app-boot/lib/index.js`，约 2164–2332 行）规则如下：

- 包清单 `package.json` 的 `icon` 字段优先于 `<specifier>/icon` 导出资源。
- `icon` 必须是包内相对路径，且不能逃出清单所在目录；绝对路径或带 scheme 的值直接报错。
- 允许的媒体类型只有 SVG、PNG、JPEG、WebP。
- 原始图标字节数上限 `MAX_ICON_BYTES = 256 KiB`，超限报 `icon exceeds 256 KiB`。
- 客户端只渲染宿主返回的 `meta.icon`（base64 data URL），不自行解析文件路径。

## 0.2.0 的问题

- `assets/icon.png` 为 512×512 RGBA PNG，380984 字节（约 372 KiB），超过 256 KiB 上限。
- `package.json` 只有 `exports["./icon"] = "./assets/icon.png"`，没有显式 `icon` 字段；旧版 0.1.8 的 `./icon` 曾指向 `./assets/icon.svg`。
- 报错里的 `assets/icon.svg` 来自运行中宿主此前缓存的元信息路径，而 0.2.0 安装目录里已没有该文件，于是按需读取时报 `ENOENT`。

## 0.2.1 的修正

- 图标重采样为 512×512 调色板 PNG，保留透明圆角，62056 字节。
- `package.json` 增加 `"icon": "./assets/icon.png"`，不再依赖导出资源的解析结果。
- `files` 与索引 `icon` 仍指向 `assets/icon.png`；`lib/client.js`、阅读行为和宿主兼容范围与 0.2.0 相同。

## 验证

- `pnpm verify`：测试与发布契约全部通过。
- 宿主契约探针：`ok=true`，7 项检查通过。
- 真实页面：重新安装 0.2.1 后插件管理页不再显示包元信息错误，卡片显示鲸鱼读书图标；阅读功能与进度不变。
