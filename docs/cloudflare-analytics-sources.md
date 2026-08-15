# Cloudflare Analytics 接入依据

Cloudflare 官方 GraphQL Analytics API 文档说明统一入口为 `https://api.cloudflare.com/client/v4/graphql`，使用 POST JSON 请求，并可按数据集、指标、维度进行聚合：[GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/)。

Cloudflare Web Analytics 官方 Core Web Vitals 文档说明可在 Web Analytics 面板查看 LCP、INP 和 CLS，并按 URL、浏览器、操作系统、国家和元素筛选；页面同时提供 P75 等百分位视图：[Core Web Vitals](https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/)。

当前项目只把真实用户指标作为可选输入，不在没有 Cloudflare 凭据或站点标识时伪造数据。自动化接入需要在 GitHub Actions 中配置受限的 Cloudflare API 凭据与站点标识，并按账号实际 GraphQL schema 验证字段后启用。
