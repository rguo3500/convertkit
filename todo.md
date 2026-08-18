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

## 新一轮签名密钥与边界重试完善
- [ ] 设计独立签名密钥验证与安全降级策略
- [ ] 将签名写入索引并在 PR 摘要校验
- [ ] 增加接近 5 MB 上限和多字节 UTF-8 测试
- [ ] 覆盖失败请求指数退避与错误提示
- [ ] 运行全量质量检查并保存 checkpoint

## 新一轮索引签名与离线恢复完善
- [x] 设计下载索引校验版本与签名字段
- [x] 实现索引签名/完整性校验并接入 PR 摘要
- [x] 增加超大文件限制与非法编码文件测试
- [x] 增加离线恢复与重试场景回归测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮下载索引与网络回归完善
- [x] 设计下载索引中的 SHA-256 与 runTimestamp 字段
- [x] 将元数据写入独立下载索引
- [x] 增加真实文件选择与上传取消流程测试
- [x] 增加低带宽与滚动位置保持回归测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮时间戳校验与移动输入测试完善
- [x] 设计运行时间戳安全格式
- [x] 将时间戳写入 CSV/JSON 导出文件名和元数据
- [x] 在 PR 评论中显示导出文件 SHA-256 校验值
- [x] 增加移动 Safari 动态 viewport 与软键盘场景测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮 SHA 审计与移动方向测试完善
- [x] 设计 commit SHA 安全命名规则
- [x] 将短 SHA 写入 CSV/JSON 导出文件名和元数据
- [x] 在 PR 评论中链接具体导出 artifact 文件
- [x] 增加移动 Safari 屏幕方向切换回归测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮窗口导出与移动浏览器完善
- [x] 设计日期窗口与 preset 的安全文件名
- [x] 实现带窗口标识的 CSV/JSON 导出文件名
- [x] 在 PR 评论中显示导出摘要行数和下载链接
- [x] 增加移动 Safari viewport 的菜单与焦点回归测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮导出与跨浏览器可访问性完善
- [x] 设计路由差异 CSV/JSON 导出格式
- [x] 实现差异表导出入口和下载内容
- [x] 在 PR 评论中展示 failureTrend schema 结果和失败详情链接
- [x] 增加跨浏览器 Playwright Escape 焦点返回测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮差异筛选与焦点回归完善
- [x] 设计路由差异排序和变化幅度筛选模型
- [x] 实现指标排序与幅度筛选
- [x] 增加 failureTrend schema 校验测试
- [x] 覆盖 Escape 关闭后的焦点返回
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮路由差异与快捷键测试完善
- [x] 设计按路由 RUM 窗口差异数据模型
- [x] 实现路由级 LCP、INP、CLS 差异表
- [x] 将失败趋势写入 webhook 审计 JSON
- [x] 为快捷键帮助面板增加 focus-visible 自动化断言
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮历史对比与焦点回归完善
- [x] 设计预设时间窗口历史对比摘要
- [x] 实现 RUM 预设与历史窗口对比
- [x] 实现 workflow step 跨多次运行失败趋势对比
- [x] 增加页脚与首页快捷入口键盘顺序和焦点可视化测试
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮时间审计与全站无障碍完善
- [x] 设计 RUM 预设起止时间与时区字段
- [x] 在健康报告中回显预设时间窗口和时区
- [x] 为 PR workflow step 失败分组增加次数和最近发生时间
- [x] 为页脚链接与首页快捷入口补充中英文 aria-label
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮预设回显与首页无障碍完善
- [x] 设计 RUM 预设回显和 workflow step 失败分组模型
- [x] 实现预设当前选择回显与运行摘要
- [x] 按 workflow step 分组 PR 失败类型统计
- [x] 为首页搜索与导航补充中英文 aria-label
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮日期控件与双语无障碍完善
- [x] 设计最近 7 天、30 天和全部范围的可视化选择控件
- [x] 实现预设控件并同步筛选状态
- [x] 在 PR artifact 摘要中显示失败类型和报告数量
- [x] 为更多界面状态增加中英文无障碍文案
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮预设范围与本地化完善
- [x] 设计最近 7 天、30 天和全部日期范围预设
- [x] 实现预设范围并同步筛选状态
- [x] 在 PR 评论中显示 artifact 索引摘要统计
- [x] 增加屏幕阅读器播报语言本地化支持
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮日期筛选与可访问性完善
- [x] 设计 RUM 路由历史日期筛选模型
- [x] 实现日期筛选和筛选状态说明
- [x] 将 artifact 下载索引链接加入 PR 评论
- [x] 增加快捷键面板屏幕阅读器状态播报
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮路由历史与审计完善
- [x] 设计按路由 RUM 历史折线图数据模型
- [x] 实现路由级历史图表与状态说明
- [x] 设置审计 artifact 保留期限并生成下载索引
- [x] 实现快捷键面板关闭后的焦点返回
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮路由监控与可访问性完善
- [x] 设计按页面路由拆分的 RUM 分指标数据模型
- [x] 实现路由级 LCP、INP、CLS 趋势视图
- [x] 将 Webhook 历史扩展为带校验摘要的可审计持久化记录
- [x] 增强快捷键帮助面板焦点管理和首次访问提示
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮跨运行监控与快捷键完善
- [x] 设计 LCP、INP、CLS 分指标颜色模型
- [x] 实现分指标趋势颜色与数据校验
- [x] 持久化 Webhook 时间段统计并展示跨运行趋势
- [x] 增加集中式快捷键帮助面板
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮历史监控完善
- [x] 设计 RUM 历史状态颜色趋势模型
- [x] 实现历史颜色趋势和真实数据校验
- [x] 增加 Webhook 失败分类按时间段聚合统计
- [x] 补充倒计时提示的键盘快捷键说明
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮可访问监控完善
- [x] 设计 RUM 指标阈值颜色规则
- [x] 实现移动摘要阈值颜色与说明
- [x] 增加 Webhook 失败原因分类统计
- [x] 增加复制预览可访问倒计时
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮运行反馈完善
- [x] 设计 RUM 移动摘要指标排序
- [x] 实现移动摘要排序和数据校验
- [x] 增加 Webhook 重试运行时摘要
- [x] 增加 Escape 关闭复制预览
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮可配置体验完善
- [x] 设计移动端 RUM 趋势图简化视图
- [x] 实现移动端趋势图视图和数据校验
- [x] 增加 Webhook 重试次数与退避上限配置
- [x] 增加复制预览手动关闭按钮
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮趋势与通知完善
- [x] 设计最近 12 次 RUM 快照表格与折线图模型
- [x] 实现趋势表格、折线图和真实数据校验
- [x] 为团队 Webhook 增加失败重试与脱敏日志
- [x] 为复制链接预览增加自动隐藏倒计时
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮运营协同完善
- [x] 设计 RUM 历史趋势记录模型
- [x] 实现趋势记录和报告展示
- [x] 增加负责人变更团队频道通知适配
- [x] 增加复制成功后的链接预览
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮运营可视化完善
- [x] 设计 RUM 状态颜色分级与阈值说明
- [x] 实现颜色分级、阈值提示和测试
- [x] 为负责人变更增加 GitHub Issue 评论通知
- [x] 增加共享问题视图一键复制链接
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮可复现监控完善
- [x] 设计 RUM 来源时间范围与新鲜度标签
- [x] 实现 RUM 标签和时间范围展示
- [x] 记录 Lighthouse 提醒负责人变更历史
- [x] 将无效值排序同步到 URL 参数
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮可分享监控完善
- [x] 设计 RUM 时间范围与数据新鲜度校验
- [x] 实现 RUM 时间范围、时区和新鲜度状态
- [x] 为 Lighthouse 提醒 Issue 自动 @mention 负责人
- [x] 将无效值筛选同步到 URL 参数
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮监控闭环完善
- [x] 设计清除当前列筛选交互
- [x] 实现清除筛选并补充交互测试
- [x] 创建 Lighthouse 例外到期提醒 Issue
- [x] 为恢复摘要预留 Cloudflare Web Analytics 指标
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮持续运营体验完善
- [x] 设计“仅显示当前列”快捷筛选行为
- [x] 实现快捷筛选并补充交互测试
- [x] 为 Lighthouse 例外配置加入自动过期提醒
- [x] 为恢复告警 Issue 增加指标摘要
- [x] 运行全量质量检查并保存 checkpoint

