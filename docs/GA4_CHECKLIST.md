# ✅ Google Analytics 4 配置检查清单

部署前请确保完成以下步骤：

## 🎯 必须完成

- [ ] **创建 GA4 账号**
  - 访问 https://analytics.google.com/
  - 创建媒体资源（类型：网站）
  - 获取 Measurement ID（格式：G-XXXXXXXXXX）

- [ ] **配置环境变量**
  - [ ] 创建 `.env.local` 文件（开发环境）
  - [ ] 填写真实的 `VITE_GA_MEASUREMENT_ID`
  - [ ] 在部署平台配置生产环境变量（Vercel/Netlify/etc）

- [ ] **测试集成**
  - [ ] 启动开发服务器
  - [ ] 检查浏览器控制台是否有 `[Analytics] GA4 已初始化` 日志
  - [ ] 访问 GA4 后台实时报告，确认能看到访问数据

## 🔒 隐私合规（可选但推荐）

- [ ] **Cookie 同意横幅**
  - 已自动集成 ✅
  - 首次访问延迟 2 秒显示
  - 用户可选择接受或拒绝

- [ ] **隐私政策页面**
  - [ ] 创建隐私政策页面
  - [ ] 说明收集的数据类型
  - [ ] 说明数据用途和保护措施

- [ ] **IP 匿名化**
  - 已自动启用 ✅
  - 配置位置：`src/utils/analytics.ts` 第 30 行

## 📊 生产部署

- [ ] **部署平台配置**
  
  **Vercel:**
  ```
  Settings → Environment Variables
  VITE_GA_MEASUREMENT_ID = G-YOUR-PRODUCTION-ID
  ```
  
  **Netlify:**
  ```
  Site settings → Build & deploy → Environment
  VITE_GA_MEASUREMENT_ID = G-YOUR-PRODUCTION-ID
  ```
  
  **自建服务器:**
  ```bash
  # 创建 .env.production
  echo "VITE_GA_MEASUREMENT_ID=G-YOUR-PRODUCTION-ID" > .env.production
  ```

- [ ] **构建验证**
  ```bash
  npm run build
  # 检查是否有构建错误
  ```

- [ ] **部署后测试**
  - [ ] 访问生产环境网站
  - [ ] 打开浏览器开发者工具 → Network
  - [ ] 过滤 `google-analytics.com`，确认有请求发送
  - [ ] 检查 GA4 实时报告

## 📈 后续配置（可选）

- [ ] **创建自定义报告**
  - GA4 后台 → 探索 → 创建探索
  - 示例：最受欢迎的模板、功能使用排行

- [ ] **设置转化目标**
  - 管理 → 事件 → 标记为转化
  - 建议转化：`export_config`, `use_template`

- [ ] **配置数据流过滤器**
  - 排除内部流量（开发者 IP）
  - 排除测试事件

- [ ] **启用 BigQuery 导出**（大型项目）
  - 管理 → 产品链接 → BigQuery
  - 用于高级数据分析和机器学习

## 🧪 调试技巧

**查看实时事件：**
```javascript
// 浏览器控制台
localStorage.setItem('ga-consent', 'accepted');
location.reload();
// 然后执行操作，查看控制台 [Analytics] 日志
```

**检查 GA4 请求：**
```
开发者工具 → Network → 筛选 "collect"
查看请求参数，确认 Measurement ID 正确
```

**清除同意状态：**
```javascript
localStorage.removeItem('ga-consent');
location.reload();
```

## 📞 遇到问题？

- [ ] 查看 [GA4 集成文档](./GA4_INTEGRATION.md)
- [ ] 检查浏览器控制台错误
- [ ] 确认广告拦截器未屏蔽 GA
- [ ] 查看 [常见问题](./GA4_INTEGRATION.md#❓-常见问题)

---

## ✨ 完成后

恭喜！🎉 你已完成 Google Analytics 4 集成。

现在你可以：
- 📊 实时查看访问量
- 👥 了解用户行为
- 📈 分析功能使用情况
- 🎯 数据驱动优化产品

访问 GA4 后台开始探索你的数据！
