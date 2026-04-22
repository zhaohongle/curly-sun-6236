/**
 * AboutImage — right-side photo of Kyoto cherry blossoms
 * with soft pastel processing and right-edge feathering.
 */
export function AboutImage(): React.ReactNode {
  return (
    <div className="about-image-wrapper relative w-full md:w-1/2 overflow-hidden">
      <div className="about-image-inner relative h-full min-h-[500px]">
        {/* Image with soft pastel treatment: reduced saturation + brightness boost */}
        <img
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80"
          alt="京都五重塔与春樱"
          className="w-full h-full object-cover"
          style={{
            filter: 'saturate(0.5) brightness(1.15) contrast(0.9)',
          }}
          loading="lazy"
        />
        {/* Soft warm overlay for pastel tone */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(245, 240, 232, 0.15)',
            mixBlendMode: 'overlay',
          }}
        />
        {/* Right-edge feathering gradient */}
        <div
          className="absolute inset-y-0 right-0 w-1/4"
          style={{
            background:
              'linear-gradient(to left, #F5F0E8 0%, rgba(245,240,232,0) 100%)',
          }}
        />
      </div>
    </div>
  );
}
