# Production operations

本文档面向 `https://lovexiaoyue.cc.cd` 的生产维护者，重点覆盖搜索引擎提交、访问分析、发布验证和隐私边界。ConvertKit 的 Sitemap 在构建阶段根据 `VITE_SITE_URL` 生成；任何预览域名、本地地址或旧域名都不应进入生产 Sitemap。

## Sitemap submission

生产 Sitemap 位于 [`https://lovexiaoyue.cc.cd/sitemap.xml`](https://lovexiaoyue.cc.cd/sitemap.xml)。在 [Google Search Console](https://search.google.com/search-console) 中先验证 `lovexiaoyue.cc.cd` 的 Domain property，然后在 **Sitemaps** 报告中提交 `sitemap.xml`。Google 将 Sitemap 提交视为抓取提示，而不是收录保证；提交后应根据报告中的最后读取时间和处理错误持续复核。[1]

在 [Bing Webmaster Tools](https://www.bing.com/webmasters) 中完成站点验证后，也提交完整 URL `https://lovexiaoyue.cc.cd/sitemap.xml`。项目的 `robots.txt` 同时声明了 Sitemap 地址，因此发布后应确认它仍然指向生产域名。

| 发布后检查                              | 预期结果                                                           |
| --------------------------------------- | ------------------------------------------------------------------ |
| `https://lovexiaoyue.cc.cd/sitemap.xml` | HTTP 200，XML 中只出现生产绝对 URL                                 |
| `https://lovexiaoyue.cc.cd/robots.txt`  | HTTP 200，包含 `Sitemap: https://lovexiaoyue.cc.cd/sitemap.xml`    |
| Search Console Sitemap 报告             | 能看到最近读取时间，且没有解析错误                                 |
| 新增 conversion pair                    | 只修改 `data/conversion-pairs.json`，重新部署后复核 URL 数量和域名 |

Google 的 Sitemap 文档要求使用 UTF-8、完整绝对 URL，并建议将 Sitemap 放在站点根目录；项目当前的 `generate-seo.mjs` 与这些约束保持一致。[1]

## Google Search Console URL Inspection

新页面或重要 SEO 修改发布后，在 Search Console 的 URL Inspection 中输入完整 URL，先运行 **Test live URL**，确认页面可访问、canonical 和结构化数据没有明显问题；必要时再使用 **Request indexing**。URL Inspection 的索引结果来自 Google 最近一次抓取，不一定等于当前线上版本，因此应区分索引结果和实时测试结果。[2]

建议按以下顺序抽查：

1. 首页：`https://lovexiaoyue.cc.cd/`。
2. 一个单位转换页，例如 `https://lovexiaoyue.cc.cd/meters-to-feet`。
3. 一个格式工具，例如 `https://lovexiaoyue.cc.cd/json-formatter`。
4. 批量页面：`https://lovexiaoyue.cc.cd/bulk-converter`。

URL Inspection 通过并不代表页面一定会进入搜索结果；页面仍需满足质量、安全、canonical、robots 和重复内容等条件。[2]

## Cloudflare Web Analytics

Cloudflare Pages 支持在 Cloudflare Dashboard 的 **Workers & Pages → 对应 Pages 项目 → Analytics/Web Analytics** 中启用 Web Analytics。Cloudflare 的官方流程是添加站点 hostname、复制或启用对应 beacon，并等待数据出现；首次采集可能需要几分钟。[3]

对本项目建议采用以下配置：

| 配置项        | 建议                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- |
| 站点 hostname | `lovexiaoyue.cc.cd`                                                                    |
| 启用位置      | Cloudflare Pages 项目的 Web Analytics/Analytics 面板                                   |
| 采集范围      | 生产域名，不采集本地和预览域名作为正式数据                                             |
| 脚本方式      | 优先使用 Cloudflare Pages 的一键接入；若改用手动 beacon，放在生产 HTML 的 `</body>` 前 |
| 验证方式      | 发布后访问首页和一个工具页，在 Dashboard 中确认请求和页面数据出现                      |

项目不会在缺少完整环境变量时注入 Umami 脚本；如果选择 Umami，需要同时设置 `VITE_ANALYTICS_ENDPOINT` 和 `VITE_ANALYTICS_WEBSITE_ID`，然后重新构建部署。不要把私密 API token 放入 `VITE_*` 变量，因为它们会进入浏览器构建产物。Cloudflare Web Analytics 的 beacon 数据来源和请求路径可参考其官方数据采集说明。[4]

建议每周观察访问量、主要入口页面、错误率、Largest Contentful Paint、Interaction to Next Paint 和 Cumulative Layout Shift。生产数据与本地 Lighthouse 基线应分开解读，避免把网络、设备或缓存差异误判为代码回归。分析启用后，应在站点隐私说明中明确记录使用的分析服务、采集目的和用户可用的隐私控制。

## Weekly automated health check

`.github/workflows/weekly-health.yml` 每周一 02:17 UTC 自动运行，也支持在 GitHub Actions 中使用 **Run workflow** 手动触发。它会检查生产首页、`robots.txt`、`sitemap.xml`、批量转换页和 JSON 工具页，验证 HTTP 状态以及 Robots/Sitemap 是否仍指向 `lovexiaoyue.cc.cd`。每次运行都会生成 Job Summary，并将 Markdown 报告保存为 artifact。质量工作流的 `QUALITY_ARTIFACT_RETENTION_DAYS` 仓库变量可配置 artifact 保留天数，未设置时默认为 30 天；`artifacts/summary/artifact-index.md` 会列出运行链接、文件大小和 SHA-256，下载后可用 `sha256sum` 复核完整性。

如果检查失败，工作流会自动创建或更新唯一的开放 Issue：`[ConvertKit] Weekly health check needs review`，并添加 `health-check` 与 `automated` 标签。若在仓库 Variables 中设置 `HEALTH_ALERT_ASSIGNEE`，工作流还会自动指定一名负责人；未设置时不会强行分配账号。该 Issue 使用固定标记避免重复创建；下一次成功检查会追加 resolved 评论并自动关闭 Issue。工作流通过仓库的 `GITHUB_TOKEN` 写入 Issue，不需要额外的第三方 webhook 密钥。

## Production checks

```bash
curl -I https://lovexiaoyue.cc.cd/
curl -I https://lovexiaoyue.cc.cd/robots.txt
curl -I https://lovexiaoyue.cc.cd/sitemap.xml
curl -I https://lovexiaoyue.cc.cd/bulk-converter
pnpm run validate:conversions
pnpm run test
pnpm run check
VITE_SITE_URL=https://lovexiaoyue.cc.cd pnpm run build
```

生产域名每次发布后，至少抽查首页、一个 conversion pair、格式工具、批量转换页、`robots.txt` 和 `sitemap.xml`。如果页面返回 200 但 Sitemap 仍包含旧域名，应优先检查 Cloudflare Pages 构建环境中的 `VITE_SITE_URL`，然后重新部署。

Lighthouse 页面级例外只允许写入 `data/lighthouse-exceptions.json`，每条规则应同时包含 `page`、`metric`、`maxDrop`、`reason` 和 `expiresOn`。过期或 30 天内到期的规则会被写入 `lighthouse-exception-reminders.txt`，并由质量工作流自动创建或更新 `[ConvertKit] Lighthouse exceptions need review` Issue；没有临近到期规则时，下一次质量运行会评论并关闭该 Issue。维护者应在到期前更新基线、修复根因或删除例外，避免长期放宽质量门槛。

每周健康检查可通过 GitHub Actions Secret `CLOUDFLARE_RUM_METRICS_JSON` 接入已核验的 Cloudflare Web Analytics RUM 汇总，格式为 `{"visits":1234,"lcpP75Ms":2100,"inpP75Ms":180,"clsP75":0.08,"windowStart":"2026-08-08T00:00:00Z","windowEnd":"2026-08-15T00:00:00Z","collectedAt":"2026-08-15T00:00:00Z","routes":[{"path":"/bulk-converter","visits":320,"lcpP75Ms":2300,"inpP75Ms":175,"clsP75":0.06}]}`。`routes` 为可选数组，最多保留 20 条合法页面路由；报告会在聚合指标之后展示最新验证快照的路由级 LCP、INP、CLS。手动运行 workflow 时可在 `RUM history range` 下拉框选择 `all`、`7d` 或 `30d`，对应全部可用、最近 7 天和最近 30 天；该选择会传入 `CLOUDFLARE_RUM_HISTORY_PRESET`，报告标题和筛选摘要会回显本次选择，并分别列出 Window start、Window end 和 UTC timezone，同时在存在基线时显示当前窗口相对前一验证窗口的 LCP、INP、CLS 差异，并提供按页面路由的 LCP、INP、CLS 差异表；可通过 `CLOUDFLARE_RUM_ROUTE_SORT` 选择 `path`、`lcp`、`inp` 或 `cls` 排序，并通过 `CLOUDFLARE_RUM_ROUTE_MIN_DELTA` 过滤最小绝对变化幅度；每次运行同时生成带 preset、UTC 起止日期的 `rum-route-differences-<preset>-<start>-<end>-<short-sha>-<run-timestamp>.csv` 和同名 `.json` 文件；JSON 元数据同时记录 `commitSha` 与 `runTimestamp`，用于区分同一 commit 的重复运行，两者包含相同筛选参数与路由级 LCP/INP/CLS 差异；workflow 另外生成 `rum-route-export-index.json`，集中记录导出文件的 runTimestamp、commit SHA、preset、窗口、行数、字节数和 SHA-256，可从 weekly health artifact 下载；也可通过 `CLOUDFLARE_RUM_HISTORY_START_DATE` 与 `CLOUDFLARE_RUM_HISTORY_END_DATE` 传入 `YYYY-MM-DD` UTC 日期范围；显式日期优先于预设，仅筛选该时间段内的历史快照；日期无效或倒置时会明确标记筛选被忽略。脚本默认要求采集时间不超过 8 天、时间窗口有效且不晚于当前时间；恢复评论会带出时间范围、数据新鲜度、Visits、LCP P75、INP P75、CLS P75 和采集时间。未配置或 JSON 不合法/过期时明确显示 Not configured 或 STALE_OR_INVALID，不会生成或填充虚假指标。

Pull Request 质量评论会直接链接到当前 workflow 的 artifact 下载页，并显示索引文件数、总字节数、axe/Lighthouse/summary/failures 报告数量以及 HTTP_4XX、HTTP_5XX、NETWORK_OR_TIMEOUT 失败类型，并按质量摘要中的 workflow step 标题分组，同时显示每类失败次数、最近一次带 UTC 时间戳的发生时间，并在 Job Summary 中汇总最近 10 次运行的失败时间段趋势；该趋势同时写入 `artifacts/summary/webhook-audit.json` 的 `failureTrend` 字段，并由 `scripts/webhook-audit-schema.test.mjs` 校验 schema；包含窗口运行数、各 bucket 累计次数和最近发生时间；评论同时指向其中的 `artifacts/summary/artifact-index.md`，索引包含文件大小和 SHA-256，可用于下载后的完整性校验。PR 评论会显示 webhook audit schema 校验结果、RUM 路由导出文件数与行数，并为发现的 CSV/JSON 文件生成具体文件名链接和 SHA-256 校验值，同时保留质量 artifact 下载页作为导出和失败详情链接；质量工作流可通过仓库变量 `LIGHTHOUSE_ISSUE_ASSIGNEE` 配置 GitHub 用户名，例外到期提醒 Issue 会在正文中自动 `@mention` 该负责人；负责人变更会追加到 `Owner history`，包含 UTC 时间戳和前后负责人。团队 Webhook 的最近 30 次运行记录会写入 `artifacts/webhook-history.json`，并生成包含提交 SHA、记录时间、保留条数和 SHA-256 摘要的 `artifacts/summary/webhook-audit.json`；Actions cache 用于跨运行恢复，artifact 则作为本次运行的可下载审计证据，二者都不包含 Webhook URL 或密钥。`.github/workflows/e2e.yml` 在 Chromium、Firefox、WebKit 和移动 Safari（iPhone 13 viewport）上运行 `pnpm test:e2e`，并上传失败 trace/report；当前回归用例验证批量转换页 Keyboard shortcuts 面板的 Escape 关闭与焦点返回，并在移动 Safari 横向 viewport 下验证桌面导航与竖屏移动菜单切换后的 Escape 焦点返回，同时模拟动态 viewport 缩短后的软键盘场景，确认 CSV 输入焦点和内容保持可用；同一回归套件还验证真实 CSV 文件选择后取消选择不会清空本地状态，并在受限文档加载延迟、动态 viewport 和滚动位置变化下保持页面可用。批量转换页的 Keyboard shortcuts 面板会通过 `aria-live` 播报打开、关闭和焦点移动状态；Escape 关闭后焦点返回触发按钮，且由批量转换交互测试覆盖；面板使用 Shift+/ 打开、Escape 关闭；播报会根据浏览器中文语言环境提供中文消息，否则使用英文消息。首页搜索输入框、首页快捷入口、页脚链接、桌面与移动导航、主题切换、筛选下拉框、排序下拉框、清除筛选、复制共享链接和快捷键帮助按钮均提供中英文 `aria-label`，界面会根据浏览器中文语言环境选择播报语言。首页与页脚快捷入口已加入键盘焦点可达性回归测试，首页搜索和“Browse all unit converters”快捷入口显式保留 focus-visible 样式；`Home.a11y.test.tsx` 和批量转换交互测试分别覆盖首页入口与 Keyboard shortcuts 面板触发/关闭按钮的焦点可视化。问题列筛选与排序同步到 `issuesColumn`、`issuesSort` URL 参数，例如 `/bulk-converter?issuesColumn=kilograms&issuesSort=row-desc`，可直接分享并复现当前问题视图；点击清除筛选会移除列参数，恢复默认行号升序时会移除排序参数。

## References

[1]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap "Google Search Central — Build and submit a sitemap"
[2]: https://support.google.com/webmasters/answer/9012289?hl=en "Google Search Console Help — URL Inspection tool"
[3]: https://developers.cloudflare.com/web-analytics/get-started/ "Cloudflare Developers — Enabling Cloudflare Web Analytics"
[4]: https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/ "Cloudflare Developers — Data origin and collection"
