// 类型安全的环境变量读取，运行时校验

interface EnvConfig {
  formspreeEndpoint: string;
  isDev: boolean;
}

/**
 * 读取并校验环境变量
 * 在运行时检查关键配置是否完整
 */
export function loadEnv(): EnvConfig {
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  // 校验 Formspree 端点（非生产环境下仅警告）
  if (!formspreeEndpoint || formspreeEndpoint.includes('your-form-id')) {
    if (import.meta.env.PROD) {
      throw new Error(
        'VITE_FORMSPREE_ENDPOINT is not configured. Set it in your environment variables.',
      );
    } else {
      console.warn(
        '[ENV] VITE_FORMSPREE_ENDPOINT is not set. Contact form will not work.',
      );
    }
  }

  return {
    formspreeEndpoint: formspreeEndpoint || '',
    isDev: import.meta.env.DEV,
  };
}

// 导出单例配置
export const env = loadEnv();
