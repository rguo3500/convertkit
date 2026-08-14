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