## 新一轮可维护性完善
- [x] 设计无效值按列筛选与排序模型
- [x] 实现问题列表筛选、排序与测试
- [x] 增加 Lighthouse 页面级例外规则
- [x] 完善健康告警 Issue 负责人、标签和自动关闭
- [x] 运行全量质量检查并保存 checkpoint

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


## 本轮生产运维增强
- [x] 配置 RUM_EXPORT_SIGNING_KEY 的运维检查与签名状态说明
- [x] 增加 webhook 审计历史趋势可视化输出
- [x] 增加生产域名 Lighthouse 与 RUM 基线对比报告
- [x] 运行全量质量验证并保存 checkpoint


## 本轮配置与运营收尾
- [x] 增加签名密钥配置状态与严格模式检查
- [x] 处理 Cloudflare robots 差异并明确 Lighthouse 阻断策略
- [x] 将 webhook 趋势报告接入团队周报输出
- [x] 运行全量质量验证并保存 checkpoint


## 本轮严格门禁收尾
- [ ] 核对 GitHub Actions Secret/Variable 权限与当前状态
- [ ] 完成签名密钥与强制校验配置，或记录外部权限阻塞
- [ ] 审核 robots 结果并决定 Lighthouse 严格门禁状态
- [ ] 复核 webhook 周报入口与审计产物
- [ ] 运行全量质量验证并保存 checkpoint


