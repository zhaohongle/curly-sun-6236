import { useRef } from 'react';
import { processSteps } from '@/config';
import { TimelineItem } from './TimelineItem';
import { useHorizontalScroll } from './useHorizontalScroll';

/**
 * Process section — bespoke perfume creation workflow.
 * Desktop: horizontal scroll with GSAP pin + scrub.
 * Mobile: vertical stacking (no pin).
 */
export function Process(): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(containerRef, trackRef);

  return (
    <section
      id="process"
      className="relative w-full py-24 md:py-0 overflow-hidden"
      style={{ backgroundColor: '#0A0A0A', color: '#F5F0E8' }}
    >
      {/* Section header (always visible) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: '#C9302C' }}
        >
          Process
        </p>
        <h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          定制流程
        </h2>
        <p
          className="mt-4 max-w-lg text-sm leading-relaxed"
          style={{ color: 'rgba(245,240,232,0.6)', fontFamily: "'Noto Serif SC', serif" }}
        >
          从初次对话到最终交付，每一步都是与你共同创作的过程。
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div ref={containerRef} className="relative">
        {/* Scroll hint for desktop */}
        <div
          className="hidden md:flex items-center gap-2 px-6 md:px-12 lg:px-16 pb-6"
          style={{ color: 'rgba(245,240,232,0.3)', fontSize: '0.75rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <span>Scroll to explore</span>
        </div>

        {/* Timeline track */}
        <div
          ref={trackRef}
          className="flex md:flex-row flex-col gap-4 md:gap-0 px-6 md:px-12 lg:px-16 pb-24 md:pb-16 md:whitespace-nowrap"
        >
          {processSteps.map((step, index) => (
            <TimelineItem
              key={step.id}
              step={step}
              index={index}
              isLast={index === processSteps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
