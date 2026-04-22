import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef as _useRef } from 'react';
import { useReducedMotion } from '@/hooks';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP ScrollTrigger animation hook for the About section.
 * Text lines fade in with stagger; image gets a parallax effect.
 */
export function useAboutAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
): void {
  const { contextSafe: _contextSafe } = useGSAP(() => {}, { scope: sectionRef as React.RefObject<HTMLElement> });
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const ctx = gsap.context(() => {
        // Text lines fade in with stagger
        gsap.fromTo(
          '.about-text-line',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.about-text-wrapper',
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none none none',
            },
          },
        );

        // Image parallax effect
        gsap.to('.about-image-inner', {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-image-wrapper',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );
}
