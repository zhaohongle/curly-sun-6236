import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks';

gsap.registerPlugin(ScrollTrigger);

/**
 * Clip-path reveal animation for the Works section.
 * Animates clip-path from left to right as the section enters viewport.
 */
export function useRevealAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
): void {
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const ctx = gsap.context(() => {
        // Section-wide clip-path reveal (left to right)
        gsap.fromTo(
          sectionRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Individual cards stagger fade-in after the reveal starts
        gsap.fromTo(
          '.works-card',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.works-grid',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );
}
