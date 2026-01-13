import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';
import { Cookie, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

  // 检查是否启用 Cookie 同意横幅
  const isCookieConsentEnabled = import.meta.env.VITE_ENABLE_COOKIE_CONSENT !== 'false';

  useEffect(() => {
    // 如果未启用 Cookie 横幅，直接初始化 GA4（不显示横幅但收集数据）
    if (!isCookieConsentEnabled) {
      analytics.init();
      analytics.pageView(window.location.pathname + window.location.search);
      return;
    }

    // 检查用户是否已经做出过选择
    const consent = localStorage.getItem('ga-consent');
    if (!consent) {
      // 延迟显示横幅，避免干扰用户初次体验
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    } else if (consent === 'accepted') {
      // 如果用户之前已同意，初始化 GA4
      analytics.init();
      analytics.pageView(window.location.pathname + window.location.search);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('ga-consent', 'accepted');
    analytics.init();
    analytics.pageView(window.location.pathname + window.location.search);
    
    // 设置用户属性
    analytics.setUserProperty('consent_given', true);
    analytics.setUserProperty('consent_date', new Date().toISOString());
    
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('ga-consent', 'declined');
    setShowBanner(false);
  };

  const dismissBanner = () => {
    // 暂时关闭横幅，但下次访问时仍会显示
    setShowBanner(false);
  };

  // 如果未启用 Cookie 横幅功能，不渲染任何内容
  if (!isCookieConsentEnabled || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card/95 backdrop-blur-sm border-t border-border shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Icon & Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'zh' ? '🍪 Cookie 使用说明' : '🍪 Cookie Notice'}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === 'zh' ? (
                    <>
                      我们使用 Cookie 和 Google Analytics 来改善您的体验并分析网站流量。
                      这些数据帮助我们了解哪些功能最受欢迎，以便提供更好的服务。
                      您的隐私对我们非常重要，所有数据都会匿名处理。
                    </>
                  ) : (
                    <>
                      We use cookies and Google Analytics to improve your experience and analyze site traffic.
                      This data helps us understand which features are most popular so we can provide better service.
                      Your privacy is important to us, and all data is processed anonymously.
                    </>
                  )}
                </p>
                {/* Privacy Policy Link */}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 inline-block"
                >
                  {language === 'zh' ? '查看 Google Analytics 隐私政策 ↗' : 'View Google Analytics Privacy Policy ↗'}
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissBanner}
                className="h-9 px-3"
              >
                <X className="w-4 h-4 mr-1" />
                {language === 'zh' ? '暂不决定' : 'Not Now'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={declineCookies}
                className="h-9 px-4"
              >
                {language === 'zh' ? '拒绝' : 'Decline'}
              </Button>
              <Button
                size="sm"
                onClick={acceptCookies}
                className="h-9 px-4 bg-primary hover:bg-primary/90"
              >
                {language === 'zh' ? '接受' : 'Accept'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
