# 🎨 Google Analytics 4 集成架构

## 📊 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户浏览器                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    React 应用                           │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │ TemplateLib  │  │ AuditPanel   │  │ ConfigPreview│ │    │
│  │  │              │  │              │  │              │ │    │
│  │  │ trackTemplate│  │ trackAudit   │  │ trackExport  │ │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │    │
│  │         │                  │                  │         │    │
│  │         └──────────────────┼──────────────────┘         │    │
│  │                            ▼                            │    │
│  │                  ┌──────────────────┐                  │    │
│  │                  │  analytics.ts    │                  │    │
│  │                  │  (封装层)        │                  │    │
│  │                  └─────────┬────────┘                  │    │
│  │                            │                            │    │
│  │                            ▼                            │    │
│  │                  ┌──────────────────┐                  │    │
│  │                  │   react-ga4      │                  │    │
│  │                  │   (GA4 SDK)      │                  │    │
│  │                  └─────────┬────────┘                  │    │
│  └────────────────────────────┼─────────────────────────┘    │
│                                │                               │
│  ┌─────────────────────────────┼──────────────────────────┐   │
│  │                             ▼                           │   │
│  │                   Cookie 同意状态                       │   │
│  │                 localStorage.ga-consent                 │   │
│  │                  (accepted/declined)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google Analytics 服务器                       │
│                   www.google-analytics.com                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  数据处理管道                           │    │
│  │                                                         │    │
│  │  原始事件 → 去重 → 聚合 → 存储 → 报告                  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       GA4 后台界面                               │
│                   analytics.google.com                          │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │实时报告 │  │事件报告 │  │用户报告 │  │转化报告 │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 事件追踪流程

```
用户操作
   │
   ├─ 点击「使用模板」
   │     │
   │     ▼
   │  TemplateLibrary.tsx
   │  handleApplyTemplate()
   │     │
   │     ▼
   │  analytics.trackTemplateUse(name, category)
   │     │
   │     ▼
   │  analytics.ts
   │  trackEvent('use_template', { template_name, template_category })
   │     │
   │     ▼
   │  react-ga4
   │  ReactGA.event('use_template', {...})
   │     │
   │     ▼
   │  发送 HTTP 请求
   │  POST https://www.google-analytics.com/g/collect
   │     │
   │     ▼
   │  Google Analytics 服务器接收
   │     │
   │     ▼
   │  数据处理（30-60秒）
   │     │
   │     ▼
   │  GA4 后台显示
   │  实时报告 / 事件报告
```

---

## 🍪 Cookie 同意流程

```
                    用户首次访问
                         │
                         ▼
              localStorage.getItem('ga-consent')
                         │
           ┌─────────────┼─────────────┐
           │             │             │
        null         'accepted'    'declined'
           │             │             │
           ▼             ▼             ▼
    延迟 2 秒      直接初始化 GA4    不初始化
    显示横幅            │
           │             │
    ┌──────┴──────┐     │
    │             │     │
    ▼             ▼     │
 「接受」     「拒绝」   │
    │             │     │
    ▼             ▼     │
 存储状态     存储状态   │
'accepted'  'declined'  │
    │             │     │
    ▼             │     │
初始化 GA4        │     │
    │             │     │
    └─────────────┴─────┘
              │
              ▼
        开始追踪事件
    （仅当 accepted 时）
```

---

## 📦 文件依赖关系

```
src/
├── main.tsx
│   ├── import analytics
│   ├── 检查 localStorage.ga-consent
│   └── 条件初始化 GA4
│
├── App.tsx
│   └── 渲染 <CookieConsent />
│
├── components/
│   ├── CookieConsent.tsx
│   │   ├── 显示同意横幅
│   │   ├── 处理用户选择
│   │   └── 调用 analytics.init()
│   │
│   ├── TemplateLibrary.tsx
│   │   ├── import analytics
│   │   └── analytics.trackTemplateUse()
│   │
│   ├── AuditPanel.tsx
│   │   ├── import analytics
│   │   ├── analytics.trackAuditRun()
│   │   └── analytics.trackAutoFix()
│   │
│   └── preview/ConfigPreview.tsx
│       ├── import analytics
│       ├── analytics.trackConfigCopy()
│       └── analytics.trackConfigExport()
│
└── utils/
    └── analytics.ts
        ├── import ReactGA from 'react-ga4'
        ├── class Analytics { ... }
        └── export const analytics = new Analytics()
```

---

## 🔐 隐私保护层级

