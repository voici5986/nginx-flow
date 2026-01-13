# 📚 Google Analytics 4 集成文档

## 文档索引

### 🚀 快速开始
- **[5 分钟快速指南](./GA4_QUICKSTART.md)** - 最快的方式开始使用 GA4
  - 创建账号
  - 配置项目
  - 测试集成

### 📖 完整文档
- **[GA4 集成指南](./GA4_INTEGRATION.md)** - 详细的集成文档
  - 功能概述
  - 追踪事件列表
  - 隐私与合规
  - GA4 后台使用指南
  - 开发指南
  - 最佳实践
  - 常见问题

### ✅ 检查清单
- **[配置检查清单](./GA4_CHECKLIST.md)** - 部署前的完整检查项
  - 必须完成的配置
  - 隐私合规检查
  - 生产部署步骤
  - 调试技巧

### 📊 集成总结
- **[集成完成总结](./GA4_SUMMARY.md)** - 查看已完成的工作
  - 已实现的功能
  - 可追踪的事件
  - 下一步操作
  - 预期效果

---

## 📝 推荐阅读顺序

### 新手用户
1. [快速开始](./GA4_QUICKSTART.md) - 5 分钟快速上手
2. [配置检查清单](./GA4_CHECKLIST.md) - 确保配置正确

### 高级用户
1. [完整集成文档](./GA4_INTEGRATION.md) - 深入了解所有功能
2. [集成总结](./GA4_SUMMARY.md) - 查看技术细节

---

## 🎯 核心概念

### Measurement ID
- 格式：`G-XXXXXXXXXX`
- 获取位置：GA4 后台 → 管理 → 数据流 → 详情
- 配置位置：`.env.local` 文件

### 事件追踪
- 用户操作自动发送到 GA4
- 包含事件名称和参数
- 示例：`use_template`, `export_config`

### Cookie 同意
- 首次访问时显示横幅
- 符合 GDPR 要求
- 用户可选择接受或拒绝

---

## 🔗 外部资源

- [Google Analytics 4 官方文档](https://developers.google.com/analytics/devguides/collection/ga4)
- [react-ga4 GitHub](https://github.com/PriceRunner/react-ga4)
- [GA4 事件参考](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GDPR 合规指南](https://support.google.com/analytics/answer/9019185)

---

## 💬 需要帮助？

- 查看 [常见问题](./GA4_INTEGRATION.md#❓-常见问题)
- 检查浏览器控制台错误
- 访问 GA4 帮助中心
- 查看项目 GitHub Issues

---

**快速链接：** [快速开始](./GA4_QUICKSTART.md) | [完整文档](./GA4_INTEGRATION.md) | [检查清单](./GA4_CHECKLIST.md)
