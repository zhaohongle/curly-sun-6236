import { useState, useEffect } from 'react';

export type DeviceTier = 'full' | 'simplified' | 'fallback';

interface WebGLInfo {
  renderer: string;
  vendor: string;
}

/**
 * 检测设备 GPU 能力，返回渲染层级
 * - full: 支持完整 WebGL2 + 高性能 GPU
 * - simplified: 支持 WebGL 但性能有限（移动设备/集成显卡）
 * - fallback: 不支持 WebGL 或极低端设备
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('fallback');

  useEffect(() => {
    let detected: DeviceTier = 'fallback';

    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

      if (!gl) {
        setTier('fallback');
        return;
      }

      const glContext = gl as WebGLRenderingContext;
      const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : '';

      // 检测是否为移动设备或低端 GPU
      const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
      const isLowEnd = /Adreno [3-5]\d\d|Mali-[GT]6\d|PowerVR/i.test(renderer);

      if (isLowEnd || (isMobile && !/Adreno [7-9]\d\d|Mali-[GT]7\d/i.test(renderer))) {
        detected = 'simplified';
      } else {
        detected = 'full';
      }
    } catch {
      detected = 'fallback';
    }

    setTier(detected);
  }, []);

  return tier;
}
