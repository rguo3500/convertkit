# ConvertKit

[![ConvertKit quality](https://github.com/rguo3500/convertkit/actions/workflows/quality.yml/badge.svg)](https://github.com/rguo3500/convertkit/actions/workflows/quality.yml)

ConvertKit 是一个采用 Signal Workshop 视觉系统的浏览器本地单位与格式转换工具集。普通输入尽可能只在浏览器中处理，不要求账号，也不上传转换内容。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器，并生成 conversion registry |
| `pnpm test` | 运行 Vitest 单元测试 |
| `pnpm run validate:conversions` | 校验 `data/conversion-pairs.json` |
| `pnpm run check` | TypeScript 类型检查 |
| `VITE_SITE_URL=https://your-domain.example pnpm run build` | 生成 registry、Sitemap、Robots 并构建生产包 |
| `pnpm run audit` | 运行 Lighthouse CI |

## 数据维护

新增或修改单位 pair 时，只编辑 `data/conversion-pairs.json`，不要直接编辑生成的 `client/src/data/conversionRegistry.ts`。开发和构建命令会自动重新生成 registry；构建流程还会根据同一数据源生成 Sitemap 中的 pair URL。提交前运行 `pnpm run validate:conversions`。

## 质量门禁

GitHub Actions 工作流会执行 conversion 数据校验、单元测试、类型检查、生产构建和 Lighthouse。仓库管理员应将 `quality` job 设置为 `main` 分支的 required status check，并开启 pull request review、禁止直接推送和合并前分支更新要求。具体操作见 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

## 生产域名

生产构建必须设置 `VITE_SITE_URL`。部署说明、Sitemap 提交和域名替换步骤见 [`docs/production-seo.md`](./docs/production-seo.md)。Cloudflare Pages 的 Git 集成、Wrangler 发布和 SPA 回退说明见 [`docs/cloudflare-pages.md`](./docs/cloudflare-pages.md)。生产域名的 Sitemap 提交、Analytics 和 Web Vitals 检查见 [`docs/production-operations.md`](./docs/production-operations.md)。
