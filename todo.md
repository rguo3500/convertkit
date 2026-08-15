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

## 新一轮报告与监控完善
- [x] 设计无效值 JSON 报告与行内定位模型
- [x] 实现 JSON 下载和原始行定位交互
- [x] 为 Lighthouse 分数差异设置回归阈值
- [x] 将每周健康检查接入异常通知渠道
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮交付与持续运营完善
- [x] 设计无效值报告字段与下载模型
- [x] 实现无效值报告下载并补充测试
- [x] 将 axe/Lighthouse 分数与基线差异加入 PR 摘要
- [x] 建立每周健康检查定时工作流
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮质量与运营完善
- [x] 设计列级数据类型提示与无效值统计模型
- [x] 实现无效值统计、类型提示与结果状态展示
- [x] 将 PR 质量评论扩展为成功/失败摘要
- [x] 新增每周性能与索引健康检查记录模板
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮产品与运营完善
- [x] 规划批量 CSV 多列映射数据模型
- [x] 实现多列映射与自定义输出列配置
- [x] 为 CI 失败报告增加 Pull Request 摘要评论
- [x] 补充 Cloudflare Web Analytics 与 Search Console 接入说明
- [x] 运行全量质量检查并保存 checkpoint

## 最新质量与发布完善
- [x] 确认 Cloudflare 线上资源对应最新提交 3a2e79e
- [x] 为 CI artifact 增加失败时的 HTML、JSON 和截图报告
- [x] 为批量 CSV 文件增加大小上限提示
- [x] 为批量读取、解析和下载增加进度反馈
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮质量与发布完善
- [x] 确认 Cloudflare 线上资源对应最新提交 21a0ceb
- [x] 补充 JSON、XML、Base64、URL、时间戳的错误输入测试
- [x] 补充空 CSV、超大 CSV 和 CSV 特殊字符边界测试
- [x] 将 axe 与 Lighthouse 报告作为 GitHub Actions artifact 上传
- [x] 运行全量质量检查并保存 checkpoint

## 本轮质量与发布完善
- [x] 补充格式工具 JSON、Base64、URL、时间戳页面的交互测试
- [x] 补充格式工具文件导入与下载流程测试
- [x] 确认 Cloudflare 已部署 GitHub main 最新提交（GitHub main=e268a6b，线上核心资源 HTTP 200）
- [x] 重跑真实生产 Lighthouse 并更新基线
- [x] 保存新的质量保障 checkpoint

## 自动化质量保障
- [x] 配置可执行的 axe 可访问性检查并覆盖主要路由
- [x] 补充转换器输入、单位交换、复制、重置和格式工具交互测试
- [x] 运行单元测试、交互测试、axe、类型检查、构建和 Lighthouse
- [ ] 保存新的质量保障 checkpoint

## 生产体验优化
- [x] 在生产文档与 README 中加入可直接复制的 Sitemap 提交 URL 和 Cloudflare Analytics 配置提示
- [x] 检查主要页面输入、选择器和按钮的可访问名称、焦点顺序与键盘操作
- [x] 优化低对比度的辅助文字、边框和焦点状态
- [x] 重新运行测试、类型检查、构建和 Lighthouse（本地测试/构建已通过；生产 Lighthouse 待部署后重跑）
- [x] 保存新的生产体验 checkpoint

## 生产运营完善
- [x] 新增 Sitemap 提交清单和 Search Console/Bing Webmaster 操作说明
- [x] 补充 Cloudflare Analytics 与 Web Vitals 观测说明和环境变量配置
- [x] 对真实域名运行 Lighthouse，记录 Performance、Accessibility、SEO 与 Best Practices
- [x] 更新生产文档并保存新 checkpoint

## Cloudflare 线上收尾
- [x] 移除会被 Cloudflare 忽略的 `/* /index.html 200` 重定向规则，依赖 Pages SPA fallback
- [x] 让分析脚本仅在环境变量存在时注入，消除构建警告和无效 URL
- [x] 重新验证构建输出与线上 SEO 文件（本地构建已验证；线上待重新部署后复核）
- [x] 保存 Cloudflare 稳定版 checkpoint

## 真实生产域名同步
- [x] 将生产构建和部署文档统一为 `https://lovexiaoyue.cc.cd`
- [x] 验证线上首页、pair 页面、robots.txt 和 sitemap.xml
- [x] 保存域名同步后的 checkpoint

## Cloudflare 构建修复
- [x] 将 Cloudflare Build command 改为项目的 `pnpm run build`，不再执行 `npx vitepress build`
- [x] 移除或隔离与 VitePress 冲突的 manualChunks 配置（项目自身 Vite 构建保留分包；根因是 Cloudflare 使用了错误的 VitePress 命令）
- [x] 重新验证 Cloudflare Pages 输出目录、SPA 回退、Robots 和 Sitemap
- [x] 更新部署文档并保存修复 checkpoint

## Cloudflare Pages 部署
- [x] 检查 Cloudflare CLI/登录状态和目标项目名（已确认 Wrangler 未安装且凭据缺失）
- [x] 添加 Cloudflare Pages 构建配置与部署文档
- [x] 验证 `dist/public` 静态产物、SPA 回退和 VITE_SITE_URL
- [x] 在具备 Cloudflare 凭据时完成部署，否则交付可复制的发布步骤

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
