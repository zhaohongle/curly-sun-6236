import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroOverlayProps {
  scrollProgress: number;
}

/**
 * Hero DOM 覆盖层
 * 大标题 + 副标题 + 向下滚动引导
 * 使用 split-type + GSAP 实现墨水晕开式文字动画
 */
export default function HeroOverlay({ scrollProgress }: HeroOverlayProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!titleRef.current || prefersReducedMotion) return;

    // 使用 split-type 拆分标题文字
    const splitTitle = new SplitType(titleRef.current, {
      types: 'chars,words',
    });

    // GSAP 文字动画 — 墨水晕开效果
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // 字母逐个从下方滑入 + 淡入，模拟墨水晕开
      tl.from(splitTitle.chars, {
        y: 60,
        opacity: 0,
        rotateX: -40,
        stagger: {
          each: 0.06,
          from: 'start',
        },
        duration: 1.2,
        ease: 'power4.out',
      });

      // 副标题延迟淡入
      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 1.0,
            ease: 'power2.out',
          },
          '-=0.4',
        );
      }

      // 滚动引导延迟出现
      if (scrollHintRef.current) {
        tl.from(
          scrollHintRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3',
        );
      }
    });

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      splitTitle.revert();
    };
  }, [prefersReducedMotion]);

  // 滚动视差 — 标题上移淡出 + 副标题延迟淡出
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 标题随滚动上移并淡出
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -scrollProgress * 120,
          opacity: Math.max(0, 1 - scrollProgress * 2),
          duration: 0, // 即时更新
        });
      }

      // 副标题延迟淡出
      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          y: -scrollProgress * 60,
          opacity: Math.max(0, 1 - scrollProgress * 2.5),
          duration: 0,
        });
      }

      // 滚动引导加速淡出
      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, {
          opacity: Math.max(0, 1 - scrollProgress * 3),
          y: -scrollProgress * 40,
          duration: 0,
        });
      }
    });

    return () => ctx.revert();
  }, [scrollProgress, prefersReducedMotion]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
      style={{ perspective: '1000px' }}
    >
      {/* 主标题 */}
      <h1
        ref={titleRef}
        className="font-serif text-7xl md:text-9xl text-cream tracking-wider text-center select-none"
        style={{
          textShadow: '0 0 60px rgba(201, 48, 44, 0.3)',
        }}
      >
        Lina
      </h1>

      {/* 副标题 */}
      <p
        ref={subtitleRef}
        className="font-cn-serif text-lg md:text-xl text-cream/70 mt-4 tracking-widest select-none"
      >
        東方草本・調香
      </p>

      {/* 向下滚动引导 */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="text-cream/40 text-xs tracking-widest font-sans uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-cinnabar/60 to-transparent animate-bounce" />
      </div>
    </div>
  );
}
