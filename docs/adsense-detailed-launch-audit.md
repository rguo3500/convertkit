# ConvertKit Google AdSense 上线详细审计报告

**审计日期：** 2026-08-17  
**审计域名：** https://lovexiaoyue.cc.cd  
**审计范围：** 生产部署、AdSense 代码门控、Cookie 同意、法律页面、广告位布局、SEO、CI/CD、Cloudflare 发布链路和 Google 政策要求。

> **结论先行：当前不建议打开 AdSense 广告总开关。** 本地技术链路已经具备安全的默认关闭和用户授权门控，且用户已确认提交 `1941a92` 的 quality workflow 成功；但生产传输稳定性、Google 外部配置不可确认、CMP/同意信号方案未完成确认，因此尚未达到“可放行上线”的证据标准。

## 一、总体判定

| 审计域                   | 当前结果                                                                                | 判定                                       |
| ------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------ |
| AdSense 默认关闭         | `VITE_ADSENSE_ENABLED` 未经生产确认时不渲染广告位、不加载脚本                           | 通过                                       |
| 用户同意门控             | `choice=granted`、站点 consent-ready、client ID 和 slot ID 同时满足才加载               | 本地通过，生产配置待确认                   |
| 拒绝与撤回               | `denied` 持久化；撤回后清理动态分析/广告脚本                                            | 本地通过                                   |
| Cookie Consent UI        | 生产浏览器可见，支持 Reject、Manage、Allow                                              | 通过；仍需稳定性复测                       |
| Privacy/Cookie/Terms     | 生产浏览器可见真实页面与法律链接                                                        | 内容已部署；运营者信息和供应商清单仍需核实 |
| 未授权第三方请求         | 生产浏览器交叉检查未见 AdSense 或可选分析请求；报告脚本检测为 none                      | 通过，但需以稳定生产审计为准               |
| robots.txt/sitemap.xml   | HTTP 200、Sitemap 指向生产域名、XML 可访问                                              | 通过                                       |
| 广告位位置               | 首页与转换详情页均避开输入、结果和复制按钮；未启用时无空白区域                          | 本地通过                                   |
| CI/CD                    | 用户确认提交 `1941a92` 的 quality workflow 成功；Cross-browser E2E 成功                 | 通过                                       |
| GitHub Secrets/Variables | API 查询持续 HTTP 403，无法确认 AdSense 外部配置                                        | **阻断**                                   |
| CMP/Google 同意信号      | 当前是自建同意 UI，未确认 Google certified CMP、IAB TCF 或 Privacy & Messaging 生产配置 | **阻断个性化广告**                         |
| Cloudflare/生产传输      | 浏览器可渲染；curl/Playwright 多次出现响应连接不及时结束或导航超时                      | **需修复/复测**                            |

## 二、已通过的本地技术检查

`AdSenseSlot` 只有在以下条件同时满足时才会输出 `<ins class="adsbygoogle">` 并动态加载 Google 脚本：站点广告开关为 true、同意准备开关为 true、用户状态为 `granted`、client ID 非空且 slot ID 非空。组件在未满足条件时返回 `null`，因此不会留下空白广告容器，也不会在正式启用前加载 `pagead2.googlesyndication.com`。

Cookie Consent 状态默认是 `unknown`，用户可以选择允许、拒绝或重新打开偏好并撤回。拒绝或撤回会保存 `denied`，并移除已动态注入的可选分析和广告脚本。视觉和 E2E 复核还确认横幅的固定布局不会再通过大面积空白 flex 容器拦截 bulk converter 的键盘快捷键。

本地验证结果为：30 个 Vitest 通过；Playwright E2E 为 11 passed、21 skipped；TypeScript、Prettier 和生产构建通过。广告位挂载在首页 Hero 后、热门工具前，以及转换详情页工具区与 FAQ 之间，不靠近输入、结果、复制、下载或导航控件。

## 三、生产环境证据

生产浏览器直接打开首页可以看到真实 ConvertKit 页面、Cookie Consent Banner、Privacy Policy/Cookie Policy 链接以及 Reject optional、Manage choices、Allow optional 三个按钮。首页未显示 AdSense 广告位，也没有可见的广告脚本标记，符合当前默认关闭策略。

