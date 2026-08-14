# Cloudflare live check — 2026-08-14

生产站点 `https://lovexiaoyue.cc.cd/` 与 pair 页面均返回 HTTP 200，首页标题为 `Free Online Unit & Format Converters | ConvertKit`。

在提交 `3eb2814` 之前，线上 `robots.txt` 的 Sitemap 仍指向 `https://convertkit.example/sitemap.xml`，线上 `sitemap.xml` 的 `<loc>` 也仍使用 `https://convertkit.example/...`。根因是 Cloudflare 尚未重新部署包含真实域名默认值的最新提交。

修复已推送到 `rguo3500/convertkit` 的 `main`：`3eb2814 fix: set production seo domain`。下一次 Cloudflare Pages 构建后，应复核：

```text
https://lovexiaoyue.cc.cd/robots.txt
https://lovexiaoyue.cc.cd/sitemap.xml
```

两者均不应再出现 `convertkit.example`，而应包含 `lovexiaoyue.cc.cd`。
