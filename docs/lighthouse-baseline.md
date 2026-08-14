# Lighthouse baseline

本基线来自 2026-08-14 的本地生产构建审计，URL 使用 `http://localhost:4173`，因此它用于回归比较，不等同于真实生产域名的最终分数。真实域名部署后，应在同样的 Lighthouse 配置下重新运行并更新记录。

| 页面 | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 0.63 | 0.88 | 0.78 | 1.00 |
| `/converters` | 0.71 | 0.88 | 0.78 | 1.00 |
| `/format-converters` | 0.58 | 0.87 | 0.78 | 1.00 |
| `/meters-to-feet` | 0.71 | 0.88 | 0.78 | 1.00 |
| `/bulk-converter` | 0.71 | 0.88 | 0.78 | 1.00 |
| `/pricing` | 0.71 | 0.87 | 0.78 | 1.00 |

## Interpretation

当前 SEO 分类已经达到 1.00；可访问性约为 0.87–0.88，后续重点应放在颜色对比、表单标签和键盘操作检查。格式工具页 Performance 最低，后续优先观察懒加载、CSS 体积和第三方脚本对首屏的影响。Best Practices 的 0.78 作为当前开发环境基线，不应直接视为生产缺陷。

## Production runbook

真实域名部署后，设置 `VITE_SITE_URL`，启动 production preview，再运行 `pnpm run audit`。将六个页面的最终分数回填到本表，并把低于 CI 门槛的页面作为发布阻断项处理。
