# ConvertKit AdSense 上线准备逐条整改方案

**制定日期：** 2026-08-17  
**当前结论：** 本地接入准备基本完成；生产发布与 AdSense 外部配置仍为阻断项。

## 1. 整改矩阵

| 编号 | 整改项                 | 当前状态                          | 能否由本地代码完成         | 整改方案                                                                           | 验收标准                                                 |
| ---: | ---------------------- | --------------------------------- | -------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
|    1 | AdSense 默认关闭       | 已完成                            | 是                         | 保持 `VITE_ADSENSE_ENABLED` 默认非 true                                            | 未配置时无广告容器、无 Google 广告脚本                   |
|    2 | 用户明确同意           | 已完成                            | 是                         | 保留 Cookie Consent Banner，默认 unknown，支持 granted/denied                      | 首访显示 Banner；拒绝不加载可选脚本                      |
|    3 | 撤回授权               | 已完成                            | 是                         | 保留 Privacy choices，撤回后清理动态脚本                                           | granted → denied 后不再产生后续可选脚本                  |
|    4 | AdSense 广告位         | 已完成                            | 是                         | 首页与转换详情页使用 `AdSenseSlot`，未启用返回 null                                | 未启用时无空白占位、不遮挡转换控件                       |
|    5 | 隐私法律页面           | 本地已完成，生产未完成            | 代码可完成，发布需外部操作 | 发布最新 `LegalPages.tsx` 版本                                                     | 生产 `/privacy` 显示真实正文，不是 Placeholder           |
|    6 | Cookie Policy          | 本地已完成，生产未完成            | 代码可完成，发布需外部操作 | 发布最新 Cookie Policy                                                             | 生产 `/cookie-policy` 显示 Cookie 分类、广告和撤回说明   |
|    7 | Terms of Use           | 本地已完成，生产未完成            | 代码可完成，发布需外部操作 | 发布最新 Terms                                                                     | 生产 `/terms` 显示真实条款和运营者信息                   |
|    8 | 运营者信息             | 未完成                            | 不能安全代填               | 由站点所有者提供法定名称、联系地址和隐私邮箱                                       | 法律页面不再使用占位运营者信息                           |
|    9 | Google ATP/供应商清单  | 未完成                            | 不能代替管理员选择         | 在 AdSense 后台确定实际广告技术供应商并同步隐私披露                                | 同意界面、Cookie Policy、AdSense 设置三者一致            |
|   10 | CMP/同意信号           | 自建 UI 已完成，Google 信号未确认 | 需外部平台配置与政策确认   | 选择 Google CMP、合规第三方 CMP，或由专业人士确认自建方案；配置 EEA/UK/CH 同意信号 | 目标地区用户可拒绝、允许、撤回，广告请求符合所选方案     |
|   11 | AdSense client ID      | 未配置/无法确认                   | 不能代填                   | 管理员从 AdSense 后台取得真实 `ca-pub-...` ID                                      | 生产构建使用真实值，不含占位值                           |
|   12 | Ad slot IDs            | 未配置/无法确认                   | 不能代填                   | 管理员创建首页和转换页 slot，并提供 ID                                             | 每个广告位对应真实 slot，页面不混用位置                  |
|   13 | GitHub Secret/Variable | API 403                           | 不能绕过权限               | 仓库管理员手动配置或修复 connector 权限                                            | `gh secret/variable list` 可由管理员确认名称，不能公开值 |
|   14 | Cloudflare 发布        | 生产仍为旧 Placeholder            | 不能在当前权限下代替发布   | 在 Cloudflare Pages 发布包含最新提交的版本                                         | 生产三页和首页资源哈希切换，Banner 可见                  |
|   15 | robots/sitemap         | 基础检查通过                      | 是/外部审核                | 保持生产 Sitemap、Allow root、Disallow admin；审核 Cloudflare Managed content      | HTTP 200，正确 content-type，Sitemap 主机一致            |
|   16 | 生产 Network 验证      | 尚未完成                          | 发布后可完成               | 用 unknown/denied/granted/withdrawn 四种状态检查请求                               | 状态矩阵与广告脚本请求符合预期                           |
|   17 | 流量与广告行为         | 需持续运营                        | 不能自动保证               | 禁止自点、诱导点击、购买低质量流量和误导性广告位                                   | 持续监控 AdSense Policy Center 与流量质量                |

## 2. 本轮可立即完成的整改

代码层面已经完成安全默认值、同意横幅、偏好管理、撤回清理和无空白广告位。下一步代码侧应增加生产法律页面冒烟检查，避免 Cloudflare 发布旧版本时不被发现；该检查只验证页面内容和脚本门控，不会输出任何 Secret。

## 3. 当前不能安全代办的事项

运营者法定名称、隐私联系方式、AdSense client ID、真实 slot ID、Google ATP 供应商选择、CMP 账户配置和 GitHub/Cloudflare 管理权限都不能由系统安全代填。它们涉及账户所有权、法律责任、收款主体或第三方平台设置。正确做法是由站点所有者或管理员完成，并将结果用于最终验收，而不是把凭据发送到聊天中。

## 4. 分阶段发布方案

**阶段 A：法律页面发布。** 发布当前最新代码，但保持 `VITE_ADSENSE_ENABLED` 和 `VITE_ADSENSE_CONSENT_READY` 为关闭状态。验收生产 Privacy、Cookie Policy、Terms 和首页 Banner。

**阶段 B：同意方案确认。** 由管理员确定目标地区、Google ATP 集合和 CMP/同意信号策略，补充运营者信息和供应商链接。此阶段仍保持广告总开关关闭。

**阶段 C：配置广告身份。** 仅在 AdSense 后台账号和站点审核可用后配置真实 client/slot ID，先在预览或小范围发布中验证；不得使用测试占位值冒充生产配置。

**阶段 D：受控启用。** 先只启用一个广告位，完成 unknown/denied/granted/withdrawn 的浏览器和 Network 验收，观察布局、CLS、转换器核心操作和 Policy Center 状态，再决定是否扩大范围。

## 5. 最终放行门槛

只有满足以下条件，才可将 `VITE_ADSENSE_ENABLED` 和 `VITE_ADSENSE_CONSENT_READY` 设为 true：生产三页不是 Placeholder；运营者身份和联系方式已确认；目标地区同意机制与 Google ATP 供应商已配置；真实 client/slot ID 已核验；拒绝和撤回不会加载或继续产生可选广告请求；robots/sitemap 基础检查通过；并且 Cloudflare 发布后的真实生产 Network 检查通过。

## 参考资料

[1]: https://support.google.com/adsense/answer/48182?hl=en "Google AdSense Program policies"
[2]: https://support.google.com/adsense/answer/7670013?hl=en "Google EU user consent policy"
[3]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide "Google Search SEO Starter Guide"

## 6. 本轮执行记录

本轮新增 `scripts/check-production-adsense-readiness.mjs` 和 `audit:production:adsense` 命令，并接入 `.github/workflows/quality.yml`。检查默认是 report-only；只有管理员设置 `FAIL_ON_ADSENSE_READINESS=true` 后才会阻断 CI，避免在 Cloudflare 仍未发布最新法律页面时误把既有质量流水线变红。

同一套检查在本地预览中通过了 Cookie Banner、未授权无可选请求、Privacy、Cookie Policy 和 Terms 五项核心检查。对生产域名运行时准确报告四项需要复核：首访 Banner 不存在，三份法律页面仍是 Placeholder；robots.txt 和 sitemap.xml 的 HTTP 基础检查仍通过。该差异证明当前主要问题是生产发布版本，而不是本地代码门控。
