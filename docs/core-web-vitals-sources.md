# Core Web Vitals 阈值来源

本轮 RUM 移动摘要使用官方推荐的第 75 百分位阈值：LCP 2.5 秒以内、INP 不超过 200 毫秒、CLS 不超过 0.1。来源：

- https://web.dev/articles/vitals
- https://developers.google.com/search/docs/appearance/core-web-vitals

实现说明：项目报告将满足阈值标记为 GREEN，将超过阈值但仍可观察的指标标记为 AMBER，将缺失或不可验证的数据标记为 NEUTRAL/NOT_CONFIGURED；这些是项目运营标签，不改变 Google 的官方指标定义。
