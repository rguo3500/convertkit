# Cloudflare Pages deployment

ConvertKit 是静态 React/Vite 网站，适合部署到 Cloudflare Pages。Manus 自带托管同样支持 TLS、预览和自定义域名；选择 Cloudflare 时，需要自行管理 Cloudflare 项目、域名、环境变量和发布日志。

## Option A: Git integration

在 Cloudflare Dashboard 的 **Workers & Pages → Create application → Pages → Connect to Git** 中选择 `rguo3500/convertkit`。构建配置如下：

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm run build` |
| Build output directory | `dist/public` |
| Node.js version | `22` |
| Environment variable | `VITE_SITE_URL=https://lovexiaoyue.cc.cd` |
| Environment variable | `PNPM_VERSION=10.4.1` |

对 Preview 环境使用对应的预览 URL 设置 `VITE_SITE_URL`，不要把示例域名部署到生产环境。每次构建会自动生成 registry、Sitemap 和 Robots。

## Option B: Wrangler

先在本地安装或临时调用 Wrangler，并完成 Cloudflare 登录。需要 Cloudflare API Token 或交互式登录；本项目当前沙箱没有 Cloudflare 凭据，因此不会代替用户登录或上传项目。

```bash
export VITE_SITE_URL=https://lovexiaoyue.cc.cd
pnpm run deploy:cloudflare
```

该命令会构建 `dist/public`，然后执行 `wrangler pages deploy dist/public --project-name convertkit`。首次发布时，如果 Cloudflare 要求创建项目，请确认项目名为 `convertkit`。

## Routing and SEO

`client/public/_redirects` 中的 `/* /index.html 200` 为 Wouter SPA 路由提供回退。发布后应检查以下地址：

```text
https://lovexiaoyue.cc.cd/
https://lovexiaoyue.cc.cd/meters-to-feet
https://lovexiaoyue.cc.cd/format-converters
https://lovexiaoyue.cc.cd/robots.txt
https://lovexiaoyue.cc.cd/sitemap.xml
```

确认生产 Sitemap 中没有 `convertkit.example`，并在 Cloudflare Pages 的 Custom domains 中绑定真实域名。之后将 `https://lovexiaoyue.cc.cd/sitemap.xml` 提交到搜索引擎站长工具。
