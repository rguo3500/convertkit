# Google Privacy & Messaging 集成方案

## 方案定位

ConvertKit 当前 Cookie 横幅是一个**集成就绪的隐私选择界面**，不是 Google Certified CMP，也不会伪造 ATP、TCF v2.3 或 Consent Mode 信号。AdSense 在管理员完成 Google Privacy & Messaging/CMP 配置前保持关闭。

## Google 后台配置表

| 字段 | 应填写的真实内容 |
|---|---|
| 网站 | `lovexiaoyue.cc.cd` |
| 目标地区 | 全球，包含 EEA、英国和瑞士 |
| 广告模式 | 由管理员在 Privacy & messaging 中选择个性化、非个性化或受限广告策略 |
| CMP | Google Privacy & Messaging 或 Google Certified CMP；不能把自建横幅标记为 Certified CMP |
| ATP | 常用 ATP 集合或实际需要的自定义 ATP 集合 |
| 用户选择 | Do not consent、Consent、Manage options；撤回后重新显示三按钮选择 |
| Google 隐私说明 | https://business.safety.google/privacy/ |
| TCF/Consent Mode | 按所选 CMP 的官方安装方式启用；需要真实地区测试，不由 localStorage 模拟 |

## 网站侧接入规则

启用 Google 生成的消息或 Certified CMP 后，网站应当只保留一个实际控制同意状态的来源。不要让 ConvertKit 自建横幅和 Google CMP 同时向用户显示两个独立的允许/拒绝界面。若 Google CMP 接管同意，`AdSenseSlot` 应由真实 CMP 的有效同意信号或其官方桥接方式驱动，并继续保留 `VITE_ADSENSE_ENABLED`、真实 client ID 和 slot ID 三重配置门控。

当前横幅第一层已经明确说明 Cookie/local storage、Google 和选定广告合作伙伴、广告测量与个性化用途，并链接 Privacy Policy、Cookie Policy 和 Google Business Data Responsibility 页面。偏好面板也提醒实际 ATP 清单必须先在 AdSense 中选择。实际启用前，Cookie Policy 和 Privacy Policy 还必须替换当前的未来式披露，写入真实供应商、用途、保留期限和撤回路径。

## 发布前验收

新访客应在 EEA、英国和瑞士看到 Google Privacy & Messaging/CMP 欧洲法规消息；拒绝、允许、管理和撤回都要在 Network 中验证。拒绝后不得出现不符合所选方案的广告个性化或分析请求；允许后只能出现已披露供应商和已配置目的的请求；撤回后应停止后续可选脚本并能重新打开偏好界面。

完成后台配置、法律页同步和真实 client/slot ID 验证后，管理员才可以把 `VITE_ADSENSE_CONSENT_READY` 设为 `true`，再逐步启用 `VITE_ADSENSE_ENABLED=true`。任何阶段都不应把占位 client/slot ID 放入生产环境。
