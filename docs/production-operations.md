# Production operations

## Sitemap submission

生产 Sitemap 位于：`https://lovexiaoyue.cc.cd/sitemap.xml`。在 [Google Search Console](https://search.google.com/search-console) 中先验证 `lovexiaoyue.cc.cd` 的 Domain property，然后在 **Sitemaps** 页面提交 `sitemap.xml`。在 [Bing Webmaster Tools](https://www.bing.com/webmasters) 中完成站点验证后，也提交同一个 Sitemap URL。

提交后不要把 Cloudflare Pages 的预览域名或本地地址加入 Sitemap。新增 conversion pair 时，只修改 `data/conversion-pairs.json`，重新部署后检查 Sitemap 的 URL 数量和域名是否仍为 `lovexiaoyue.cc.cd`。

## Cloudflare Analytics

在 Cloudflare Dashboard 的 **Web Analytics** 或 Pages 项目 Analytics 面板中，为 `lovexiaoyue.cc.cd` 开启访问与性能观测。当前网站不会在没有完整环境变量时注入 Umami 脚本；如果使用 Umami，需要同时设置 `VITE_ANALYTICS_ENDPOINT` 和 `VITE_ANALYTICS_WEBSITE_ID`，然后重新构建部署。不要把私密 API token 放入 `VITE_*` 变量，因为这些变量会进入浏览器构建产物。

建议每周观察以下指标：访问量、主要入口页面、缓存命中、错误率、Largest Contentful Paint、Interaction to Next Paint 和 Cumulative Layout Shift。对生产数据和本地 Lighthouse 基线进行区分，避免把网络、设备或缓存差异误判为代码回归。

## Production checks

```bash
curl -I https://lovexiaoyue.cc.cd/
curl -I https://lovexiaoyue.cc.cd/robots.txt
curl -I https://lovexiaoyue.cc.cd/sitemap.xml
pnpm run validate:conversions
pnpm run test
pnpm run check
VITE_SITE_URL=https://lovexiaoyue.cc.cd pnpm run build
```

生产域名每次发布后，至少抽查首页、一个 conversion pair、格式工具、`robots.txt` 和 `sitemap.xml`。如果页面返回 200 但 Sitemap 仍包含旧域名，应优先检查 Cloudflare Pages 构建环境中的 `VITE_SITE_URL`，然后重新部署。
