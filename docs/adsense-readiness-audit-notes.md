# AdSense 上线准备复审关键证据

评估日期：2026-08-17

历史基线（后续已被生产浏览器复核 superseded）：生产 Privacy 页面曾显示旧占位页面 `Privacy first` 和 `This section is structured and ready for the next expansion of the ConvertKit toolkit.`；随后 Cloudflare 发布切换，生产浏览器已确认真实 Privacy Policy、Cookie Consent Banner 和 Privacy choices 入口可见。

生产 `/robots.txt` 返回 HTTP 200、`content-type: text/plain`，包含 `Disallow: /admin` 和 `Sitemap: https://lovexiaoyue.cc.cd/sitemap.xml`；生产 `/sitemap.xml` 返回 HTTP 200、`content-type: application/xml`。生产首页、Privacy、Cookie Policy 和 Terms 均返回 HTTP 200，但当前页面内容版本仍需以浏览器实际渲染结果为准。

本地最新版本的 AdSenseSlot 要求 `VITE_ADSENSE_ENABLED=true`、`VITE_ADSENSE_CONSENT_READY=true`、client ID、slot ID 以及 `choice=granted`；CookieConsentProvider 默认 unknown，OptionalAnalytics 也在 granted 后才加载。浏览器实测本地 denied、granted、withdrawn 状态持久化和脚本加载/清理行为通过。

当前结论：**仍不能在生产环境启用 AdSense**。quality workflow 已通过，真实法律页和 Cookie Banner 也已在生产浏览器确认可见；剩余阻断项是 GitHub 403 导致外部配置无法确认、运营者和供应商事实待核验、Google CMP/同意信号方案未确认，以及生产响应稳定性仍需复测。

历史基线（已被后续生产浏览器复核 superseded）：2026-08-17 早先检查曾观察到 Cookie Policy 与 Terms 占位文案；随后部署切换后，生产浏览器已确认法律页路由和 Cookie Banner 正常渲染。法律页中的真实运营者信息和供应商清单仍需运营者补齐/审核。

GitHub 审计：仓库为 `rguo3500/convertkit`。Secret 与 Actions Variable 列表查询均返回 HTTP 403 `Resource not accessible by integration`，因此不能确认 `VITE_ADSENSE_*` 运行时配置是否已设置。用户已确认提交 `1941a92` 的 quality workflow 成功，Cross-browser E2E 同提交也成功。

## 2026-08-17 详细复审补充

生产浏览器直接打开 `https://lovexiaoyue.cc.cd/?adsense-detailed-audit=1` 成功渲染真实 ConvertKit 首页、Cookie Consent Banner、Privacy Policy/Cookie Policy 链接和三枚同意操作按钮。浏览器页面没有显示 AdSense 广告位或可选 Google 请求的证据，符合当前默认关闭配置。

curl 对首页和 Privacy 返回 HTTP 200 及完整 HTML，但连接在 20 秒内未正常结束；Playwright 的 `goto` 也出现导航超时或 commit 后正文未及时水合。Cookie Policy 和 Terms 的 HTTP 请求可在约 4–6 秒完成。这是生产传输/Cloudflare 响应稳定性需要关注的问题，不应简单当作法律页面缺失。

重新运行报告型审计后，robots.txt 和 sitemap.xml PASS；浏览器交叉检查确认生产法律内容与 Cookie Banner 实际可见。GitHub Actions 最近的 `quality` run 在提交 `1941a92` 已由用户确认成功，Cross-browser E2E 同提交为 success；Actions Secret/Variable API 仍返回 403，无法确认外部 AdSense 配置。