## GitHub 403 权限阻塞处理
- [x] 记录当前 Secret/Variable 写入权限被 GitHub 403 拒绝
- [x] 完善不依赖外部写权限的诊断与手动配置说明
- [x] 执行本地质量验证并保存 checkpoint


## 本轮管理员配置核验
- [x] 核对 GitHub Secret/Variable 是否已生效
- [x] 运行签名与 quality workflow 回归
- [x] 根据 robots 审核结果决定 Lighthouse 严格阻断
- [x] 执行最终验证并保存 checkpoint


## 本轮签名与严格门禁复核
- [x] 复核 GitHub Secret/Variable 与 ops-config-status
- [x] 完善签名配置安全状态与手动指引
- [x] 审核生产 robots 并决定 Lighthouse 严格门禁
- [x] 执行真实 CI 与本地全量验证并保存 checkpoint


## 本轮签名与 Lighthouse 严格化
- [x] 复核 GitHub 管理权限与签名配置状态
- [x] 复核 Cloudflare Managed robots 内容及外部审核结果
- [x] 按结果调整 Lighthouse 严格阻断开关
- [x] 执行真实 CI 与本地全量验证并保存 checkpoint


## 本轮严格门禁条件复核
- [x] 核验 GitHub 管理权限与 RUM 签名状态
- [x] 核验 Cloudflare Managed robots 外部审核条件
- [x] 按条件启用或保持 Lighthouse 严格阻断
- [x] 执行完整验证并保存 checkpoint


## 本轮管理员权限与规则复核
- [x] 核验 GitHub 管理权限与签名状态
- [x] 复核 Cloudflare robots 规则与外部审核
- [x] 按条件配置 Lighthouse 严格门禁
- [x] 执行质量验证并保存 checkpoint


## 本轮最终门禁复核
- [x] 核验签名密钥权限与配置状态
- [x] 复核生产 robots 规则与外部审核
- [x] 决定并验证 Lighthouse 门禁策略
- [x] 执行最终质量检查并保存 checkpoint


## 本轮质量输出复核
- [x] 复核 webhook 趋势 Job Summary 与 artifact 输出
- [x] 复核签名状态与 robots 门禁开关
- [x] 执行完整 quality 与前端回归
- [x] 保存 checkpoint


## 本轮 Job Summary 复核
- [x] 复核 Job Summary 与 webhook artifact
- [x] 复核签名严格模式与 robots 开关
- [x] 执行质量回归并检查外部门禁结果
- [x] 保存 checkpoint


## 最后一次生产级审核
- [ ] 审计 GitHub Actions 与敏感配置
- [ ] 审计 Webhook、RUM 签名与历史记录链路
- [ ] 审计 robots、Lighthouse、测试与文档一致性
- [ ] 汇总问题并给出修复优先级


## pnpm 10 配置修复
- [x] 确认 pnpm 10 兼容配置格式
- [x] 迁移 patchedDependencies 与 overrides
- [x] 同步 lockfile 并验证 frozen install
- [x] 运行质量测试并保存 checkpoint


## JSX loc 与 Vite 7 peer warning 评估
- [x] 确认插件用途与当前引用链
- [x] 核验官方兼容性与替代方案
- [x] 比较升级与移除后的构建测试结果
- [x] 给出处理结论与实施建议


## CI 重跑与生产资源复核
- [x] 确认当前仓库与本地调试配置状态
- [x] 触发并监控 quality workflow
- [x] 核验 CI 日志与源码定位替代方案
- [x] 验证生产 signal-grid 资源并汇总结果


## 线上旧资源引用清理与图片复核
- [x] 审计线上与本地 signal-grid 资源引用
- [x] 清理旧引用并验证构建输出
- [x] 同步代码并准备重新部署
- [ ] 复核线上图片资源并交付结果（等待 Cloudflare 发布切换）


