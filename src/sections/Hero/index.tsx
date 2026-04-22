import { useState, useEffect, useRef, useCallback } from 'react';
import HeroScene from './HeroScene';
import HeroOverlay from './HeroOverlay';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Hero 区域主组件
 * 
 * 三级降级体系（T-013）：
 * - full: 完整 shader + film grain + bloom
 * - simplified: 简化渲染 + 降低分辨率
 * - fallback: CSS 渐变 + CSS animation 模拟烟雾
 * 
 * 性能优化（T-016）：
 * - requestAnimationFrame 节流
 * Intersection Observer 不可见时暂停渲染
 * - 移动端降低 shader 分辨率
 */
export default function Hero() {
  const deviceTier = useDeviceTier();
  const prefersReducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollTime = useRef(0);

  // ===== 滚动监听 + requestAnimationFrame 节流 =====
  const handleScroll = useCallback(() => {
    const now = performance.now();
    // 节流：最多每 16ms (60fps) 更新一次
    if (now - lastScrollTime.current < 16) return;
    lastScrollTime.current = now;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // 滚动进度 0-1（当 Hero 滚出视口时为 1）
      const progress = Math.max(0, Math.min(1, -rect.top / windowHeight));
      setScrollProgress(progress);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // ===== Intersection Observer — 不可见时暂停渲染 =====
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // ===== 三级降级渲染 =====

  // Hero 底图 URL（Unsplash 免费商用 — 暗色调红色烟雾）
  const heroBgUrl = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80';

  // Fallback: CSS 渐变 + CSS animation 模拟烟雾
  if (deviceTier === 'fallback') {
    return (
      <section
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        aria-label="Hero section"
      >
        {/* 底图层 — 低透明度 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
        {/* CSS 烟雾模拟 */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 35% 80%, rgba(201, 48, 44, 0.15) 0%, transparent 70%),
              radial-gradient(ellipse 40% 60% at 40% 70%, rgba(139, 26, 26, 0.1) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 50% 90%, rgba(201, 48, 44, 0.08) 0%, transparent 50%),
              transparent
            `,
            animation: 'smokeFallback 8s ease-in-out infinite',
          }}
        />
        {/* 光晕 */}
        <div
          className="absolute bottom-20 right-20 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 48, 44, 0.2) 0%, transparent 70%)',
            animation: 'glowPulse 3s ease-in-out infinite',
          }}
        />
        <HeroOverlay scrollProgress={scrollProgress} />

        <style>{`
          @keyframes smokeFallback {
            0%, 100% { transform: scale(1) translate(0, 0); opacity: 1; }
            25% { transform: scale(1.02) translate(3px, -5px); }
            50% { transform: scale(1.01) translate(-2px, -8px); opacity: 0.85; }
            75% { transform: scale(1.03) translate(2px, -3px); }
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}</style>
      </section>
    );
  }

  // Simplified & Full: WebGL 渲染
  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
      aria-label="Hero section"
    >
      {/* 底图层 — 低透明度 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }}
      />

      {/* WebGL 场景 */}
      <HeroScene
        deviceTier={deviceTier}
        scrollProgress={scrollProgress}
        isVisible={isVisible}
      />

      {/* DOM 覆盖层 */}
      <HeroOverlay scrollProgress={scrollProgress} />
    </section>
  );
}
