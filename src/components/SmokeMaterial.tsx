import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import smokeVertexShader from '../shaders/smoke.vert';
import smokeFragmentShader from '../shaders/smoke.frag';

interface SmokeMaterialProps {
  /** 整体不透明度 0-1 */
  opacity?: number;
  /** 设备层级，用于降级渲染 */
  deviceTier?: 'full' | 'simplified' | 'fallback';
  /** 滚动进度 0-1 */
  scrollProgress?: number;
}

/**
 * 烟雾 ShaderMaterial 封装
 * 使用 ray marching 实现 volumetric smoke 效果
 */
export default function SmokeMaterial({
  opacity = 1.0,
  deviceTier = 'full',
  scrollProgress = 0,
}: SmokeMaterialProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  // 根据设备层级调整分辨率比例
  const dpr = useMemo(() => {
    switch (deviceTier) {
      case 'full':
        return Math.min(window.devicePixelRatio, 2);
      case 'simplified':
        return 1;
      default:
        return 0.5;
    }
  }, [deviceTier]);

  // 创建 uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width * dpr, size.height * dpr) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: scrollProgress },
      uOpacity: { value: opacity },
    }),
    [size.width, size.height, dpr, opacity, scrollProgress],
  );

  // 创建 ShaderMaterial
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    return mat;
  }, [uniforms]);

  // 动画循环
  useFrame((_state, delta) => {
    if (!material) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uScroll.value = scrollProgress;
    material.uniforms.uOpacity.value = opacity;
  });

  // 窗口大小变化时更新分辨率
  useEffect(() => {
    if (material) {
      material.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
    }
  }, [size.width, size.height, dpr, material]);

  // 组件卸载时 dispose
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[4, 4, 1, 1]} />
    </mesh>
  );
}
