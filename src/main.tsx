import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { analytics } from "./utils/analytics";

// 初始化 Google Analytics 4
// 注意：实际初始化会在 CookieConsent 组件中处理
// - 如果 VITE_ENABLE_COOKIE_CONSENT=false，直接初始化（不显示横幅）
// - 如果启用横幅，根据用户同意状态初始化
// 这里仅处理用户已同意的情况（避免重复初始化）
const isCookieConsentEnabled = import.meta.env.VITE_ENABLE_COOKIE_CONSENT !== 'false';
const gaConsent = localStorage.getItem('ga-consent');

if (isCookieConsentEnabled && gaConsent === 'accepted') {
  analytics.init();
  // 追踪首次页面加载
  analytics.pageView(window.location.pathname + window.location.search);
}

// 追踪用户停留时长
const startTime = Date.now();
window.addEventListener('beforeunload', () => {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  if (timeSpent > 5) { // 只追踪停留超过 5 秒的用户
    analytics.trackTimeSpent(timeSpent);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
