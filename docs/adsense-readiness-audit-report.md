# ConvertKit Google AdSense 上线准备复审

**复审日期：** 2026-08-17  
**生产域名：** https://lovexiaoyue.cc.cd  
**结论：** **暂缓启用；本地代码已具备安全门控，但生产发布和外部配置尚未完成。**

> 本报告是技术与政策准备工作的工作性评估，不构成法律意见，也不保证 Google AdSense 审核通过。Google 要求发布商遵守其 Publisher Policies，并可能随时更新政策；最终以 AdSense 后台和 Google 官方政策为准。[1]

## 一、结论摘要

ConvertKit 的**本地最新代码**已经具备相对完整的 AdSense 接入基础：广告组件默认关闭，只有在站点开关、同意配置、client ID、slot ID 和用户 `granted` 状态全部满足时才渲染并加载广告脚本；Cookie Consent Banner 支持允许、拒绝、偏好管理和撤回；可选分析脚本也已改为同意后加载。

但是，**当前生产站点仍不是可申请/启用 AdSense 的状态**。对 `https://lovexiaoyue.cc.cd/privacy`、`/cookie-policy` 和 `/terms` 的生产浏览器检查显示，三页仍是旧的 Placeholder 页面。线上没有最新真实法律正文，也没有 Cookie Consent Banner 或 Privacy choices 入口。生产版本必须先切换到包含法律页面和同意管理的最新提交。

## 二、审核结果总表

| 检查项 | 本地最新代码 | 当前生产环境 | 结论 |
|---|---|---|---|
| AdSense 默认开关 | `VITE_ADSENSE_ENABLED` 不为 `true` 时直接关闭 | 未能确认运行时变量 | **阻断：需在有权限的环境中确认** |
| 用户广告同意 | `CookieConsentProvider` 使用 `unknown/granted/denied`，默认 unknown | 生产未显示 Banner | **阻断：尚未部署** |
| AdSense 加载条件 | 需要 consent granted、配置就绪、client ID 和 slot ID | 生产尚未证明 | **本地通过，线上待验证** |
| 拒绝/撤回 | 拒绝和撤回会清理动态分析/广告脚本 | 生产未部署 | **本地通过，线上待验证** |
| Privacy Policy | 有真实页面，含广告 Cookie、Google、供应商和同意说明 | 生产仍为 Placeholder | **阻断** |
| Cookie Policy | 有真实页面和技术分类说明 | 生产仍为 Placeholder | **阻断** |
| Terms of Use | 有真实页面 | 生产仍为 Placeholder | **高风险** |
| Google ATP/供应商列表 | 代码没有虚构供应商，但生产接入前尚未确定 | 未确认 | **阻断** |
| Google CMP/同意信号 | 自建同意 UI 已实现；尚未接入 Google CMP/IAB TCF 信号 | 未确认 | **高风险，需按目标地区和 AdSense 配置确认** |
| robots.txt | 生产 HTTP 200，含 Sitemap 和 `/admin` Disallow | Cloudflare Managed 内容仍需审核 | **通过基础检查，外部待审阅** |
| sitemap.xml | 生产 HTTP 200，`application/xml` | 基础可访问 | **通过基础检查** |
| 广告位位置 | 首页和转换详情页，未启用时无空白容器 | 生产尚未切换 | **本地通过，线上待验证** |
| CI | quality、E2E、weekly health 最近均成功 | 但运行提交早于本地最新 Cookie Consent 提交 | **不能替代生产发布验证** |
| GitHub Secret/Variable | 本地无法读取生产值 | API 返回 403 | **阻断：需管理员确认** |

## 三、已完成且可保留的本地准备

本地 `AdSenseSlot` 已采取“默认不加载”的安全策略。它要求 `VITE_ADSENSE_ENABLED=true`、`VITE_ADSENSE_CONSENT_READY=true`、有效的 `VITE_ADSENSE_CLIENT`、页面 slot ID 以及用户的 `choice === "granted"`。任意条件缺失时组件返回 `null`，不会生成空白广告容器，也不会请求 `pagead2.googlesyndication.com`。

Cookie 同意状态保存在 `convertkit_cookie_consent_v1`。首次访问为 `unknown`，横幅提供 Allow optional、Reject optional 和 Manage choices。用户之后可以通过 Privacy choices 入口重新打开偏好并撤回。浏览器实测显示：拒绝状态不加载可选脚本；允许状态加载当前已配置的 Umami 分析脚本；撤回后状态回到 denied，并清理动态分析脚本。AdSense 当前配置关闭，因此本地允许流程仍不会加载 Google 广告脚本，这是预期行为。

## 四、当前生产阻断项

### 1. Cloudflare 生产版本落后于本地整改版本

