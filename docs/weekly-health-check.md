# ConvertKit 每周性能与索引健康检查

站点：`https://lovexiaoyue.cc.cd`  
检查周期：`YYYY-MM-DD` 至 `YYYY-MM-DD`  
执行人：  
记录日期：

## 结论摘要

本周总体状态：`正常 / 观察 / 需要处理`  
最重要的变化：  
需要跟进的负责人和截止日期：

## Cloudflare Web Analytics 与真实用户体验

| 指标                      | 本周 | 上周 | 变化 | 判断/行动 |
| ------------------------- | ---: | ---: | ---: | --------- |
| 访问量                    |      |      |      |           |
| 主要入口页面              |      |      |      |           |
| 4xx/5xx 错误率            |      |      |      |           |
| Largest Contentful Paint  |      |      |      |           |
| Interaction to Next Paint |      |      |      |           |
| Cumulative Layout Shift   |      |      |      |           |

记录时应区分真实用户数据与本地 Lighthouse 基线。若某项明显恶化，先按设备、地区、缓存状态和入口页面拆分，再决定是否创建代码回归任务；不要仅凭单日异常下结论。

## Search Console 索引健康

| 检查项                        | 状态                 | 备注/链接 |
| ----------------------------- | -------------------- | --------- |
| Sitemap 最近读取时间          | `正常 / 异常`        |           |
| Sitemap 处理错误              | `0 / 有`             |           |
| 已索引页面趋势                | `上升 / 稳定 / 下降` |           |
| 未索引页面主要原因            |                      |           |
| Core Web Vitals               | `通过 / 观察 / 失败` |           |
| 手动措施与安全问题            | `无 / 有`            |           |
| 首页 URL Inspection 实时测试  | `通过 / 失败`        |           |
| 一个 conversion pair 实时测试 | `通过 / 失败`        |           |
| 一个格式工具实时测试          | `通过 / 失败`        |           |

每次检查至少抽查首页、一个单位转换页和一个格式工具页。URL Inspection 的索引结果与实时测试结果应分开记录；实时测试通过不代表页面已经收录，也不保证页面一定出现在搜索结果中。

## 线上资源检查

```bash
curl -sS -o /dev/null -w 'home=%{http_code}\n' https://lovexiaoyue.cc.cd/
curl -sS -o /dev/null -w 'robots=%{http_code}\n' https://lovexiaoyue.cc.cd/robots.txt
curl -sS -o /dev/null -w 'sitemap=%{http_code}\n' https://lovexiaoyue.cc.cd/sitemap.xml
curl -sS -o /dev/null -w 'bulk=%{http_code}\n' https://lovexiaoyue.cc.cd/bulk-converter
```

预期是所有资源返回 HTTP 200。若 Sitemap 域名发生变化，检查 Cloudflare Pages 的 `VITE_SITE_URL` 构建变量和最近一次部署提交；若仅个别页面异常，检查 SPA fallback 与路由变化。

## 本周行动项

| 优先级 | 问题 | 证据 | 负责人 | 截止日期 | 状态                     |
| ------ | ---- | ---- | ------ | -------- | ------------------------ |
| P0     |      |      |        |          | `未开始 / 处理中 / 完成` |
| P1     |      |      |        |          | `未开始 / 处理中 / 完成` |
| P2     |      |      |        |          | `未开始 / 处理中 / 完成` |

## 参考入口

[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/get-started/)  
[Google Search Console](https://search.google.com/search-console)  
[Google Sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)  
[Google URL Inspection 说明](https://support.google.com/webmasters/answer/9012289?hl=en)
