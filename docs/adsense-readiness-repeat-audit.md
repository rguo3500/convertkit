# ConvertKit AdSense 上线准备再次复审

**复审时间：** 2026-08-17  
**生产域名：** https://lovexiaoyue.cc.cd  
**结论：** **仍不能启用 Google AdSense。生产版本没有切换到上一轮整改版本。**

## 复审结果

| 项目 | 结果 | 说明 |
|---|---|---|
| 本地 AdSense 门控 | 通过 | 需要站点开关、同意状态、client ID 和 slot ID；未满足时返回 null |
| 本地 Cookie Consent | 通过 | unknown/granted/denied、拒绝、偏好管理、撤回和动态脚本清理已验证 |
| 本地法律页面 | 通过 | Privacy、Cookie Policy、Terms 已有真实正文 |
| 生产 Cookie Banner | 未通过 | 首次访问未出现 Cookie Consent Banner |
| 生产 Privacy Policy | 未通过 | 仍显示旧 Placeholder |
| 生产 Cookie Policy | 未通过 | 仍显示旧 Placeholder |
| 生产 Terms | 未通过 | 仍显示旧 Placeholder |
| 生产广告脚本门控 | 部分通过 | 当前没有广告请求；但生产未部署同意逻辑，不能据此放行 |
| robots.txt | 通过基础检查 | HTTP 200、`text/plain`、Sitemap 声明存在 |
| sitemap.xml | 通过基础检查 | HTTP 200、`application/xml`、生产主机存在 |
| GitHub quality/E2E/weekly health | 最近运行成功 | 最近可见成功运行使用提交 `3bb908a`；不能证明 Cloudflare 已部署最新本地版本 |
| GitHub Secret/Variable | 无法确认 | API 查询仍返回 HTTP 403 |
| AdSense client/slot/ATP/CMP | 无法确认 | 需要 AdSense、Cloudflare 和仓库管理员权限 |

## 关键证据

最新 `audit:production:adsense` 运行结果为 report-only，共有 4 项需要复核：生产首页没有 Cookie Banner，生产三份法律页面均检测到旧 Placeholder。robots.txt 和 sitemap.xml 两项通过。

生产浏览器页面仍显示以下旧内容：

> This section is structured and ready for the next expansion of the ConvertKit toolkit.

这说明上一轮新增的 `LegalPages.tsx`、`CookieConsentBanner` 和 `CookieConsentProvider` 尚未进入 `lovexiaoyue.cc.cd` 的实际部署版本。

## 当前放行判断

**AdSense 生产启用：不放行。** 当前不能把 `VITE_ADSENSE_ENABLED` 或 `VITE_ADSENSE_CONSENT_READY` 设置为 true，也不能仅因为“没有检测到广告请求”就认为合规。生产必须先发布最新代码，并在真实域名重新验证法律页面、Banner 和 unknown/denied/granted/withdrawn 四态行为。

## 下一步整改顺序

第一步是在 Cloudflare Pages 发布包含最新 Cookie Consent 和法律页面的项目版本。发布后重新运行 `pnpm run audit:production:adsense`，要求首页 Banner、Privacy、Cookie Policy 和 Terms 四项全部 PASS。

第二步由管理员确认运营者法定名称、隐私联系方式、Google ATP/广告技术供应商、CMP 或同意信号方案、AdSense client ID 和 slot ID；这些值不能安全代填，也不应通过聊天发送。

第三步保持广告总开关关闭，先完成真实生产 Network 矩阵测试。只有 unknown/denied 不产生广告或可选测量请求、granted 在配置齐全时才加载、withdrawn 后停止后续可选加载，才可以小范围启用一个广告位。

第四步在 Cloudflare Managed robots 内容完成审核后，再决定是否将 `FAIL_ON_ADSENSE_READINESS` 或相关 Lighthouse/robots 变量切换到严格模式。

## 参考资料

[1]: https://support.google.com/adsense/answer/48182?hl=en "Google AdSense Program policies"
[2]: https://support.google.com/adsense/answer/7670013?hl=en "Google EU user consent policy"
[3]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide "Google Search SEO Starter Guide"
