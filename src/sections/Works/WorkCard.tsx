import type { Work } from '@/types';

interface WorkCardProps {
  work: Work;
  index: number;
}

/**
 * WorkCard — single perfume work card.
 * Hover reveals fragrance notes (top / heart / base).
 */
export function WorkCard({ work, index }: WorkCardProps): React.ReactNode {
  return (
    <article
      className="group relative overflow-hidden cursor-none"
      style={{
        // Stagger reveal animation delay per card
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Card image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
        <img
          src={work.image}
          alt={work.nameEn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'grayscale(30%)' }}
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-80"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Card info (always visible) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-1"
          style={{ color: '#C9302C' }}
        >
          {work.year}
        </p>
        <h3
          className="font-serif text-2xl md:text-3xl mb-1"
          style={{ fontFamily: "'Instrument Serif', serif", color: '#F5F0E8' }}
        >
          {work.name}
        </h3>
        <p
          className="text-xs italic"
          style={{ color: 'rgba(245,240,232,0.5)' }}
        >
          {work.nameEn}
        </p>
      </div>

      {/* Hover overlay: fragrance notes */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.9) 100%)',
        }}
      >
        <h3
          className="font-serif text-2xl mb-4"
          style={{ fontFamily: "'Instrument Serif', serif", color: '#F5F0E8' }}
        >
          {work.name}
        </h3>
        <p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: 'rgba(245,240,232,0.7)' }}
        >
          {work.description}
        </p>

        {/* Fragrance notes */}
        <div className="space-y-3">
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase mb-1"
              style={{ color: '#C9302C' }}
            >
              Top Notes · 前调
            </p>
            <p className="text-sm" style={{ color: 'rgba(245,240,232,0.85)' }}>
              {work.notes.top.join(' · ')}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase mb-1"
              style={{ color: '#C9302C' }}
            >
              Heart Notes · 中调
            </p>
            <p className="text-sm" style={{ color: 'rgba(245,240,232,0.85)' }}>
              {work.notes.heart.join(' · ')}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase mb-1"
              style={{ color: '#C9302C' }}
            >
              Base Notes · 后调
            </p>
            <p className="text-sm" style={{ color: 'rgba(245,240,232,0.85)' }}>
              {work.notes.base.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
