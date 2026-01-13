# Google Analytics 4 集成文档

## 📊 功能概述

本项目已完整集成 Google Analytics 4 (GA4)，用于统计生产环境的访问量、用户行为和功能使用情况。

## 🚀 快速开始

### 步骤 1：创建 GA4 账号

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 点击「开始衡量」或「创建媒体资源」
3. 按照向导创建账号和媒体资源
4. 选择平台类型：**网站**
5. 获取你的 **Measurement ID**（格式：`G-XXXXXXXXXX`）

### 步骤 2：配置 Measurement ID

#### 方法 1：使用环境变量（推荐）

1. 复制 `.env.example` 为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local`，替换 Measurement ID：
   ```env
   VITE_GA_MEASUREMENT_ID=G-YOUR-REAL-ID
   
   # 可选：控制 Cookie 横幅显示（默认 true）
   VITE_ENABLE_COOKIE_CONSENT=true
   ```

3. 重启开发服务器：
   ```bash
   npm run dev
   ```

#### 方法 2：直接修改代码

编辑 `src/utils/analytics.ts`，将第 4 行的 `G-XXXXXXXXXX` 替换为你的 ID：

```typescript
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-YOUR-REAL-ID';
```

### 步骤 3：测试集成

1. 启动开发服务器
2. 打开浏览器开发者工具（F12）
3. 查看控制台，应该能看到：
   ```
   [Analytics] GA4 已初始化
   [Analytics] 页面浏览: /
   ```

4. 访问 GA4 后台 → 报告 → 实时报告
5. 应该能看到自己的访问（可能有 30-60 秒延迟）

## 📈 追踪的事件

### 核心功能事件

| 事件名称 | 触发时机 | 追踪参数 |
|---------|---------|---------|
| `add_node` | 添加节点 | `node_type`: server/location/upstream |
| `use_template` | 使用模板 | `template_name`, `template_category` |
| `export_config` | 导出配置 | `export_format`: nginx/dockerfile |
| `copy_config` | 复制配置 | - |
| `import_config` | 导入配置 | `success`, `error_message` |
| `run_audit` | 运行配置体检 | `audit_score`, `issues_count`, `grade` |
| `auto_fix` | 自动修复 | `issues_fixed`, `fix_types` |
| `switch_language` | 切换语言 | `from_language`, `to_language` |
| `auto_layout` | 自动布局 | - |
| `simulate_traffic` | 流量模拟 | `url`, `matched` |
| `time_spent` | 用户停留时长 | `duration_seconds`, `duration_minutes` |

### 页面浏览事件

- 自动追踪所有页面访问
- 记录页面路径和标题

### 异常事件

- 自动捕获 JavaScript 错误
- 追踪应用崩溃和异常

## 🔒 隐私与合规

### GDPR 合规

本集成完全符合 GDPR 要求：

✅ **Cookie 同意横幅**：首次访问时显示，用户可选择接受或拒绝  
✅ **IP 匿名化**：自动对用户 IP 进行匿名处理  
✅ **透明度**：清楚说明数据收集目的  
✅ **用户控制**：用户可随时撤回同意

### 横幅行为

- 首次访问延迟 2 秒后显示
- 选择「接受」：保存同意状态，初始化 GA4
- 选择「拒绝」：不收集任何数据
- 选择「暂不决定」：暂时关闭，下次访问仍会显示

**环境变量控制：**
```env
# 不显示横幕，但依然收集 GA4 数据（适合中国用户）
VITE_ENABLE_COOKIE_CONSENT=false

# 显示 GDPR 合规横幕，用户同意后才收集数据（默认行为）
VITE_ENABLE_COOKIE_CONSENT=true
```

**使用场景：**
- `false`: 适合中国用户、内网部署、不需要 GDPR 合规的场景
- `true`: 适合面向欧盟用户、需要 GDPR 合规的场景

### 本地存储

使用 `localStorage` 保存用户选择：

```javascript
localStorage.getItem('ga-consent') // 'accepted' | 'declined' | null
```

## 📊 GA4 后台使用指南

### 实时报告

查看路径：**报告 → 实时报告**

可以看到：
- 当前在线用户数
- 实时事件流
- 用户地理位置
- 使用的设备和浏览器

### 事件报告

查看路径：**报告 → 互动 → 事件**

可以看到：
- 所有事件的触发次数
- 事件参数详情
- 事件转化漏斗

### 自定义报告

#### 查看最受欢迎的模板

1. 进入「探索」→ 创建新探索
2. 选择「自由形式」
3. 维度：`event_name`, `template_name`
4. 指标：`事件计数`
5. 筛选器：`event_name = use_template`

#### 查看功能使用情况

1. 维度：`event_name`
2. 指标：`事件计数`, `用户数`
3. 排序：按事件计数降序

#### 查看配置体检评分分布

1. 维度：`grade`
2. 指标：`事件计数`
3. 筛选器：`event_name = run_audit`

## 🛠️ 开发指南

### 添加新的事件追踪

在 `src/utils/analytics.ts` 中添加方法：

```typescript
/**
 * 追踪新功能
 */
