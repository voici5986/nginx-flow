# 🚀 5 分钟快速开始指南

## 第 1 步：创建 GA4 账号（2 分钟）

1. 访问 https://analytics.google.com/
2. 点击「开始衡量」
3. 创建账号（随便起个名字）
4. 创建媒体资源
   - 资源名称：`Nginx Config Editor`
   - 时区：选择你的时区
   - 货币：选择你的货币
5. 设置数据流
   - 平台：**网站**
   - 网站网址：`http://localhost:5173`（开发环境）
   - 数据流名称：`开发环境`
6. 获取 **Measurement ID**（格式：`G-XXXXXXXXXX`）
   - 在数据流详情页面顶部

## 第 2 步：配置项目（1 分钟）

```bash
# 1. 复制配置文件
cp .env.example .env.local

# 2. 编辑 .env.local
# 将 G-XXXXXXXXXX 替换为你的真实 Measurement ID
# Windows 用户可以使用记事本打开
notepad .env.local

# 3. 重启开发服务器
npm run dev
```

**配置文件内容：**
```env
VITE_GA_MEASUREMENT_ID=G-YOUR-REAL-ID
```

## 第 3 步：测试集成（2 分钟）

1. **打开浏览器**
   ```
   访问 http://localhost:5173
   ```

2. **检查控制台**（按 F12）
   ```
   应该看到：
   [Analytics] 开发环境，GA4 未启用
   
   或者（如果启用开发环境追踪）：
   [Analytics] GA4 已初始化
   [Analytics] 页面浏览: /
   ```

3. **接受 Cookie 横幅**
   - 等待 2 秒后会出现横幅
   - 点击「接受」按钮
   - 控制台应该显示：
     ```
     [Analytics] GA4 已初始化
     [Analytics] 页面浏览: /
     ```

4. **执行一些操作**
   - 使用模板库
   - 导出配置
   - 运行配置体检
   - 查看控制台的 `[Analytics]` 日志

5. **查看 GA4 实时报告**
   - 打开 https://analytics.google.com/
   - 选择你的媒体资源
   - 点击「报告」→「实时报告」
   - 应该能看到自己的访问（可能有 30-60 秒延迟）

---

## ✅ 成功标志

如果你看到以下内容，说明集成成功：

### 浏览器控制台
```
✅ [Analytics] GA4 已初始化
✅ [Analytics] 页面浏览: /
✅ [Analytics] 事件: use_template { template_name: '...', ... }
```

### GA4 实时报告
```
✅ 过去 30 分钟的用户数：1
✅ 位置：你的城市
✅ 事件：pageview, use_template 等
```

---

## ❌ 遇到问题？

### 问题 1：控制台显示「开发环境，GA4 未启用」

**原因**：默认在开发环境不启用追踪

**解决方案**：在 `.env.local` 添加：
```env
VITE_GA_ENABLE_DEV=true
```

然后重启服务器：
```bash
npm run dev
```

### 问题 2：GA4 实时报告看不到数据

**检查清单**：
- ✅ Measurement ID 是否正确？
- ✅ 浏览器控制台有 `[Analytics]` 日志吗？
- ✅ 浏览器是否安装广告拦截器？（暂时禁用）
- ✅ 是否点击了 Cookie 横幅的「接受」？
- ✅ 等待 1-2 分钟，数据有延迟

### 问题 3：Cookie 横幅不显示

**原因 1**：已经做过选择
```javascript
// 浏览器控制台执行
localStorage.removeItem('ga-consent');
location.reload();
```

**原因 2**：需要等待 2 秒
- Cookie 横幅延迟显示，避免干扰首次体验

### 问题 4：Network 中没有 GA4 请求

**检查步骤**：
1. 打开开发者工具 → Network 标签
2. 过滤：输入 `collect` 或 `google-analytics`
3. 执行操作（如使用模板）
4. 应该看到发送到 `www.google-analytics.com/g/collect` 的请求

如果没有请求：
- 检查 Measurement ID 是否正确
- 检查是否接受了 Cookie
- 检查浏览器扩展是否屏蔽了 GA

---

## 🎉 恭喜！

你已经成功集成 Google Analytics 4！

### 接下来可以：

1. **部署到生产环境**
   - 在部署平台配置环境变量
   - 使用生产环境的 Measurement ID

2. **查看更多报告**
   - 用户报告：了解访问趋势
   - 事件报告：查看功能使用排行
   - 流量来源：了解用户从哪里来

3. **创建自定义报告**
   - 最受欢迎的模板
   - 配置体检评分分布
   - 用户留存率

4. **优化产品**
   - 根据数据改进功能
   - 关注高频使用的功能
   - 修复用户体验问题

---

## 📚 延伸阅读

- [完整集成文档](./GA4_INTEGRATION.md)
- [配置检查清单](./GA4_CHECKLIST.md)
- [集成总结](./GA4_SUMMARY.md)

---

**需要帮助？** 查看 [常见问题](./GA4_INTEGRATION.md#❓-常见问题)