生产 `/robots.txt` 返回 HTTP 200 和 `text/plain`，包含生产 Sitemap；`/sitemap.xml` 返回 HTTP 200 和 `application/xml`，并使用生产主机名。该部分可以继续保持放行。

需要注意的是，curl 对首页和 Privacy 页面虽然返回 HTTP 200 与完整 HTML，但连接在 20 秒内未正常结束；Playwright 的页面导航也曾出现 30–45 秒 timeout，使用 `commit` 后虽然能拿到响应，但页面正文有时尚未及时水合。Cookie Policy 与 Terms 的响应约 4–6 秒完成。这说明 Cloudflare/生产响应链仍存在稳定性问题，不能仅以一次浏览器成功渲染认定生产审计稳定通过。

本次还修复了生产审计脚本的准确性问题：原脚本在页面导航后才监听可选请求，可能漏掉首屏请求；同时使用 `networkidle` 容易把持续连接误判为页面失败。现已改为在导航前监听请求，并使用可控等待，但生产连接超时本身仍应保留为审计风险，而不是被脚本隐藏。

## 四、Google 政策对照

Google AdSense 政策禁止无效点击和人为增加展示，禁止诱导用户查看或点击广告，也禁止把广告放在可能被误认为导航、下载或核心功能控件的位置。[1] ConvertKit 当前的广告位设计没有把广告放在输入、结果或下载控件旁边，这是正确方向；上线后仍必须避免“点击广告支持网站”等文案和任何自点击、购买低质流量行为。

Google EU User Consent Policy 要求在 EEA、英国和瑞士地区，在法律要求时取得 Cookie/本地存储同意，并取得个性化广告所需个人数据收集、共享和使用的有效同意；同时要保留同意记录、提供撤回方式，并明确识别可能收集、接收或使用数据的各方。[2] 当前 UI 有允许、拒绝、偏好和撤回路径，但必须补齐运营者法定名称、真实联系地址/邮箱、Google 及其他广告技术供应商清单、数据用途、保留期限和跨境处理说明，并确认同意记录的保存方式满足目标地区要求。

Google 说明，向 EEA 和英国用户投放个性化广告需要使用与 IAB TCF 集成的 Google certified CMP；瑞士对应要求自 2024-07-31 起适用。[3] 当前自建 Cookie Consent Banner 不能自动等同于 certified CMP，也没有证据表明已经生成 TCF consent string、Additional Consent 信号或接入 AdSense Privacy & Messaging。因此，在 CMP 方案确认前，不应打开个性化广告。Google 的官方路径包括自建同意方案、Privacy & Messaging 或 IAB-certified CMP，但选择哪条路径必须和实际广告个性化策略、目标地区与供应商一致。[4]

## 五、阻断项与整改方案