## AdSense Privacy Policy 合规评估
- [x] 收集本地与生产隐私政策
- [x] 对照 Google AdSense 与同意政策
- [x] 识别缺口并形成风险评估
- [x] 交付评估结论与修订优先级


## AdSense 法律页面整改
- [x] 确认现有法律页面与实际数据行为
- [x] 实现 Privacy、Cookie Policy 与 Terms 页面
- [x] 完善路由 SEO 与法律页面导航
- [x] 运行测试、构建与视觉检查
- [x] 保存整改版本并交付审核事项（CMP、运营者法定名称和实际供应商仍需外部确认）


## AdSense 广告位预留组件
- [x] 检查现有页面布局与广告接入状态
- [x] 实现默认关闭的 AdSense 组件与配置
- [x] 在合适页面预留广告位并隔离核心操作
- [x] 运行测试、构建和视觉回归
- [x] 保存版本并交付启用前配置说明


## Cookie Consent Banner 与 AdSense 联动
- [x] 审计现有广告门控与隐私页面
- [x] 实现 Cookie 同意状态与偏好管理
- [x] 联动 AdSense 广告组件与页面入口
- [x] 验证同意、拒绝、撤回和响应式体验
- [x] 保存版本并交付外部配置事项


## AdSense 上线准备复审
- [x] 审计 AdSense 代码与环境开关
- [x] 核验 Cookie 同意与隐私披露链路
- [x] 检查广告位、SEO 与生产请求
- [x] 形成启用结论与风险清单


## AdSense 上线准备逐条整改
- [x] 建立逐项整改矩阵与现状基线
- [x] 完成本地代码与生产发布前整改
- [x] 核验外部配置与权限阻断项
- [x] 制定分阶段启用方案与验收标准
- [x] 交付整改结果、阻断清单与后续操作


## AdSense 上线准备再次复审
- [x] 复核生产版本与法律页面
- [x] 复核同意状态与广告脚本门控
- [x] 复核 SEO、CI 与外部配置阻断项
- [x] 给出当前启用结论与下一步


## 法律页面旧 Placeholder 修复
- [x] 定位旧 Placeholder 来源与法律路由
- [x] 修复法律页面路由与占位内容
- [x] 运行法律页面与项目回归验证
- [x] 完成生产前核验并交付版本


## Cookie Consent Banner UI 优化
- [x] 审计现有横幅结构与全局设计令牌
- [x] 重构横幅视觉层级与响应式布局
- [x] 加入可访问的入场、收起和交互动画
- [x] 验证授权逻辑、响应式和视觉回归
- [x] 保存优化版本并交付结果


## Cookie Consent Banner 再次审核
- [x] 复核横幅实现与设计一致性
- [x] 验证授权流程与动画无障碍行为
- [x] 执行桌面移动与回归测试
- [x] 交付审核结论与必要修复建议


## Google AdSense 详细上线审计
- [x] 建立生产与本地配置事实基线
- [x] 核验法律、Cookie 同意与广告门控
- [x] 核验广告位、SEO、CI 与发布链路
- [x] 对照 Google 政策形成放行判定
- [x] 交付详细审计报告与整改清单


## AdSense 审计状态更新（quality 已成功）
- [x] 核对 quality workflow 成功证据
- [x] 更新审计报告中的门禁状态
- [x] 重新判定剩余 AdSense 放行条件
- [x] 交付更新后的审核结论


## AdSense 证据与官方政策整改
- [ ] 建立证据到整改项映射
- [ ] 整改代码、审计脚本与法律披露
- [ ] 核验生产稳定性与外部配置边界
- [ ] 执行政策对照与上线前验收
- [ ] 交付整改结果与不可代办清单


## AdSense 配置操作指南
- [ ] 准备运营者与广告业务资料
- [ ] 配置法律页面与隐私联系渠道
- [ ] 选择并配置 Cookie 同意方案
- [ ] 配置 AdSense 与安全发布门控
- [ ] 执行上线验收并交付操作清单


## 运营者信息与 Contact 页面更新
- [x] 确认法律页面与联系路由现状
- [x] 更新运营者信息与隐私披露
- [x] 新增 Contact 页面与法律请求入口
- [x] 运行法律页面、SEO 与生产构建验证
- [x] 保存版本并交付 CMP/AdSense 后续事项（CMP、AdSense 账户与实际供应商清单仍待外部配置）


