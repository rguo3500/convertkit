# ConvertKit Google ATP/CMP 与 Privacy & Messaging 配置审计

**审计日期：** 2026 年 8 月 17 日  
**审计范围：** Google AdSense ATP、Google Privacy & Messaging、Google Certified CMP、EEA/英国/瑞士同意信号，以及当前 ConvertKit 已部署实现。

## 一、结论

当前 ConvertKit 的自建 Cookie 横幅和广告门控**适合继续保持 AdSense 关闭状态**，但尚不足以证明可以直接面向 EEA、英国和瑞士用户开启 AdSense。代码已经实现明确选择、拒绝、偏好管理、撤回和广告脚本门控；然而，当前横幅没有向用户展示实际 Google ATP 清单，没有明确披露 Google/第三方广告数据用途和广告个性化，没有地区化的 Google Consent Mode 或 IAB TCF 信号，也没有 Google Certified CMP 的认证配置。

Google 官方资料要求，AdSense 面向 EEA、英国和瑞士用户投放时，发布商应采用 Google Certified CMP，并在同意流程中识别实际广告技术供应商、说明 Cookie/local storage 和广告个性化用途、传递有效同意信号，并让用户能够以不低于首次同意难度的方式撤回或修改选择。[1] [2] [3]

因此，当前建议是：**不要把现有自建横幅单独当作最终 CMP；先在 AdSense Privacy & messaging 中完成欧洲法规消息、ATP 和同意设置，再决定是否接管或改造现有横幅。**

## 二、Google 配置要求与当前状态

| 配置项目 | Google 官方要求 | ConvertKit 当前状态 | 结论 |
|---|---|---|---|
| Google ATP 选择 | 选择常用 ATP 集合或自定义 ATP 集合，并向用户披露实际供应商及隐私说明 | Cookie Policy 说明未来需要同步供应商，但当前没有真实 ATP 列表 | 未完成 |
| CMP 认证 | 面向 EEA、英国和瑞士的 AdSense 发布商应采用 Google Certified CMP，并满足相关 TCF 要求 | 当前是自建 `CookieConsentBanner`，未发现 Google Certified CMP/TCF 接入 | 未完成 |
| 欧洲法规消息 | Privacy & messaging 可创建、发布和测试欧洲法规同意消息 | 当前没有 Google Privacy & Messaging 消息配置证据 | 未确认 |
| 第一层广告披露 | 应明确广告个性化、Cookie/local storage、Google 和其他供应商的数据用途 | 当前首层只说“optional measurement and future advertising” | 需补充 |
| 用户积极同意 | 应提供明确的肯定动作 | 当前有 `Allow optional` | 代码通过，地区合规仍需 CMP 信号 |
| 拒绝与管理 | 用户应能拒绝或管理可选用途 | 当前有 `Reject optional` 和 `Manage choices` | 代码通过 |
| 撤回同意 | 撤回应与首次同意一样容易，且重新显示可调整选项 | 当前 `Privacy choices` 可重新打开，`withdrawOptional` 写入 denied | 代码基础通过，需与 Google CMP/TCF 记录同步 |
| Consent Mode / TCF | 需要把广告存储、个性化、用户数据等同意传给 Google；Privacy & Messaging 可启用相关 Consent Mode | 当前 AdSense 只读取本地 `granted/denied`，没有 `TCF v2.3` 或 `gtag consent` 信号 | 未完成 |
| 供应商隐私链接 | 每个实际供应商应有可访问的隐私说明链接 | 当前只有通用 Cookie Policy/Privacy Policy 链接 | 未完成 |
| 个性化/非个性化广告 | 需在后台和用户披露中明确选择，并根据同意结果传递正确信号 | 当前页面只说未来可能个性化，没有实际广告模式配置 | 未完成 |
| 测试与审计 | 应使用 Google 消息测试参数和真实地区测试 | 当前仅验证自建 Banner 与广告脚本门控 | 需补充 |

## 三、当前代码已经完成的部分

`CookieConsentContext` 使用 `unknown`、`granted` 和 `denied` 三种状态，首次访问默认为 `unknown`，用户可以拒绝或允许可选技术，且 `Privacy choices` 入口可以重新打开偏好设置。`AdSenseSlot` 同时要求广告总开关、同意准备开关、用户 `granted`、client ID 和 slot ID 均存在；否则组件返回 `null`，动态广告脚本也会被移除。`OptionalAnalytics` 使用相同的 `granted` 门控。

这意味着当前实现具备**安全默认值和脚本隔离**，可以避免在 AdSense 尚未完成后台配置时意外发出广告请求。但这些本地状态并不自动等同于 Google 认可的 Consent Mode 或 IAB TCF 信号，也不能替代 Google Certified CMP 的供应商披露和地区化同意流程。

## 四、AdSense 后台应完成的配置步骤

### 1. 进入 Privacy & messaging

登录拥有 AdSense 账户权限的账号，在 AdSense 左侧进入 **Privacy & messaging**。确认网站 `lovexiaoyue.cc.cd` 已添加并处于可管理状态，然后打开 **European regulations** 或对应的欧洲法规消息配置。[1]

### 2. 选择 CMP 路线

对于当前“全球投放、包含 EEA/英国/瑞士、未来允许个性化广告”的目标，建议优先选择 **Google Privacy & messaging** 或 Google 官方支持的 Certified CMP 路线，而不是直接把现有自建横幅当作最终方案。Google 官方资料说明，Privacy & messaging 可以创建欧洲法规消息，消息支持用户同意、拒绝和管理选项，并可支持 IAB TCF v2.3。[2]

