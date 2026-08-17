# AdSense 上线准备复审关键证据

评估日期：2026-08-17

生产域名 `https://lovexiaoyue.cc.cd/privacy?adsense-audit=1` 当前仍显示旧占位页面：`Privacy first` 和 `This section is structured and ready for the next expansion of the ConvertKit toolkit.`。线上页面未显示完整 Privacy Policy、Cookie Consent Banner 或 Privacy choices 入口，说明最新法律页面与同意管理代码尚未部署到 Cloudflare 生产环境。

生产 `/robots.txt` 返回 HTTP 200、`content-type: text/plain`，包含 `Disallow: /admin` 和 `Sitemap: https://lovexiaoyue.cc.cd/sitemap.xml`；生产 `/sitemap.xml` 返回 HTTP 200、`content-type: application/xml`。生产首页、Privacy、Cookie Policy 和 Terms 均返回 HTTP 200，但当前页面内容版本仍需以浏览器实际渲染结果为准。

本地最新版本的 AdSenseSlot 要求 `VITE_ADSENSE_ENABLED=true`、`VITE_ADSENSE_CONSENT_READY=true`、client ID、slot ID 以及 `choice=granted`；CookieConsentProvider 默认 unknown，OptionalAnalytics 也在 granted 后才加载。浏览器实测本地 denied、granted、withdrawn 状态持久化和脚本加载/清理行为通过。

当前结论：**不能在生产环境启用 AdSense**。首要阻断项不是广告位代码，而是 Cloudflare 生产仍未部署真实 Privacy Policy、Cookie Policy、Terms、Cookie Consent Banner 和同意联动版本；其次需在正式启用前补齐运营者法定名称、真实隐私联系方式、Google ATP/广告供应商清单及 Google CMP/自建同意方案的生产确认。


追加证据：2026-08-17 生产 `/cookie-policy?adsense-audit=1` 仍显示 `Cookie policy` 与通用占位文案；生产 `/terms?adsense-audit=1` 仍显示 `Terms of use` 与通用占位文案。两页均没有最新法律正文、供应商披露或同意管理入口。


GitHub 审计：仓库为 `rguo3500/convertkit`。Secret 与 Actions Variable 列表查询均返回 HTTP 403 `Resource not accessible by integration`，因此不能确认 `VITE_ADSENSE_*` 运行时配置是否已设置。最近的 quality、Cross-browser E2E 和 weekly health workflow 均成功，但运行提交为 `3bb908a`，不代表本地最新 Cookie Consent 版本已经部署到 Cloudflare。
