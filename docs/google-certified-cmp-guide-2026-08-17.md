# Google Certified CMP 获取与配置指南

**适用于：** ConvertKit / `lovexiaoyue.cc.cd`   
**目标：** 在未来面向 EEA、英国和瑞士用户投放 Google AdSense 前，完成合规的同意管理方案。

## 先明确一个关键事实

Google Certified CMP 不是站长在 AdSense 中点击一个开关就能获得的徽章。Google 认证的是 CMP 产品及其 TCF 集成。站长需要选择一个已列入 Google 官方认证名单的 CMP，或使用 AdSense/Ad Manager/AdMob 的 Google Privacy & Messaging 欧洲法规消息；如果站长拥有自己的 CMP，则可以向 Google 注册认证意向并接受评估，但这是一条供应商级认证路线，不是简单的网站设置。[1]

Google 当前规则要求：使用发布商产品向 EEA 和英国用户投放个性化广告，自 2024 年 1 月 16 日起需要使用与 IAB TCF 集成的 Google Certified CMP；瑞士自 2024 年 7 月 31 日起适用同类要求。[1] Google 也明确表示，认证 CMP 只代表其通过了 Google 针对 TCF 的认证检查，并不代表 Google 替站长完成全部隐私法合规审查。[1]

## 三条可行路线

| 路线 | 是否需要你自己申请 Google 认证 | 适合 ConvertKit 的程度 | 主要工作 |
|---|---:|---:|---|
| Google Privacy & Messaging 欧洲法规消息 | 不需要单独申请 CMP 认证；Google 的欧洲法规消息已按 Google 方案认证 | **最高**，适合当前 AdSense 尚未启用的网站 | 在 AdSense 中创建网站、配置欧洲法规消息、选择 ATP、发布消息并接入 Google 代码 |
| 第三方 Google Certified CMP | 不需要你申请认证，但必须从 Google 官方名单确认供应商和版本 | 高，若需要更完整的供应商管理、TCF 和多站点控制 | 购买/开通 CMP，添加域名，配置 ATP、目的、语言和撤回入口，接入脚本 |
| ConvertKit 自建 CMP 申请 Google 认证 | 需要向 Google 注册认证意向并通过供应商级评估 | 低，不建议作为短期上线方案 | 实现 IAB TCF、CMP API、TCF v2.3、Additional Consent、审计和长期维护，再申请评估 |

## 推荐路线：Google Privacy & Messaging

### 第一步：准备 AdSense 账户和网站

使用具有 AdSense 管理权限的账号登录 AdSense，确认网站 `lovexiaoyue.cc.cd` 已添加并完成 Google 的站点审核流程。进入左侧 **Privacy & messaging**，找到 **European regulations** 消息类型。Google 官方说明，Privacy & messaging 可以创建、发布和测试用户消息；欧洲法规消息用于收集 GDPR/ePrivacy 相关同意，并支持 TCF 集成。[2]

### 第二步：创建欧洲法规消息

新建消息时选择网站 `lovexiaoyue.cc.cd`，配置适用地区为 EEA、英国和瑞士，并选择消息语言。由于 ConvertKit 目前页面主要是英文，建议至少配置英文；如果面向中文用户，还应提供中文版本或确认 Google 的语言选择机制能够提供清晰可理解的当地语言说明。

建议启用三按钮流程：**Do not consent、Consent、Manage options**。Google 官方资料指出，撤回后重新显示的欧洲法规消息应允许用户再次拒绝、同意或管理选项。[2]

### 第三步：选择实际 ATP

在 European regulations 设置中选择 Google 的常用 ATP 集合，或建立自定义集合。不要为了“提高收入”无差别勾选所有供应商。每个选中的 ATP 都必须与网站 Privacy Policy、Cookie Policy 和 CMP 展示的供应商清单同步，并提供其隐私说明链接。[3]

如果选择的供应商没有注册在 IAB Global Vendor List，但在 Google ATP 列表中，则需要由支持该功能的 IAB 注册 CMP 生成 Additional Consent。Additional Consent 只能由符合要求的 IAB TCF 注册 CMP 生成，不能由 ConvertKit 自己拼接字符串；而且 Additional Consent 只是 TC string 的补充，不能代替 TC string。[3]

### 第四步：配置广告和同意模式

明确选择个性化广告、非个性化广告或受限广告的策略。第一层消息必须让用户知道 Cookie/local storage、广告测量、广告个性化、Google 和实际广告技术供应商的数据使用方式。Google 的 EU User Consent Policy 还要求提供 Google Business Data Responsibility 页面链接，并让撤回同意足够容易。[4]

如果使用 Google Privacy & Messaging 的 Consent Mode 选项，按照后台生成的官方安装说明设置 Google Consent Mode；不要用 ConvertKit 当前的 `localStorage` 状态伪造 TCF 或 Consent Mode。当前网站的 `granted/denied` 只负责安全地阻止或允许本站可选脚本，不能替代 Google 认证 CMP 的 TC string 或 Additional Consent。