## 运营者名称更新为 shenlan
- [x] 定位运营者名称的全部引用
- [x] 替换法律与联系页面名称
- [x] 执行内容与项目回归验证
- [x] 保存更新版本并交付结果


## 悬浮联系我们按钮
- [x] 审计现有 Contact 页面与全局浮层
- [x] 实现悬浮联系按钮与信息面板
- [x] 适配 Cookie 横幅与移动端布局
- [x] 验证交互、可访问性与视觉回归
- [x] 保存版本并交付使用说明


## Google AdSense 上线复审
- [x] 整理现有 AdSense 证据与审计范围
- [x] 检查法律页面、隐私同意和广告代码门控
- [x] 检查 SEO、内容质量和生产可访问性
- [x] 汇总通过项、风险项和外部待办
- [x] 交付 AdSense 复审报告


## AdSense 复审逐条整改
- [x] 核对本地最新代码与生产差异
- [x] 完善法律页面与 Contact 生产内容
- [x] 强化 AdSense 生产审计和配置门禁
- [x] 运行完整验证并复核生产证据
- [x] 保存整改版本并交付剩余外部事项

> 生产 Cloudflare 发布、Google ATP/CMP/Privacy & Messaging、真实 AdSense client/slot ID 和最终 Network 验收仍需站点管理员完成。


## Google ATP/CMP 配置检查
- [x] 收集 Google 官方 ATP/CMP 与 Privacy & Messaging 要求
- [x] 核对 ConvertKit 当前 Cookie 同意与 AdSense 实现
- [x] 对照 EEA/英国/瑞士同意信号和供应商披露缺口
- [x] 生成后台配置清单与风险结论
- [x] 交付 ATP/CMP 配置审计结果

> 当前自建横幅已完成基础拒绝/允许/撤回门控，但 Google Certified CMP、Privacy & Messaging 欧洲法规消息、真实 ATP、TCF v2.3/Consent Mode 信号和供应商隐私链接仍需后台配置。


## Google CMP 集成就绪弹窗
- [x] 审计现有 Cookie 同意架构与 Google 接入边界
- [x] 设计第一层披露、供应商和同意状态模型
- [x] 实现 CMP 集成就绪弹窗、供应商入口和撤回机制
- [x] 验证同意状态、广告门控、响应式和可访问性
- [x] 保存实现版本并交付 Google 后台配置步骤

> 当前代码是 Google Privacy & Messaging/CMP 集成就绪方案，不是 Google Certified CMP；真实 ATP、TCF v2.3/Consent Mode 和 Privacy & Messaging 发布配置仍需 AdSense 后台完成。


## Google AdSense 再次复审
- [x] 建立最新版本与生产部署基线
- [x] 复核 CMP 披露、法律页面和广告门控
- [x] 执行生产请求与 SEO 可访问性审计
- [x] 核对 ATP、Privacy & Messaging 和 Consent Mode 外部缺口
- [x] 交付复审结论和下一步放行条件

> 最新生产审计全部通过；Google Certified CMP/Privacy & Messaging 发布消息、真实 ATP、TCF v2.3 或 Consent Mode、真实 client/slot ID 和授权后 Network 验收仍需 AdSense 后台完成。


## Google Certified CMP 获取与配置
- [x] 查阅 Google 官方认证 CMP 规则与名单
- [x] 区分 Google Privacy & Messaging 与第三方 CMP 路线
- [x] 制定 ConvertKit 的后台和网站接入步骤
- [x] 输出认证 CMP 获取指南与放行检查表

> 推荐优先使用 AdSense 内置 Google Privacy & Messaging 欧洲法规消息；第三方必须从 Google 官方 Certified CMP 名单核对；自建 CMP 认证属于供应商级长期路线，不建议作为当前上线捷径。


## AdSense 网站所有权验证代码
- [x] 核对现有 head 与 AdSense 脚本状态
- [x] 确认验证脚本接入方式与环境门控
- [x] 实现 head 验证代码并更新部署说明
- [x] 运行构建和验证代码检查
- [x] 交付 AdSense 验证和 Cloudflare 发布步骤

> 已加入 `google-adsense-account` 元标记；广告脚本仍由 Cookie 同意和 AdSense 环境变量门控。Cloudflare 发布后，需回 AdSense 点击“我已放置代码”并执行验证。


## AdSense 验证版本发布
- [ ] 核对本地提交与 GitHub main 差异
- [ ] 同步验证元标记版本到 GitHub
- [ ] 确认 Cloudflare 自动部署触发条件
- [ ] 交付 AdSense 验证操作步骤
