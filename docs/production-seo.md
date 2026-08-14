# Production domain and SEO release guide

## Build configuration

在生产构建环境设置真实站点根地址，例如：

```bash
export VITE_SITE_URL=https://tools.example.com
pnpm run build
```

构建前会从 `data/conversion-pairs.json` 生成 registry、`client/public/sitemap.xml` 和 `client/public/robots.txt`。构建后应确认 Sitemap 中的 `<loc>` 均使用真实域名，不能保留 `convertkit.example` 占位地址。

## Pre-release checks

发布前运行以下命令：

```bash
pnpm run validate:conversions
pnpm run test
pnpm run check
VITE_SITE_URL=https://tools.example.com pnpm run build
curl -I https://tools.example.com/robots.txt
curl -I https://tools.example.com/sitemap.xml
```

应确认 Robots 返回成功状态，Sitemap 为 XML 内容，并且每个 pair URL 可以返回页面而不是 404。若增加 pair，只修改 JSON 数据源并重新构建，不要手动编辑生成文件。

## Search engine submission

将生产域名添加到搜索引擎站长工具后，提交 `https://tools.example.com/sitemap.xml`。域名、协议或路径变更时，重新设置 `VITE_SITE_URL` 并重新构建，以同步 canonical、Open Graph 和 Sitemap 地址。不要在本地预览域名上提交 Sitemap。

## GitHub Actions

CI 使用示例域名构建以验证生成流程；生产部署平台应在自己的构建环境中注入真实 `VITE_SITE_URL`。仓库的 `quality` job 负责验证结构与质量门禁，但不会替代生产域名验证。