### 第五步：发布并测试消息

先保存为草稿，在测试域名或 Google 提供的测试方式下验证消息。至少测试以下场景：新访客、点击拒绝、点击同意、打开管理选项、撤回后再次选择，以及 EEA、英国和瑞士地区访问。通过后再发布消息。

## ConvertKit 网站接入规则

当前 ConvertKit 已有一套自建 `CookieConsentBanner`，它提供基本的允许、拒绝、管理和撤回界面，并已加入 Google 数据责任说明链接。这套组件现在应被视为**集成就绪的安全默认层**，不能在生产环境中宣称自己是 Google Certified CMP。

当你启用 Google Privacy & Messaging 或第三方 Certified CMP 后，应避免同时显示两套互相独立的 CMP 弹窗。推荐的接入方式是：让 Google CMP 成为唯一用户同意来源；将现有自建横幅改为由 CMP 官方状态驱动的外壳，或在 CMP 接管后关闭自建第一层 Banner，只保留站点的 Privacy choices 入口。AdSense 广告脚本仍应同时满足以下条件：真实 `VITE_ADSENSE_CLIENT`、真实 slot ID、管理员确认的 `VITE_ADSENSE_CONSENT_READY=true`，以及 CMP 的有效允许信号。

## 如果选择第三方 Certified CMP

选择供应商时，在 Google 官方 [Certified CMP 列表](https://support.google.com/adsense/answer/13554116?hl=en) 中核对供应商名称、产品版本、发布商用途和 TCF 支持状态。不要只依据供应商官网的“GDPR compliant”或“Google partner”宣传。还要确认该产品支持 IAB TCF v2.3、Google Additional Consent v2、EEA/英国/瑞士地区规则、撤回链接、供应商隐私链接、自动语言选择和 Cloudflare Pages 的静态脚本接入。

开通后，通常需要在供应商控制台添加 `lovexiaoyue.cc.cd`，配置站点 ID，选择真实 ATP，发布英文/中文消息，复制 CMP 官方脚本到 `client/index.html` 或官方要求的首屏位置，并在生产域名上验证 TC string、AC string（如适用）和 Google 请求参数。不要手工修改 CMP 生成的脚本，也不要把测试站点 ID 放入生产环境。

## 如果坚持让 ConvertKit 自建 CMP 申请认证

Google 官方允许拥有自建 CMP 的发布商注册认证意向，但这意味着 ConvertKit 必须作为 CMP 产品满足 Google 的评估要求，而不只是增加一个漂亮的 Cookie 弹窗。至少需要准备 IAB TCF v2.3 合规实现、CMP JavaScript API、合法的 TC string、Google Additional Consent v2 支持、ATP 与供应商隐私链接管理、撤回流程、跨页面持久化、地区化消息、版本更新和审计证据。Google 官方还说明，认证评估不等于 Google 对全部隐私法合规作出保证。[1]

自建路线应从 Google 的 [CMP certification interest / own CMP 入口](https://support.google.com/adsense/answer/13554020) 注册意向，按 Google 返回的申请和技术材料完成评估。除非你准备长期维护 CMP 产品并承担 TCF 版本升级和法律审查，否则不建议用这条路线阻塞 ConvertKit 的 AdSense 上线。

## ConvertKit 的最终放行条件

| 条件 | 当前状态 |
|---|---|
| 生产法律页和 Contact 页 | 已通过线上复审 |
| 自建基础拒绝/允许/撤回 UI | 已完成，但不是 Certified CMP |
| Google Privacy & Messaging 欧洲法规消息 | 尚未由 AdSense 管理员创建并发布 |
| Google Certified CMP | 尚未选择第三方；如走 Google Privacy & Messaging，则采用 Google 认证消息路线 |
| ATP 清单 | 尚未在 AdSense 中选择并与法律页同步 |
| TCF v2.3 / Consent Mode | 尚未生成真实信号 |
| Additional Consent | 不应由 ConvertKit 手工生成；由合规 CMP 负责（如实际需要） |
| AdSense client/slot ID | 尚未配置 |
| 授权后 Network 验证 | 尚未完成 |

在上述外部项目完成前，继续保持 `VITE_ADSENSE_ENABLED` 为非 `true`。不要把 `VITE_ADSENSE_CONSENT_READY` 改为 `true` 来“模拟认证完成”，也不要把自建 `granted` 值当作 Google 的 TCF/Consent Mode 信号。

## References

[1]: https://support.google.com/adsense/answer/13554116?hl=en "Google-certified CMP requirements for publishers"

[2]: https://support.google.com/adsense/answer/10961068?hl=en "About European regulations messages"

[3]: https://support.google.com/admanager/answer/9681920?hl=en "Google Additional Consent technical specification"

[4]: https://www.google.com/about/company/user-consent-policy-help/ "Help with the EU user consent policy"

[5]: https://support.google.com/adsense/answer/13554020 "CMP certification information for publishers"
