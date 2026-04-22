import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion, useDeviceType } from '@/hooks';

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal scroll animation for the Process section on desktop.
 * Pins the section and scrubs through the horizontal timeline.
 * Mobile: vertical stacking (no pin).
 *
 * Key parameters:
 * - anticipatePin: 1 — Safari compatibility
 * - invalidateOnRefresh: true — handles resize properly
 */
export function useHorizontalScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  trackRef: React.RefObject<HTMLDivElement | null>,
): void {
  const reducedMotion = useReducedMotion();
  const deviceType = useDeviceType();

  useGSAP(
    () => {
      // Skip on mobile — vertical stacking handles layout
      if (deviceType === 'mobile' || reducedMotion) return;
      if (!containerRef.current || !trackRef.current) return;

      const ctx = gsap.context(() => {
        const track = trackRef.current!;
        const steps = track.querySelectorAll('.process-step');

        // Calculate total scroll width
        const totalWidth = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            // Key Safari compatibility params
            anticipatePin: 1,
            invalidateOnRefresh: true,
            end: () => `+=${totalWidth}`,
          },
        });

        // Animate individual steps as they come into view
        gsap.to(steps, {
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: track,
            containerAnimation: gsap.getById('horizontalScroll') ?? undefined,
            start: 'left center',
            toggleActions: 'play none none none',
          },
        });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef, dependencies: [deviceType, reducedMotion] },
  );
}
