/**
 * AboutImage — right-side black-and-white photo with grayscale filter
 * and right-edge feathering (gradient fade).
 */
export function AboutImage(): React.ReactNode {
  return (
    <div className="about-image-wrapper relative w-full md:w-1/2 overflow-hidden">
      <div className="about-image-inner relative h-full min-h-[500px]">
        {/* Image with grayscale filter */}
        <img
          src="/images/about/lina-studio.jpg"
          alt="Lina 的调香工作室 — 京都"
          className="w-full h-full object-cover grayscale"
          loading="lazy"
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
