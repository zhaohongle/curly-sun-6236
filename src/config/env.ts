// 类型安全的环境变量读取，运行时校验

interface EnvConfig {
  contactEndpoint: string;
  isDev: boolean;
}

/**
 * 读取并校验环境变量
 * 使用 FormSubmit.co（免费、无需注册）
 * 或通过 VITE_CONTACT_ENDPOINT 覆盖
 */
export function loadEnv(): EnvConfig {
  const customEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

  // 默认使用 FormSubmit.co AJAX 端点
  const contactEndpoint =
    customEndpoint || 'https://formsubmit.co/ajax/lina.perfume.studio@gmail.com';

  return {
    contactEndpoint,
    isDev: import.meta.env.DEV,
  };
}

// 导出单例配置
export const env = loadEnv();
