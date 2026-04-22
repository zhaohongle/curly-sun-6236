import type { ProcessStep } from '@/types';

interface TimelineItemProps {
  step: ProcessStep;
  index: number;
  isLast?: boolean;
}

/**
 * TimelineItem — single process step node.
 * Displays icon, title, description, and duration.
 */
export function TimelineItem({
  step,
  index,
  isLast = false,
}: TimelineItemProps): React.ReactNode {
  return (
    <div
      className="process-step flex-shrink-0 w-[280px] md:w-[320px] snap-center px-4 md:px-6"
      style={{ opacity: 0 }}
    >
      <div className="relative">
        {/* Step number */}
        <p
          className="text-xs tracking-widest mb-3"
          style={{ color: '#C9302C' }}
        >
          STEP {String(index + 1).padStart(2, '0')}
        </p>

        {/* Icon */}
        <div
          className="text-4xl mb-6"
          style={{ filter: 'grayscale(0.3)' }}
        >
          {step.icon}
        </div>

        {/* Title */}
        <h3
          className="font-serif text-3xl md:text-4xl mb-2"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {step.title}
        </h3>
        <p
          className="text-xs italic mb-4"
          style={{ color: 'rgba(245,240,232,0.4)' }}
        >
          {step.titleEn}
        </p>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'rgba(245,240,232,0.7)', fontFamily: "'Noto Serif SC', serif" }}
        >
          {step.description}
        </p>

        {/* Duration */}
        <div
          className="inline-block px-4 py-2 text-xs tracking-wider"
          style={{
            border: '1px solid rgba(245,240,232,0.15)',
            color: 'rgba(245,240,232,0.6)',
          }}
        >
          {step.duration}
        </div>

        {/* Connector line (not on last item) */}
        {!isLast && (
          <div
            className="hidden md:block absolute top-8 -right-3 w-6"
            style={{ borderTop: '1px solid rgba(201,48,44,0.3)' }}
          />
        )}
      </div>
    </div>
  );
}
