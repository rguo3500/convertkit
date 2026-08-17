# ConvertKit Google AdSense 复审报告

**审计日期：** 2026 年 8 月 17 日  
**审计目标：** 判断当前网站是否适合开启 Google AdSense，并区分源码已完成事项与生产环境仍需处理的事项。  
**审计对象：** `https://lovexiaoyue.cc.cd` 生产域名，以及当前 ConvertKit 本地代码版本。

## 一、执行摘要

本轮复审结论是：**技术广告门控和基础线上可访问性通过，但当前生产站点仍不建议开启 Google AdSense。** 生产首页的 Cookie 同意横幅、未授权状态无 Google/分析请求、robots.txt、sitemap.xml 和三份法律路由均已通过现有 readiness smoke test；但是，实际打开生产页面后发现 `/contact` 仍是旧的 Placeholder 页面，生产 Privacy Policy 和 Terms of Use 仍包含“上线前应补充/应审核运营者信息”的条件式文案，尚未完整反映最新的 `shenlan` 运营者资料。这些内容与当前本地代码不同，说明最新代码尚未完整发布到自定义域名。

因此，**当前状态应标记为“AdSense 技术准备通过，生产合规发布未通过，广告开关保持关闭”。** Google 官方要求发布商遵守广告实现、内容、隐私和用户同意政策；对 EEA、英国和瑞士用户，还需要实际识别广告技术供应商并获得相应同意信号。[1] [2]

## 二、审计结果矩阵

| 审计项目 | 生产线上结果 | 当前判断 | 说明 |
| --- | --- | --- | --- |
| 首页 Cookie Consent Banner | 通过 | PASS | 首次访问显示拒绝、管理和允许选项。 |
| 首次访问无可选 Google/分析请求 | 通过 | PASS | readiness smoke test 记录为 `none`。 |
| 未授权状态无广告占位 | 通过 | PASS | 页面正文和 DOM 文本没有 `adsbygoogle` 或 `googlesyndication` 标记。 |
| `/privacy` 路由可访问 | 通过基础检查，但内容需整改 | REVIEW | 路由和标题正确，但生产正文仍要求上线前补充运营者法定名称和监控隐私联系方式。 |
| `/cookie-policy` 路由可访问 | 通过基础检查，但供应商披露未完成 | REVIEW | 仍使用“配置后补充实际供应商”的条件式表述；广告启用前必须同步真实供应商清单。 |
| `/terms` 路由可访问 | 通过基础检查，但最终发布措辞未完成 | REVIEW | 条款仍写明应根据运营者法律资料和适用法域审核后再作为最终条款。 |
| `/contact` 页面 | 未通过 | BLOCKER | 生产页面仍显示 `Talk to the team` 和旧的 “structured and ready for the next expansion” Placeholder。 |
| 运营者身份 `shenlan` | 本地通过，生产未完整显示 | BLOCKER | 本地 LegalPages、ContactPage 和 FloatingContact 已使用 `shenlan`；生产 Privacy/Contact 未同步。 |
| AdSense client / slot ID | 未配置/无法确认 | BLOCKER | 不能使用占位值；须由站点所有者从 AdSense 后台取得真实值。 |
| Google ATP / CMP / Privacy & messaging | 未确认 | BLOCKER | 自建横幅不等于已完成 Google 同意信号和供应商配置。 |
| robots.txt / sitemap.xml | 通过 | PASS | 生产 HTTP 200，robots 声明生产 Sitemap，Sitemap 使用生产主机。 |
| 广告行为与流量质量 | 无法由源码保证 | OPERATIONS | 必须持续避免自点、诱导点击、购买低质量流量和误导性广告布局。 |

## 三、已通过的技术门控

当前 `AdSenseSlot` 只有在以下条件同时满足时才渲染：`VITE_ADSENSE_ENABLED=true`、`VITE_ADSENSE_CONSENT_READY=true`、用户选择为 `granted`、真实 client ID 存在，以及 slot ID 存在。未满足条件时组件返回 `null`，因此不会留下空白广告区域；脚本也不会提前加载。对应实现位于 `client/src/components/AdSenseSlot.tsx`。

Cookie 同意上下文使用 `unknown`、`granted` 和 `denied` 三种状态，首次访问默认为 `unknown`，拒绝和撤回会写入 `denied`。可选分析脚本同样只在 `granted` 后加载。现有生产 smoke test 已验证首次访问横幅和未授权无可选请求，源码检查也确认广告脚本使用动态加载而不是在 HTML 中预先注入。

这部分符合 Google 对广告实现的基本风险控制方向：广告不能误导用户、不能伪装成导航或下载控件，也不能通过自点或人为方式制造点击与展示。[1]

## 四、生产环境的关键阻断项

### 1. 最新法律和联系方式尚未完整部署

生产 `/contact` 仍为 Placeholder，而当前本地代码已经有真实 Contact 页面、隐私请求入口、支持邮件和 `shenlan` 运营者资料。生产 `/privacy` 也仍保留“在申请广告账户之前应添加运营者法定名称和受监控隐私联系方式”的条件式文案。生产 `/terms` 仍写明条款需要根据运营者法律资料和适用法域审核后再作为最终条款。

