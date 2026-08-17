# ConvertKit AdSense 复审政策证据

## Google 官方来源

1. [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en)：禁止自点、人工制造展示/点击、诱导点击、误导性广告实现；广告页面应易于导航，广告不得放在弹窗等不当位置，也不得干扰网站导航。
2. [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en)：广告内容须遵守非法内容、知识产权、误导性陈述、欺骗性做法等发布商政策。
3. [EU user consent policy](https://support.google.com/adsense/answer/7670013?hl=en)：EEA、英国和瑞士用户需要得到关于 Cookie/local storage、个人数据收集/分享/使用以及个性化广告的必要披露和同意；站长还需选择并向用户识别实际广告技术供应商。
4. [Publisher EU user consent journeys](https://support.google.com/adsense/answer/9031649?hl=en)：可使用自建同意方案、Google Privacy & messaging 或 IAB 认证 CMP，但必须结合 Google 的广告技术供应商和信号配置完成合规流程。

## 初步适用结论

ConvertKit 的本地代码已具备默认关闭广告、用户选择后才加载广告脚本、拒绝/撤回清理可选脚本、真实法律页面和运营者联系入口等基础条件。但自建 Cookie 横幅是否足以满足目标地区的 Google 同意信号要求，仍取决于 AdSense 后台 ATP、Privacy & messaging/CMP 选择和生产环境配置，不能仅凭本地 UI 判定最终通过。