| 优先级 | 阻断项                                        | 责任边界                              | 整改方案                                                                                                                                                                      | 验收标准                                                                             |
| ------ | --------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| P0     | 最近 `quality` workflow 在提交 `1941a92` 失败 | 可由项目/CI 修复                      | **已由用户确认成功；无需继续整改。** 保留后续每次发布后的 quality 复跑                                                                                                        | 最新 quality 与 E2E 均 success，Job Summary 无未解释失败                             |
| P0     | GitHub Secrets/Variables API 返回 403         | 需要仓库管理员权限，不能安全代办      | 管理员在仓库 Settings → Secrets and variables → Actions 中确认 `VITE_ADSENSE_ENABLED`、`VITE_ADSENSE_CONSENT_READY`、`VITE_ADSENSE_CLIENT` 和各 slot 配置；不要在聊天中发送值 | 通过 CI 的不泄密配置诊断确认“configured”，但日志不显示值                             |
| P0     | CMP/同意信号未确认                            | 需要站点运营者选择并配置              | 选择 Google Privacy & Messaging、Google-certified TCF CMP 或经法律审核的自建方案；若暂时没有 TCF/CMP，只考虑法律允许的非个性化/限制广告路径，并先由专业人士确认               | EEA/UK/瑞士测试用户能看到正确披露、选择、撤回；Google 要求的信号真实存在且请求中生效 |
| P0     | 生产法律披露的运营者和供应商事实未核实        | 需要用户/运营者提供真实信息及法律审核 | 补充法定运营者名称、地址/联系邮箱、Google 广告技术供应商、用途、保留期限、跨境传输、用户权利和撤回方式；不要使用占位或虚构信息                                                | 三个法律页与实际脚本/供应商完全一致，法律审核通过                                    |
| P1     | Cloudflare 响应连接偶发不结束                 | 需要 Cloudflare/部署管理员检查        | 检查 Pages 部署状态、Functions/Workers、缓存规则、HTML streaming、第三方脚本和错误日志；确认首页与 Privacy 在 10 秒内稳定返回并结束                                           | 连续 5 次 curl/浏览器检查均 HTTP 200、连接正常结束、正文完整；Playwright 不超时      |
| P1     | AdSense client ID/slot ID 未确认              | 需要 AdSense 账户管理员               | 在 AdSense 后台获得真实 publisher/client ID 和广告单元 slot ID；使用 Secrets/Variables 注入，不硬编码                                                                         | 同意前无 Google 请求；允许后出现合法 ad script 和对应 slot；拒绝后脚本被移除         |
| P1     | 同意记录和撤回证据不足                        | 需要产品/法律决定保存策略             | 明确只保存必要的同意状态、时间/版本和必要区域信息；在隐私政策中披露保存期限、用途和撤回方式                                                                                   | 能导出或审计同意版本，不记录不必要的个人数据                                         |

## 六、分阶段放行方案

**阶段 0：保持关闭。** 继续保持 `VITE_ADSENSE_ENABLED=false` 或未设置，不注入 Google 脚本。quality 已确认通过；仍需完成 Cloudflare 响应稳定性检查、法律事实确认和 CMP 选择。

**阶段 1：内部/管理员测试。** 使用测试域或受控环境注入真实 client/slot 配置，但不面向公开流量。验证 unknown、denied、granted、撤回四种状态，分别检查 DOM、请求、脚本清理和移动端布局。不得点击自己的广告，不得使用真实用户流量做实验性刷量。

**阶段 2：低风险公开放行。** 仅在法律审核和 CMP/同意信号确认后，先考虑非个性化或限制广告策略；维持广告位数量少、远离核心控件，并观察 Core Web Vitals、错误率、广告请求失败和同意撤回行为。若使用个性化广告，必须先满足 Google certified CMP/TCF 要求。

**阶段 3：正式运营。** 只有当 production smoke audit 全部 PASS、quality 与 E2E 最新运行成功、AdSense 后台站点审核通过、法律页与实际供应商一致、Cloudflare 连接稳定，并由管理员确认密钥和变量后，才可打开生产广告开关。上线后持续监控无效流量、广告覆盖布局、投诉、Core Web Vitals 和同意率，任何异常先关闭广告开关。

## 七、当前最终结论

当前可放行的部分是：本地广告组件默认关闭、用户同意门控、拒绝/撤回清理、无空白广告位、法律页路由、Cookie Banner、robots 和 sitemap 基础能力。当前不可放行的部分是：GitHub 权限 403 导致外部配置无法确认、CMP/Google 同意信号未确认、运营者与供应商事实未完成核验，以及生产响应偶发超时。quality workflow 和 Cross-browser E2E 已确认通过。

因此，**现阶段不要设置 `VITE_ADSENSE_ENABLED=true`，也不要设置 `VITE_ADSENSE_CONSENT_READY=true` 作为公开生产放行信号**。先完成 P0 项，随后用同一套生产 smoke audit 连续复测；所有法律判断和目标地区同意方案应由合格隐私/法律专业人士最终确认。

## References

[1]: https://support.google.com/adsense/answer/48182?hl=en "AdSense Program policies"
[2]: https://www.google.com/about/company/user-consent-policy/ "Google EU user consent policy"
[3]: https://support.google.com/adsense/answer/13554116?hl=en "Google certified CMP requirements"
[4]: https://support.google.com/adsense/answer/9031649?hl=en "Publisher EU user consent journeys"
