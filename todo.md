# ConvertKit Enhancement Todo

## SEO 基础设施
- [x] 添加统一的页面 metadata 管理（title、description、canonical、Open Graph、Twitter Card）
- [x] 为单位 pair 页面与格式工具页面加入 JSON-LD：WebApplication、BreadcrumbList、实际展示的 FAQPage（FAQ 页面展示待补）
- [x] 创建 sitemap.xml 与 robots.txt，使用环境变量控制 Sitemap URL
- [ ] 补齐真实的 404 页面与基础 SEO 友好路由

## 博客与分类内容
- [x] 将分类页升级为带描述、热门转换、FAQ 与相关分类的内容页
- [x] 创建博客目录与首批转换指南文章，并链接到对应工具
- [x] 为博客与分类页补齐页面级 metadata

## 批量转换与 Pro 预留
- [x] 添加批量 CSV 转换页面与 CSV 解析/序列化能力
- [x] 支持选择 From Unit、To Unit，并生成可下载 CSV
- [x] 创建 Pricing UI 的 Free/Pro 对比与功能预留说明
- [x] 为未来 ConversionService、API key、历史记录和自定义预设保留清晰接口边界

## 最新一轮完善
- [x] 增加 CI 状态徽章、贡献说明和分支保护操作文档
- [x] 为内容页与首屏非必要模块增加路由级懒加载，继续拆分入口依赖
- [x] 编写真实生产域名、VITE_SITE_URL、Sitemap 和搜索引擎提交说明
- [x] 完成全量验证并保存新 checkpoint

## 当前完善
- [x] 用实际 GitHub 仓库路径替换文档和 CI 徽章中的占位值
- [x] 增加生产环境 Lighthouse 基线与结果记录模板
- [x] 优化首屏 CSS 注入、字体请求和分析脚本加载
- [x] 完成全量验证并保存新 checkpoint

## 最新一轮完善
- [x] 用 conversion-pairs.json 生成运行时/构建时可消费的 pair registry
- [x] 让 Sitemap、SEO metadata 和动态 pair 路由复用同一 registry
- [x] 添加 GitHub Actions CI，执行测试、数据校验、类型检查、构建和 Lighthouse
- [x] 针对生产构建优化首屏包、字体加载和第三方脚本
- [x] 完成全量验证并保存新 checkpoint

## 新一轮完善
- [x] 抽取格式工具纯函数并补充 JSON、Base64、URL、Unix 时间戳测试
- [x] 加入 Lighthouse 与可访问性检查配置及可执行脚本
- [x] 建立 conversion 数据源校验与生成说明，降低手工维护风险
- [x] 运行完整测试、性能检查、类型检查和生产构建

## 本轮完善
- [x] 将 conversion 配置从页面组件拆分为独立数据与计算模块
- [x] 按路由拆分格式工具代码，降低首屏 JavaScript 体积
- [x] 为长度、重量、温度和 CSV 批量转换补充单元测试
- [x] 运行测试、类型检查、生产构建并检查产物体积

## 下一轮完善
- [x] 将 Sitemap 与 Robots 改为部署时可配置的生成方式
- [x] 扩展更多真实 conversion pair 页面，并集中配置 metadata、公式、示例和相关工具
- [x] 增加文件上传、转换历史与 Pro 订阅的清晰功能边界和占位交互
- [x] 为新页面增加测试样例与移动端验证

## 验证与交付
- [x] 运行类型检查与生产构建
- [x] 验证首页、SEO 页面、博客、批量转换、Pro 页面和移动端截图
- [x] 保存新的可交付 checkpoint
