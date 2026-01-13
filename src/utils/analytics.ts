import ReactGA from 'react-ga4';

// 替换为你的 Google Analytics Measurement ID
// 格式：G-XXXXXXXXXX
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

class Analytics {
  private initialized = false;

  /**
   * 初始化 Google Analytics 4
   * 只会初始化一次，避免重复初始化
   */
  init() {
    if (this.initialized) return;
    
    // 仅在生产环境或显式启用时初始化
    if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_GA_ENABLE_DEV) {
      console.log('[Analytics] 开发环境，GA4 未启用');
      return;
    }

    try {
      ReactGA.initialize(MEASUREMENT_ID, {
        gaOptions: {
          // 禁用自动发送页面浏览（手动控制）
          send_page_view: false,
        },
        gtagOptions: {
          // 匿名化 IP 地址（GDPR 合规）
          anonymize_ip: true,
          // Cookie 有效期（天）
          cookie_expires: 63072000, // 2 年
        },
      });
      
      this.initialized = true;
      console.log('[Analytics] GA4 已初始化');
    } catch (error) {
      console.error('[Analytics] GA4 初始化失败:', error);
    }
  }

  /**
   * 判断是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 页面浏览追踪
   */
  pageView(path: string, title?: string) {
    if (!this.initialized) return;
    
    try {
      ReactGA.send({ 
        hitType: 'pageview', 
        page: path, 
        title: title || document.title 
      });
      console.log(`[Analytics] 页面浏览: ${path}`);
    } catch (error) {
      console.error('[Analytics] 页面浏览追踪失败:', error);
    }
  }

  /**
   * 事件追踪（推荐使用此方法）
   */
  trackEvent(eventName: string, params?: Record<string, any>) {
    if (!this.initialized) return;
    
    try {
      ReactGA.event(eventName, params);
      console.log(`[Analytics] 事件: ${eventName}`, params);
    } catch (error) {
      console.error('[Analytics] 事件追踪失败:', error);
    }
  }

  // ========== 节点操作追踪 ==========

  /**
   * 追踪添加节点
   */
  trackNodeAdd(nodeType: 'server' | 'location' | 'upstream') {
    this.trackEvent('add_node', {
      node_type: nodeType,
      category: 'Node Operation',
    });
  }

  /**
   * 追踪删除节点
   */
  trackNodeDelete(nodeType: 'server' | 'location' | 'upstream', count: number = 1) {
    this.trackEvent('delete_node', {
      node_type: nodeType,
      count,
      category: 'Node Operation',
    });
  }

  /**
   * 追踪节点连接
   */
  trackNodeConnect(sourceType: string, targetType: string) {
    this.trackEvent('connect_nodes', {
      source_type: sourceType,
      target_type: targetType,
      category: 'Node Operation',
    });
  }

  // ========== 模板操作追踪 ==========

  /**
   * 追踪使用模板
   */
  trackTemplateUse(templateName: string, templateCategory?: string) {
    this.trackEvent('use_template', {
      template_name: templateName,
      template_category: templateCategory,
      category: 'Template',
    });
  }

  /**
   * 追踪打开模板库
   */
  trackTemplateLibraryOpen() {
    this.trackEvent('open_template_library', {
      category: 'Template',
    });
  }

  // ========== 配置操作追踪 ==========

  /**
   * 追踪配置导出
   */
  trackConfigExport(format: 'nginx' | 'dockerfile') {
    this.trackEvent('export_config', {
      export_format: format,
      category: 'Config Operation',
    });
  }

  /**
   * 追踪配置导入
   */
  trackConfigImport(success: boolean, errorMessage?: string) {
    this.trackEvent('import_config', {
      success,
      error_message: errorMessage,
      category: 'Config Operation',
    });
  }

  /**
   * 追踪配置复制
   */
  trackConfigCopy() {
    this.trackEvent('copy_config', {
      category: 'Config Operation',
    });
  }

  /**
   * 追踪配置清空
   */
  trackConfigClear() {
    this.trackEvent('clear_config', {
      category: 'Config Operation',
    });
  }

  // ========== 配置体检追踪 ==========

  /**
   * 追踪配置体检运行
   */
  trackAuditRun(score: number, issuesCount: number, grade: string) {
    this.trackEvent('run_audit', {
      audit_score: score,
      issues_count: issuesCount,
      grade,
      category: 'Audit',
    });
  }

  /**
   * 追踪自动修复
   */
  trackAutoFix(issuesFixed: number, fixTypes: string[]) {
    this.trackEvent('auto_fix', {
      issues_fixed: issuesFixed,
      fix_types: fixTypes.join(','),
      category: 'Audit',
    });
  }

  // ========== 语言切换追踪 ==========

  /**
   * 追踪语言切换
   */
  trackLanguageSwitch(fromLang: string, toLang: string) {
    this.trackEvent('switch_language', {
      from_language: fromLang,
      to_language: toLang,
      category: 'UI Operation',
    });
  }

  // ========== 布局操作追踪 ==========

  /**
   * 追踪自动布局
   */
  trackAutoLayout() {
    this.trackEvent('auto_layout', {
      category: 'Canvas Operation',
    });
  }

  /**
   * 追踪缩放操作
   */
  trackZoom(zoomLevel: number) {
    this.trackEvent('canvas_zoom', {
      zoom_level: zoomLevel,
      category: 'Canvas Operation',
    });
  }

  // ========== 流量模拟器追踪 ==========

  /**
   * 追踪流量模拟
   */
  trackTrafficSimulation(url: string, matched: boolean) {
    this.trackEvent('simulate_traffic', {
      url,
      matched,
      category: 'Traffic Simulator',
    });
  }

  // ========== 用户行为追踪 ==========

  /**
   * 追踪用户停留时长（离开时调用）
   */
  trackTimeSpent(seconds: number) {
    this.trackEvent('time_spent', {
      duration_seconds: seconds,
      duration_minutes: Math.round(seconds / 60),
      category: 'User Behavior',
    });
  }

  /**
   * 追踪搜索操作
   */
  trackSearch(searchTerm: string, resultCount: number) {
    this.trackEvent('search', {
      search_term: searchTerm,
      result_count: resultCount,
      category: 'Search',
    });
  }

  // ========== 异常追踪 ==========

  /**
   * 追踪异常/错误
   */
  trackException(description: string, fatal: boolean = false) {
    if (!this.initialized) return;
    
    try {
      ReactGA.gtag('event', 'exception', {
        description,
        fatal,
      });
      console.log(`[Analytics] 异常: ${description} (fatal: ${fatal})`);
    } catch (error) {
      console.error('[Analytics] 异常追踪失败:', error);
    }
  }

  // ========== 用户属性设置 ==========

  /**
   * 设置用户属性
   */
  setUserProperty(name: string, value: any) {
    if (!this.initialized) return;
    
    try {
      ReactGA.gtag('set', 'user_properties', {
        [name]: value,
      });
      console.log(`[Analytics] 用户属性: ${name} = ${value}`);
    } catch (error) {
      console.error('[Analytics] 用户属性设置失败:', error);
    }
  }

  /**
   * 设置用户 ID（用于跨设备追踪）
   */
  setUserId(userId: string) {
    if (!this.initialized) return;
    
    try {
      ReactGA.gtag('config', MEASUREMENT_ID, {
        user_id: userId,
      });
      console.log(`[Analytics] 用户 ID: ${userId}`);
    } catch (error) {
      console.error('[Analytics] 用户 ID 设置失败:', error);
    }
  }

  // ========== 转化追踪 ==========

  /**
   * 追踪转化目标
   */
  trackConversion(goalName: string, value?: number) {
    this.trackEvent('conversion', {
      goal_name: goalName,
      value,
      category: 'Conversion',
    });
  }
}

// 导出单例
export const analytics = new Analytics();
