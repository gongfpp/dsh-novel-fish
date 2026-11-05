# 1.0.1 兼容区间修正

日期：2026-11-05。本版只改 `engines.dsh` 与配套声明，不改阅读行为、不改浏览器产物。

## 问题

1.0.0 的声明是 `>=0.2.1-rc.2 <=0.2.2-alpha.2`。semver 排序里 `0.2.2-alpha.2 < 0.2.2-rc.1`，所以上限把 `0.2.2-rc.1` 及之后的所有 0.2.2 预发布宿主全挡在外面。宿主预检用 `semver.satisfies(range, { includePrerelease: true })`，命中的就是区间本身：

```
satisfies('0.2.2-rc.1', '>=0.2.1-rc.2 <=0.2.2-alpha.2', { includePrerelease: true })  // false
satisfies('0.2.2-rc.1', '>=0.2.1-rc.2 <0.3.0-0',            { includePrerelease: true })  // true
```

被挡住的宿主上，商店那条安装路径会在 preflight 直接拒绝加载，源码能不能跑无关。

## 修正

- `engines.dsh` 改为 `>=0.2.1-rc.2 <0.3.0-0`，与 0.1.6 用过的区间一致。
- 版本 `1.0.1`，仅此两项加文档；`lib/client.js`、`THIRD-PARTY-NOTICES.txt` 不变（CI 用 `git diff --exit-code` 锁住）。
- `.github/workflows/verify.yml` 的 `DSH_HOST_VERSION` 从 `0.2.2-alpha.2` 提到 `0.2.2-rc.1`，后端探针跟着新宿主跑。

## 本轮实测

在临时目录安装 `@deepseek-ai/dsh@0.2.2-rc.1`（`npm install --prefix`，`--ignore-scripts`），跑只读契约探针：

```
HOST_ROOT=.../node_modules/@deepseek-ai/dsh node scripts/check-host-contracts.mjs
  hostVersion 0.2.2-rc.1
  checks      7
  ok          true

HOST_ROOT=... node --test test/host-contracts.test.js
  pass 2 / fail 0
```

探针覆盖宿主的聊天/工具/会话 DOM 标记、`plugins.bundle.config` 的 keyed 页面座位、私有导出、未受信点击的书本进度守卫、真实 Factory 属性与设置页控件、停用后的还原、标题层与折叠态的适配锚点。限制照旧：JSDOM 不是浏览器，没有布局、动画、焦点与真实用户事件证明。

## 仍然成立的话

- 真实页面验收只在 `0.2.2-alpha.2` 上做过（见 [连续阅读验收](continuous-reading-020.md)）；`0.2.2-rc.1` 只有上面的探针结论，没有页面级复验。
- 区间是准入策略，不是逐版本验收结论。不因为放宽上限就宣称对 `0.2.2` 之后任何版本的行为负责。