这不是测试脚本失败，而是**测试覆盖不足**：现有 `check-production-adsense-readiness.mjs` 检查了 Privacy、Cookie Policy 和 Terms 的标题标记，却没有验证 Contact 页面，也没有断言 `shenlan`、`rguo3500@gmail.com` 和通信地址必须出现在生产页面中。因此，现有 smoke test 的“all checks passed”不能单独作为法律页面已完整上线的证明。

### 2. 生产 Cookie/广告供应商披露仍未完成

生产 Cookie Policy 明确写着实际 provider list 取决于配置，并要求在 Google AdSense 启用后识别 Google 和选定的广告技术供应商。这种“未来更新”状态可以支持广告关闭期间的透明披露，但不能作为广告已启用后的最终供应商披露。

Google 官方要求在 EEA、英国和瑞士场景中披露相关供应商，并获得关于 Cookie/local storage、个人数据收集、分享、使用和个性化广告的必要同意。[3] Google 允许使用自建同意方案、Privacy & messaging 或 IAB 认证 CMP，但仍需结合实际广告技术供应商和信号配置完成闭环。[4]

### 3. AdSense 身份和真实广告位尚未配置

目前不能确认生产环境已经配置真实 `ca-pub-...` client ID 和真实 slot ID。正式开启前，必须由账户所有者在 Cloudflare Pages 环境变量中配置：

```text
VITE_ADSENSE_ENABLED=true
VITE_ADSENSE_CONSENT_READY=true
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_HOME_SLOT=XXXXXXXXXX
VITE_ADSENSE_CONVERTER_SLOT=XXXXXXXXXX
```

上述示例中的 client 和 slot 仅表示变量格式，不能直接使用。若尚未完成 AdSense 站点审核、ATP 选择和同意信号配置，应继续保持两个开关为 `false` 或不设置。

## 五、Google 政策对照

| 政策主题 | 当前网站表现 | 放行要求 |
| --- | --- | --- |
| 无效点击与展示 | 源码没有诱导点击文案；广告默认关闭 | 上线后不得自点、要求用户点击或人工制造展示。 |
| 误导性广告布局 | 当前广告位未启用，组件不占空白 | 启用后广告必须与导航、复制、下载、转换结果和输入控件保持清晰区分。 |
| 网站导航 | 首页、工具、法律和 Contact 链接可访问 | 保持页面无弹窗/重定向/下载干扰，广告不得阻断核心转换操作。 |
| 隐私与同意 | 自建 Cookie 横幅和撤回入口已存在 | 必须将实际 Google ATP、CMP/Privacy & messaging 和生产广告请求信号同步。 |
| 内容与身份透明 | 本地已加入 `shenlan`，生产仍旧 | 生产法律页和 Contact 页必须完整发布真实运营者资料。 |

## 六、上线前必须完成的顺序

第一，先在 Cloudflare Pages 发布当前包含 `LegalPages.tsx`、`ContactPage.tsx` 和 `FloatingContact.tsx` 的最新 checkpoint，并确认自定义域名不再显示旧 Placeholder。发布后需逐页检查 `/contact`、`/privacy`、`/cookie-policy` 和 `/terms`，确认 `shenlan`、隐私邮箱和通信地址与实际运营者资料一致。

第二，在 AdSense 后台完成站点审核、广告技术供应商/ATP 选择和目标地区同意方案。若使用 Google Privacy & messaging 或 IAB 认证 CMP，应按其正式流程接入；若继续使用自建 UI，应由站点所有者或专业顾问确认 Google 同意信号和供应商披露满足目标地区要求。

第三，只配置真实 client/slot ID，并先启用一个广告位。使用全新浏览器上下文验证 `unknown`、`denied`、`granted` 和撤回后的 Network 请求、DOM、布局和转换器操作；确认拒绝或撤回后不再加载广告和可选分析脚本。

第四，观察广告位不会造成误导性布局、遮挡输入/结果/复制/下载控件或明显的布局跳动，并持续检查 AdSense Policy Center、Search Console、Cloudflare 日志和异常流量。

## 七、最终结论

**当前复审等级：暂缓开启 AdSense。** 技术门控可以保留，广告默认关闭是正确状态；生产 robots/sitemap 和基础 Cookie 流程通过，但生产 Contact 和运营者信息同步不足，且 Google ATP/CMP/真实广告身份尚未完成确认。完成最新版本发布、法律页面实测和 Google 同意配置后，才具备进入受控启用阶段的条件。

## References

[1]: https://support.google.com/adsense/answer/48182?hl=en "Google AdSense Program policies"

[2]: https://support.google.com/adsense/answer/10502938?hl=en "Google Publisher Policies"

[3]: https://support.google.com/adsense/answer/7670013?hl=en "EU user consent policy – Google AdSense Help"

[4]: https://support.google.com/adsense/answer/9031649?hl=en "Publisher EU user consent journeys – Google AdSense Help"
