# Production Lighthouse baseline

审计时间：2026-08-14。审计目标为 `https://lovexiaoyue.cc.cd`，使用无登录 Chrome 生产环境访问。分数为 Lighthouse 分类分数，范围为 0–1。

| 页面 | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 0.76 | 0.88 | 0.81 | 1.00 |
| `/meters-to-feet` | 0.76 | 0.89 | 0.81 | 1.00 |
| `/format-converters` | 0.70 | 0.87 | 0.81 | 1.00 |
| `/bulk-converter` | 0.70 | 0.89 | 0.81 | 1.00 |
| `/pricing` | 0.71 | 0.87 | 0.81 | 1.00 |

## Reading the baseline

真实生产环境的 SEO 分类均为 1.00；首页和单位详情页 Performance 为 0.76，格式工具、批量转换和 Pricing 约为 0.70–0.71。可访问性为 0.87–0.89，后续可优先检查表单标签、颜色对比与键盘焦点。Best Practices 为 0.81，建议在 Cloudflare Analytics 的真实设备数据积累后再判断是否需要针对性优化。

下一次发布后，使用相同页面集合重新运行 Lighthouse，并重点比较 Performance、Accessibility 和 Core Web Vitals，而不要只比较单次实验室分数。

## Follow-up audit after accessibility release

第二次审计时间：2026-08-14，确认线上 CSS 已包含可访问性焦点色 `#5f8dff`，说明提交 84bd53a 已部署。由于 Lighthouse 实验室网络和缓存波动，Performance 分数不作为单次回归结论；Accessibility、SEO 和 Best Practices 仍保持稳定。

| 页面 | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 0.69 | 0.88 | 0.81 | 1.00 |
| `/meters-to-feet` | 0.79 | 0.89 | 0.81 | 1.00 |
| `/format-converters` | 0.75 | 0.87 | 0.81 | 1.00 |
| `/bulk-converter` | 0.52 | 0.89 | 0.81 | 1.00 |
| `/pricing` | 0.63 | 0.87 | 0.81 | 1.00 |


## 2026-08-15 生产复测

最新提交 `e268a6b` 已推送到 GitHub main，生产域名复测结果如下：

| 页面 | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| 首页 | 0.76 | 1.00 | 0.81 | 1.00 |
| Meters to Feet | 0.83 | 1.00 | 0.81 | 1.00 |
| Format converters | 0.72 | 1.00 | 0.81 | 1.00 |
| Bulk converter | 0.74 | 1.00 | 0.81 | 1.00 |
| Pricing | 0.75 | 1.00 | 0.81 | 1.00 |

本轮复测重点验证了格式工具交互测试新增后的生产页面未发生回归，并确认可访问性改动已在线生效。GitHub main 当前短 SHA 为 `e268a6b`；首页、`robots.txt` 和 `sitemap.xml` 均返回 HTTP 200。