```
第 1 层：用户同意
   ↓
仅在用户点击「接受」后初始化
localStorage.ga-consent = 'accepted'

第 2 层：IP 匿名化
   ↓
配置 anonymize_ip: true
Google 自动截断最后 8 位 IP

第 3 层：数据最小化
   ↓
只收集必要的事件和参数
不追踪敏感信息（密码、邮箱）

第 4 层：用户控制
   ↓
用户可随时清除 Cookie
localStorage.removeItem('ga-consent')

第 5 层：数据保留策略
   ↓
GA4 默认保留 14 个月
可在后台配置缩短
```

---

## 📊 数据流向

```
┌─────────────────────┐
│   用户操作事件      │
│  - 点击按钮         │
│  - 使用功能         │
│  - 页面浏览         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  前端 analytics.ts  │
│  - 封装事件         │
│  - 添加参数         │
│  - 调用 react-ga4   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    react-ga4 库     │
│  - 构建请求         │
│  - 批量发送         │
│  - 错误处理         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Google 收集服务器  │
│  /g/collect 端点    │
│  - 接收事件         │
│  - 验证格式         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   数据处理管道      │
│  - 去重             │
│  - 聚合             │
│  - 存储             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   BigQuery 存储     │
│  (可选，导出用)     │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│    GA4 后台报告     │
│  - 实时报告         │
│  - 事件报告         │
│  - 用户报告         │
└─────────────────────┘
```

---

## 🎯 事件参数结构

```javascript
// 示例：使用模板事件
{
  event_name: 'use_template',
  event_params: {
    template_name: 'React/Vue SPA',
    template_category: 'frontend',
    category: 'Template'
  },
  // GA4 自动添加的参数
  user_id: null,  // 未设置
  session_id: '1234567890',
  timestamp: 1673612345678,
  page_location: 'http://localhost:5173/',
  page_title: 'Nginx Config Editor',
  user_agent: 'Mozilla/5.0...',
  screen_resolution: '1920x1080',
  language: 'zh-CN'
}
```

---

## 🔍 调试流程

```
开发环境
   │
   ├─ .env.local
   │  VITE_GA_MEASUREMENT_ID=G-XXX
   │  VITE_GA_ENABLE_DEV=true  (可选)
   │
   ▼
npm run dev
   │
   ▼
浏览器控制台
   │
   ├─ [Analytics] GA4 已初始化 ✅
   ├─ [Analytics] 页面浏览: / ✅
   └─ [Analytics] 事件: use_template {...} ✅
   │
   ▼
Network 标签
   │
   └─ POST /g/collect
      Status: 204 No Content ✅
   │
   ▼
GA4 实时报告
   │
   └─ 过去 30 分钟的用户数: 1 ✅
```

---

## 🚀 生产部署流程

```
本地开发
   │
   ▼
git commit & push
   │
   ▼
部署平台 (Vercel/Netlify)
   │
   ├─ 配置环境变量
   │  VITE_GA_MEASUREMENT_ID=G-PRODUCTION-ID
   │
   ▼
npm run build
   │
   ├─ Vite 打包
   ├─ 环境变量注入
   └─ 生成静态文件
   │
   ▼
CDN 部署
   │
   └─ dist/assets/*.js
      (包含 GA4 代码)
   │
   ▼
用户访问生产环境
   │
   └─ 发送真实数据到 GA4
```

---

## 📈 数据流量估算

```
假设：每天 1000 个用户

每个用户平均触发事件：
- 1 次页面浏览
- 2 次功能使用（模板、导出等）
- 1 次停留时长
-----------------------
= 4 个事件/用户

每天总事件数：
1000 用户 × 4 事件 = 4,000 事件/天

每月总事件数：
4,000 × 30 = 120,000 事件/月

GA4 免费额度：
10,000,000 事件/月 ✅ 完全够用！
```

---

## 🎓 学习路径

```
1. 快速开始 (5 分钟)
   ├─ 创建 GA4 账号
   ├─ 配置 Measurement ID
   └─ 测试集成

2. 基础使用 (1 天)
   ├─ 查看实时报告
   ├─ 理解事件结构
   └─ 探索后台功能

3. 进阶分析 (1 周)
   ├─ 创建自定义报告
   ├─ 设置转化目标
   └─ 分析用户行为

4. 高级优化 (持续)
   ├─ A/B 测试
   ├─ 用户细分
   ├─ 预测分析
   └─ BigQuery 导出
```

---

**返回文档首页：** [README](./README.md)
