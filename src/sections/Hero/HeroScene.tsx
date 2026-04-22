import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import SmokeMaterial from '../../components/SmokeMaterial';
import { FilmGrainEffect } from '../../components/FilmGrainEffect';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { DeviceTier } from '../../hooks/useDeviceTier';

interface HeroSceneProps {
  deviceTier: DeviceTier;
  scrollProgress: number;
  isVisible: boolean;
}

/**
 * Hero WebGL 场景
 * 包含烟雾 Shader + Film Grain + 橙红光晕
 */
export default function HeroScene({ deviceTier, scrollProgress, isVisible }: HeroSceneProps) {
  const prefersReducedMotion = useReducedMotion();

  // 根据设备层级和滚动调整烟雾不透明度
  const smokeOpacity = useMemo(() => {
    const scrollFade = Math.max(0, 1 - scrollProgress * 1.5);
    const tierFactor = deviceTier === 'simplified' ? 0.7 : 1.0;
    return scrollFade * tierFactor * (prefersReducedMotion ? 0.3 : 1.0);
  }, [scrollProgress, deviceTier, prefersReducedMotion]);

  // 不可见时不渲染
  if (!isVisible) return null;

  return (
    <Canvas
      dpr={deviceTier === 'full' ? [1, 2] : 1}
      camera={{ position: [0, 0, 1], fov: 60, near: 0.1, far: 10 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{
        antialias: deviceTier === 'full',
        alpha: true,
        powerPreference: deviceTier === 'full' ? 'high-performance' : 'default',
      }}
    >
      {/* 烟雾层 */}
      <SmokeMaterial
        opacity={smokeOpacity}
        deviceTier={deviceTier}
        scrollProgress={scrollProgress}
      />

      {/* 后处理效果 — 仅 full 层级启用 */}
      {deviceTier === 'full' && !prefersReducedMotion && (
        // @ts-expect-error R3F postprocessing type mismatch with React 19
        <EffectComposer disableNormalPass>
          <primitive object={new FilmGrainEffect()} />
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      )}

      {/* 右下角橙红光晕 — 简单球体模拟 */}
      <mesh position={[1.2, -1.0, -0.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color="#C9302C"
          transparent
          opacity={0.15 * smokeOpacity}
          blending={2}
        />
      </mesh>
    </Canvas>
  );
}
