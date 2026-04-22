import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useReducedMotion } from '@/hooks';
import { works } from '@/config';
import { WorkCard } from './WorkCard';
import { useRevealAnimation } from './useRevealAnimation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Works section — perfume work cards grid.
 * Desktop: 3 columns, Tablet: 2 columns, Mobile: 1 column.
 */
export function Works(): React.ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // Clip-path reveal animation on section enter
  useRevealAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden"
      style={{ backgroundColor: '#0A0A0A', color: '#F5F0E8' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: '#C9302C' }}
          >
            Collection
          </p>
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            作品
          </h2>
        </div>

        {/* Works grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {works.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
