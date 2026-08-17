# Cookie Consent Banner UI 视觉检查记录

桌面 1280×720 截图显示横幅与 ConvertKit 深色 graphite/cobalt 视觉系统一致：顶部细 cobalt signal line、ShieldCheck 标记、mono 元数据、蓝色主按钮和深色次按钮形成清晰层级；核心 Hero 控件仍可见，三枚按钮同一基线排列。

移动 390×844 截图显示横幅采用纵向内容流，按钮全宽堆叠，主要操作位于底部且对比度清晰；横幅内部可滚动，长文案不会溢出视口。由于横幅仍会占据移动端底部可视区域，核心页面操作不会被遮挡，用户可先完成明确授权选择。

本轮 E2E 初次发现大面积 fixed flex 容器拦截快捷键按钮，已将 pointer-events 收窄至真实按钮和法律链接；修复后跨浏览器 E2E 为 11 passed、21 skipped，未再出现遮挡失败。
