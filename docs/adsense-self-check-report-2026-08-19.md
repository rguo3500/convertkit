# ConvertKit AdSense 政策合规自查报告

**检查站点：** `https://lovexiaoyue.cc.cd`  
**检查时间：** 2026-08-19 22:23（用户时区）  
**检查基线：** AdSense 网站审核已提交；Privacy & Messaging → European regulations 已发布；正式广告位和广告脚本仍未开启。

## 一、总体结论

本轮生产自查的**代码、页面、CMP 和基础技术检查全部通过**。首页和法律页当前没有发现会阻断审核的 Placeholder、404、未授权 Google/分析请求或广告空白位。AdSense 所有权元标记已在线，`robots.txt` 和 `sitemap.xml` 正常。

仍不能标记为“正式投放已完成”的项目只有 Google 后台和审核后事项：AdSense 审核结果尚未确认；真实广告 client/slot 尚未配置；授权后的真实广告 Network 验收尚未执行。因此当前继续保持广告关闭是正确做法。

## 二、逐项结果

| 分类 | 检查项目 | 结果 | 证据/说明 |
|---|---|---:|---|
| 网站所有权 | AdSense 元标记 | PASS | 生产 HTML 包含 `google-adsense-account=ca-pub-8499470613171796` |
| 可访问性 | 首页 | PASS | HTTP 200，页面正常渲染 |
| 可访问性 | Privacy Policy | PASS | HTTP 200，包含当前法律内容和运营者记录 |
| 可访问性 | Cookie Policy | PASS | HTTP 200，包含当前法律内容和运营者记录 |
| 可访问性 | Terms | PASS | HTTP 200，包含当前法律内容和运营者记录 |
| 可访问性 | Contact | PASS | HTTP 200，包含真实支持入口和运营者记录 |
| 运营者身份 | 名称、邮箱、地址 | PASS | `shenlan`、`rguo3500@gmail.com`、河南省平顶山市光明路北段一致 |
| 内容质量 | Placeholder/假内容 | PASS | 生产 readiness 审计未发现旧 Placeholder；未发现假评论、假评分或假推荐 |
| CMP | 首页 Cookie 横幅 | PASS | 新鲜浏览器上下文显示横幅和 Reject optional 操作 |
| CMP | 欧洲法规消息 | PASS | 用户提供的 AdSense 截图显示 `lovexiaoyue.cc.cd` 消息为“已发布”并启用 |
| 隐私门控 | 未授权可选请求 | PASS | 新鲜访问在同意前无 Google、广告或分析可选请求 |
| 广告门控 | 未授权广告占位 | PASS | DOM 中无 `adsbygoogle` 或 `googlesyndication` 占位标记 |
| SEO | robots.txt | PASS | HTTP 200，并声明生产 sitemap |
| SEO | sitemap.xml | PASS | HTTP 200，使用生产主机 |
| Cloudflare | 生产部署 | PASS | 最近已确认 `main 6f660ce` 构建和发布成功 |
| 广告上线 | 真实 client/slot | WAIT | 必须等审核通过后从 AdSense 后台获取并配置 |
| 广告上线 | 授权状态 Network 验收 | WAIT | 尚未加载真实广告，不应在审核期间执行 |
| 审核状态 | AdSense 审核结果 | WAIT | 申请已提交，等待 Google 后台通知 |

## 三、首页和用户体验复核

首页已展示真实的工具价值：单位转换、格式工具、工具分类、浏览器本地处理说明和主要导航。转换器不依赖广告点击，广告区域目前未改变核心操作布局。首页的 Cookie 横幅提供允许、拒绝和管理路径，不阻止用户使用转换器。

正式投放后仍需再次检查广告与输入框、复制按钮、下载按钮、导航和转换结果之间的间距。Google 禁止将广告实现为可能被误认成菜单、导航、下载或页面功能的内容，也禁止诱导用户点击。[1]

## 四、法律页和 CMP 复核

四个生产页面均可访问，运营者资料已统一。Privacy Policy 和 Cookie Policy 已说明未来广告、Cookie/local storage、Google/广告供应商、个性化与非个性化广告以及用户选择机制。Privacy & Messaging 的 European regulations 消息已由用户在 AdSense 后台发布，广告合作伙伴采用 Google 的自动添加方案。

开启真实广告前，还需要将最终 ATP 清单、Google 产品、实际广告脚本和法律页中的供应商说明做一次逐字同步。Google 的 EU 用户同意政策要求在 EEA、英国和瑞士进行必要披露，并在法律要求时取得 Cookie/local storage 和个性化广告数据处理同意。[2] [3]

## 五、当前未发现的问题

本轮未发现以下阻断问题：生产页面 4xx/5xx；法律页旧 Placeholder；运营者信息不一致；新访客未同意前的可选 Google/分析请求；AdSense 空白广告位；robots/sitemap 不可访问；或所有权元标记缺失。

## 六、审核通过后的待办

审核通过后，必须先从 AdSense 后台确认真实 `ca-pub` client ID 和每个广告位 slot ID，再配置 Cloudflare 环境变量。配置后依次测试未选择、拒绝、允许和撤回四种状态：未选择/拒绝时不得出现可选广告请求；允许后只出现预期的广告脚本和配置好的广告位；撤回后应停止或清理可选脚本，同时保留转换器核心功能。

正式上线前应保存 AdSense 审核通过截图、European regulations 发布状态、ATP 清单、法律页版本、Cloudflare 提交 SHA、Network 测试记录和回滚方案。不得点击自己的广告、要求他人点击或刷新广告、购买点击/展示流量，或使用自动化工具测试真实广告。[1] [4]

## References

[1]: https://support.google.com/adsense/answer/48182?hl=en "AdSense Program policies"

[2]: https://www.google.com/about/company/user-consent-policy/ "Google EU User Consent Policy"

[3]: https://support.google.com/adsense/answer/7670013?hl=en "Set up and manage your consent technology"

[4]: https://support.google.com/adsense/answer/2660562?hl=en "Common reasons AdSense accounts are closed for invalid traffic"