生产 `/privacy` 显示：`Privacy first` 和 `This section is structured and ready for the next expansion of the ConvertKit toolkit.`。生产 `/cookie-policy` 和 `/terms` 也显示相同类型的占位内容。这意味着用户看不到 Google AdSense、广告 Cookie、供应商、用户权利和同意撤回说明，Cookie Consent Banner 也没有上线。

在 Cloudflare Pages 成功发布包含本地最新代码的提交前，**不应在生产环境配置或启用 AdSense**。发布后必须重新检查三页正文、首页 Banner、Privacy choices、Cookie 文案和 Network 请求。

### 2. GitHub Secret/Variable 无法由当前权限确认

对 `rguo3500/convertkit` 的 Actions Secret 和 Variable 查询均返回 HTTP 403：`Resource not accessible by integration`。因此无法确认以下变量是否已配置、值是否正确或是否被 Cloudflare 部署环境注入：

| 变量 | 用途 | 启用前要求 |
|---|---|---|
| `VITE_ADSENSE_ENABLED` | 总开关 | 生产初次发布应保持 `false` 或不设置 |
| `VITE_ADSENSE_CONSENT_READY` | 同意方案已上线 | 只有生产 CMP/同意流程验证后才能设为 `true` |
| `VITE_ADSENSE_CLIENT` | `ca-pub-...` client ID | 必须来自实际 AdSense 账户，不能使用占位值 |
| `VITE_ADSENSE_HOME_SLOT` | 首页广告位 ID | 必须是 AdSense 后台真实 slot ID |
| `VITE_ADSENSE_CONVERTER_SLOT` | 转换详情页 slot ID | 必须是 AdSense 后台真实 slot ID |
| `VITE_ANALYTICS_ENDPOINT` / `VITE_ANALYTICS_WEBSITE_ID` | 可选测量 | 必须与隐私政策和同意策略保持一致 |

### 3. 供应商和 Google CMP 配置仍未落地

Google 的 EU user consent policy 要求针对 EEA、英国和瑞士用户披露相关广告技术供应商，并在法律要求时取得 Cookie/local storage 和个性化广告处理的同意。[2] 当前自建横幅已经有明确的“允许/拒绝”概念，但还没有实际的 Google ATP 选择清单、供应商隐私链接、Google CMP 或 IAB TCF 信号配置。

如果 ConvertKit 面向这些地区展示广告，启用前应在 AdSense 后台确定 ATP 集合，并让生产同意流程显示同一份供应商信息。不能只依赖“用户点击 Allow optional”而不传递 Google 所需的同意信号或完成供应商披露。

## 五、生产启用顺序

| 顺序 | 必须完成的动作 | 验收标准 |
|---:|---|---|
| 1 | 发布包含最新法律页面和 Cookie Banner 的代码 | 生产三页不再显示 Placeholder；首页出现 Banner |
| 2 | 确认运营者法定名称、隐私联系方式和适用地区策略 | Privacy Policy 不再保留待补充性质的运营者说明 |
| 3 | 在 AdSense 后台选择实际广告技术供应商 | 供应商清单与 Privacy/Cookie 页面和 CMP 一致 |
| 4 | 配置 Google CMP 或审核自建同意方案 | EEA/UK/CH 用户可拒绝、允许、再次打开和撤回；同意信号可被广告配置使用 |
| 5 | 设置真实 client ID 和 slot ID，但先保持总开关关闭 | 构建产物中的变量不含占位值；生产无广告请求 |
| 6 | 做隐私状态矩阵测试 | unknown/denied：无广告和可选分析请求；granted：仅在配置就绪时有请求；withdrawn：停止后续可选加载 |
| 7 | 先在少量页面启用并观察 | 不遮挡输入、结果、复制/下载按钮；无诱导点击、误触和明显 CLS |
| 8 | 观察政策和流量质量 | 不自点广告、不购买低质量流量、不诱导点击，不使用弹窗或误导性广告位置。[1] |

## 最终判断

当前状态应标记为：**本地接入准备：通过；生产 AdSense 启用：不通过；生产发布前置：阻断。**

最先要做的不是把 `VITE_ADSENSE_ENABLED` 改成 `true`，而是先让 Cloudflare 生产版本切换到包含法律页面和 Cookie Consent Banner 的最新代码。完成发布后，再由拥有 GitHub/Cloudflare/AdSense 管理权限的人员确认 Secret、Variable、AdSense client/slot、ATP 供应商和 CMP 配置。只有这些步骤完成并通过真实生产 Network 检查后，才适合小范围开启广告。

## 参考资料

[1]: https://support.google.com/adsense/answer/48182?hl=en "Google AdSense Program policies"
[2]: https://support.google.com/adsense/answer/7670013?hl=en "Google EU user consent policy"
[3]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide "Google Search SEO Starter Guide"