如果继续使用第三方 CMP，应先确认它在 Google Certified CMP 列表中，并确认其支持 IAB TCF v2.3、Additional Consent、Google ATP 和撤回流程。不要只根据“支持 GDPR”或“有 Cookie Banner”判断认证资格。

### 3. 选择 ATP

在欧洲法规设置中选择两种路线之一：使用 Google 提供的常用 ATP 集合，或建立自定义 ATP 集合。若选择自定义集合，应仅保留实际业务需要的供应商，并记录每个供应商的名称、用途、处理数据类别、隐私说明链接和适用目的。

随后将同一份实际供应商清单同步到网站 Cookie Policy、Privacy Policy 和 CMP 的供应商界面。不能在网站披露“Google 和其他供应商”这种笼统表述后，却在 AdSense 后台启用一组未披露的供应商。

### 4. 配置用户选择

欧洲法规消息至少需要让用户明确选择是否同意广告个性化和相关数据用途，并提供管理选项。建议启用三按钮路径：**Do not consent、Consent、Manage options**。用户撤回时应重新看到可调整的同意选项，而不是只显示一个“关闭”按钮。

第一层文案应明确说明：广告可能使用 Cookie/local storage；Google 和已选供应商可能收集、分享和使用数据；同意可能用于广告个性化和广告测量；用户可以拒绝并以后撤回。Google 还要求向用户提供 Google Business Data Responsibility 相关说明或链接。[3]

### 5. 配置 Consent Mode 或 TCF 信号

如果使用 Google Privacy & Messaging，应按照后台提供的 Consent Mode 选项配置广告存储、分析存储、个性化存储和用户数据相关信号，并设置 EEA/英国/瑞士之外地区的默认同意状态。Google 说明，Google CMP 只会更新展示欧洲法规消息用户的选择，因此非目标地区的默认状态也必须按实际法律和业务方案配置。[2]

如果使用 IAB Certified CMP，应确认页面生成有效的 TCF v2.3 字符串，并正确传递 Google Additional Consent；不能只在 localStorage 写入 `granted`。当前 ConvertKit 代码没有读取 TCF 字符串或调用 Consent Mode，因此启用 CMP 后需要按所选方案接入，而不是同时运行两套互相独立的同意状态。

### 6. 配置个性化和非个性化广告

在真实广告启用前，应确定采用以下哪一种模式：只有取得相关同意后展示个性化广告；未取得个性化同意时展示符合当地要求的非个性化/受限广告；或在特定地区暂不投放。后台选择、用户第一层文案、Cookie Policy、AdSense 标签参数和 Network 请求必须一致。

不要把 `VITE_ADSENSE_CONSENT_READY=true` 当作 Google 同意配置完成的证明。该变量只能表示站点管理员确认外部同意方案已就绪，不能自动生成 ATP、TCF 或 Consent Mode 信号。

## 五、ConvertKit 需要补充的代码或内容

在实际接入 Google Privacy & Messaging 或 Certified CMP 后，网站需要把真实供应商名称和链接写入 Cookie Policy/Privacy Policy，并将现有自建横幅改为单一来源的同意状态。最重要的原则是**不要同时让自建横幅和 Google CMP 各自显示一套独立的“允许/拒绝”状态**，否则用户选择可能无法可靠传给广告标签。

现有 Privacy Policy 还需要在广告启用前替换“未来会识别供应商”的条件式表述，加入实际 Google 产品、实际 ATP 列表、广告个性化/非个性化模式、保留期限和撤回路径。Cookie Policy 也要列出真实供应商及其隐私链接。以上内容依赖后台最终选择，不能提前伪造。

## 六、最终验收矩阵

| 验收场景 | 预期结果 |
|---|---|
| EEA/英国/瑞士新访客 | 显示 Google Certified CMP/Privacy & Messaging 欧洲法规消息，并明确展示供应商、广告个性化和 Cookie 说明。 |
| 选择拒绝 | 不发送不应在拒绝后发送的广告个性化/测量请求；广告标签遵循实际地区策略。 |
| 选择允许 | 只向已披露和已选 ATP 发送允许范围内的信号；广告脚本和标签使用正确 consent state。 |
| 打开 Manage options | 可分别理解并调整广告个性化、测量和必要技术用途。 |
| 撤回同意 | 从 Privacy choices 可再次打开同意界面，状态同步到 CMP/TCF/Consent Mode。 |
| 非 EEA/英国/瑞士用户 | 使用明确配置的默认状态，不因 Google CMP 只更新欧洲消息用户而产生意外信号。 |
| 生产法律页面 | Privacy、Cookie Policy、Terms、Contact 与 CMP 显示的供应商和撤回方式一致。 |
| AdSense 开关关闭 | 即使 CMP 配置存在，`VITE_ADSENSE_ENABLED` 为非 true 时不加载广告脚本。 |

## 七、当前建议

**当前不要开启 AdSense。** 首先在 AdSense 后台完成 Privacy & messaging/CMP、欧洲法规消息、ATP 和个性化广告策略；其次根据实际选择更新网站供应商披露；最后在真实 EEA/英国/瑞士环境或地区模拟环境测试拒绝、允许、管理和撤回四种流程。完成这些步骤后，才能把 `VITE_ADSENSE_CONSENT_READY` 设为 `true`，并在确认真实 client/slot ID 后再单独启用一个广告位。

## References

[1]: https://support.google.com/adsense/answer/10924669?hl=en "About Privacy & messaging - Google AdSense Help"

[2]: https://support.google.com/adsense/answer/10961068?hl=en "About European regulations messages - Google AdSense Help"

[3]: https://support.google.com/adsense/answer/7670013?hl=en "EU user consent policy - Google AdSense Help"

[4]: https://www.google.com/about/company/user-consent-policy-help/ "Help with the EU user consent policy - Google"
