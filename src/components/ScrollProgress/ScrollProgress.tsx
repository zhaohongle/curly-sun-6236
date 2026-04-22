import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useDeviceType } from '@/hooks';

/**
 * ScrollProgress — fixed SVG progress indicator on the right side.
 * Styled as an incense stick shape, filled with cinnabar red.
 * Hidden on mobile.
 */
export function ScrollProgress(): React.ReactNode {
  const progress = useScrollProgress();
  const deviceType = useDeviceType();

  if (deviceType === 'mobile') return null;

  // Incense stick dimensions
  const stickHeight = 120;
  const stickWidth = 2;
  const filledHeight = stickHeight * progress;

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50"
      style={{ opacity: progress > 0.02 ? 1 : 0, transition: 'opacity 0.5s' }}
    >
      <svg
        width={stickWidth + 4}
        height={stickHeight}
        viewBox={`0 0 ${stickWidth + 4} ${stickHeight}`}
      >
        {/* Background track — thin subtle line */}
        <rect
          x={1}
          y={0}
          width={stickWidth}
          height={stickHeight}
          rx={1}
          fill="rgba(245,240,232,0.08)"
        />
        {/* Filled portion — cinnabar red incense stick */}
        <rect
          x={1}
          y={stickHeight - filledHeight}
          width={stickWidth}
          height={filledHeight}
          rx={1}
          fill="#C9302C"
          style={{ transition: 'y 0.15s ease-out, height 0.15s ease-out' }}
        />
        {/* Glowing tip — small circle at the leading edge */}
        {progress > 0.01 && (
          <circle
            cx={stickWidth / 2 + 1}
            cy={stickHeight - filledHeight}
            r={3}
            fill="#C9302C"
            opacity={0.6}
            style={{ transition: 'cy 0.15s ease-out' }}
          />
        )}
      </svg>
    </div>
  );
}