trackNewFeature(param1: string, param2: number) {
  this.trackEvent('new_feature', {
    param1,
    param2,
    category: 'New Feature Category',
  });
}
```

在组件中使用：

```typescript
import { analytics } from '@/utils/analytics';

const handleNewFeature = () => {
  // 执行功能逻辑
  doSomething();
  
  // 追踪事件
  analytics.trackNewFeature('value1', 123);
};
```

### 调试模式

启用调试模式查看详细日志：

```typescript
// src/utils/analytics.ts
ReactGA.initialize(MEASUREMENT_ID, {
  gaOptions: {
    debug_mode: true, // 启用调试
  },
});
```

### 测试模式

在开发环境启用 GA4（默认关闭）：

```env
# .env.local
VITE_GA_ENABLE_DEV=true
```

## 🎯 最佳实践

### 1. 事件命名规范

- 使用小写字母和下划线：`use_template` ✅，`UseTemplate` ❌
- 动词开头：`add_node`, `export_config`
- 保持简洁：不超过 40 字符

### 2. 参数设计

```typescript
// ✅ 推荐
analytics.trackEvent('export_config', {
  format: 'nginx',
  size_kb: 12.5,
});

// ❌ 不推荐（参数过多）
analytics.trackEvent('export_config', {
  format: 'nginx',
  timestamp: Date.now(),
  user_agent: navigator.userAgent,
  // ... 过多参数
});
```

### 3. 避免追踪敏感信息

❌ **不要追踪**：
- 用户邮箱、密码
- IP 地址（已自动匿名化）
- 个人身份信息（PII）

✅ **可以追踪**：
- 功能使用情况
- 配置文件结构（非内容）
- 用户行为路径

## 🚀 生产部署

### 环境变量配置

#### Vercel / Netlify

在部署平台添加环境变量：

```
VITE_GA_MEASUREMENT_ID = G-YOUR-PRODUCTION-ID
```

#### 自建服务器

在服务器上创建 `.env.production`：

```env
VITE_GA_MEASUREMENT_ID=G-YOUR-PRODUCTION-ID
```

构建时会自动读取：

```bash
npm run build
```

### 验证部署

1. 访问生产环境网站
2. 打开浏览器开发者工具
3. 查看 Network 标签，过滤 `google-analytics.com`
4. 应该能看到发送的请求
5. 检查 GA4 实时报告确认数据

## 📚 参考资源

- [Google Analytics 4 官方文档](https://developers.google.com/analytics/devguides/collection/ga4)
- [react-ga4 文档](https://github.com/PriceRunner/react-ga4)
- [GA4 事件参考](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GDPR 合规指南](https://support.google.com/analytics/answer/9019185)

## ❓ 常见问题

### Q: 为什么实时报告看不到数据？

A: 
- 检查 Measurement ID 是否正确
- 确认浏览器没有安装广告拦截器
- GA4 数据有 30-60 秒延迟
- 查看浏览器控制台是否有错误

### Q: 开发环境能看到追踪吗？

A: 默认关闭。设置 `VITE_GA_ENABLE_DEV=true` 启用。

### Q: 如何临时禁用 GA4？

A: 有两种方法：

**方法 1：设置无效的 Measurement ID（完全禁用）**
```env
# .env.local
VITE_GA_MEASUREMENT_ID=G-DISABLED
```

**方法 2：保持数据收集但关闭横幅**
```env
# .env.local
VITE_ENABLE_COOKIE_CONSENT=false
```

### Q: 中国用户需要 Cookie 横幅吗？

A: 不需要。Cookie 横幅是 GDPR（欧盟数据保护条例）要求的。如果你的用户都是中国用户，可以设置：

```env
# .env.local
VITE_ENABLE_COOKIE_CONSENT=false
```

这样会：
- ✅ 不显示 Cookie 横幅
- ✅ 直接收集 GA4 数据
- ✅ 用户体验更流畅（无弹窗干扰）

### Q: 如何在开发环境关闭 Cookie 横幅？

A: 编辑 `.env.local`：
```env
VITE_ENABLE_COOKIE_CONSENT=false
```
刷新页面后横幅将不再显示，但仍然会收集数据。

### Q: Cookie 横幅可以自定义样式吗？

A: 可以。编辑 `src/components/CookieConsent.tsx` 修改样式和文案。

## 📞 支持

如有问题，请查看：
- 项目 GitHub Issues
- Google Analytics 帮助中心
- React GA4 GitHub 仓库
