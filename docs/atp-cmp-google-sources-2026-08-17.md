# Google ATP/CMP 配置政策证据

## 官方来源

1. [About Privacy & messaging](https://support.google.com/adsense/answer/10924669?hl=en)：Privacy & messaging 用于管理隐私法规设置、广告类型、广告合作伙伴和用户消息；站长可创建、发布并测试同意消息。
2. [About European regulations messages](https://support.google.com/adsense/answer/10961068?hl=en)：欧洲法规消息应列出网站使用的广告技术供应商，并向用户请求个性化广告和其他用途所需的同意；消息支持两按钮或三按钮流程，并支持 IAB TCF v2.3。Google Consent Mode 可在 Google CMP 场景下传递广告存储、个性化、用户数据和分析存储同意状态；用户必须能通过撤回入口重新调整选择。
3. [EU user consent policy](https://support.google.com/adsense/answer/7670013?hl=en)：EEA、英国和瑞士需要披露 Cookie/local storage、个人数据收集/分享/使用和广告个性化用途；站长需选择常用或自定义 ATP 集合，并把实际供应商和其隐私说明展示给用户。
4. [Help with the EU user consent policy](https://www.google.com/about/company/user-consent-policy-help/)：使用 AdSense 面向 EEA、英国和瑞士用户投放时，发布商需要采用 Google Certified CMP；首层应明确广告个性化、Cookie、Google及其他第三方数据使用、肯定同意动作和易于撤回的方式。

## 对 ConvertKit 的适用结论

当前自建 Cookie 横幅已经实现 unknown/granted/denied、拒绝、允许、偏好管理和 Privacy choices 撤回；AdSenseSlot 和 OptionalAnalytics 仅在 granted 且配置存在时加载。但横幅当前没有实际 Google ATP 列表、Google Business Data Responsibility 链接、广告个性化/非个性化说明、EEA/UK/CH 地区化显示逻辑或 Google Consent Mode/TCF 信号。因此它可以作为广告默认关闭期间的隐私 UI，不能直接证明已经满足 AdSense 面向 EEA、英国和瑞士用户的最终 CMP 要求。
