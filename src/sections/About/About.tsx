import { useRef } from 'react';
import { AboutImage } from './AboutImage';
import { useAboutAnimation } from './useAboutAnimation';

/**
 * About section — "京都八年" (Eight Years in Kyoto).
 * Left-column text, right-column image layout.
 * Warm cream background (#F5F0E8), ink-black text (#0A0A0A).
 */
export function About(): React.ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  useAboutAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: '#F5F0E8', color: '#0A0A0A' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-stretch gap-12 md:gap-16">
          {/* Left: Text content */}
          <div className="about-text-wrapper md:w-1/2 flex flex-col justify-center">
            <div className="about-text-line max-w-lg">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}
              >
                About
              </p>
            </div>

            <h2
              className="about-text-line font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              京都八年
            </h2>

            <div className="about-text-line space-y-4" style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '1rem', lineHeight: '1.9', color: '#333' }}>
              <p>
                二〇一六年春，我抵达京都。岚山的晨雾、南禅寺的苔庭、老铺香堂里终年不散的线香气息——这座城市教会了我如何倾听香气。
              </p>
              <p>
                八年时间，我师从两位香堂传人，学习天然香料的萃取与调和。从京都的四季更迭中，我学会了用最少的材料，表达最深的故事。
              </p>
              <p>
                每一支香水都是一封信，写给时间，写给记忆，写给那些无法用言语描述的时刻。
              </p>
            </div>

            {/* Signature */}
            <div className="about-text-line mt-10 pt-6 border-t" style={{ borderColor: 'rgba(10,10,10,0.15)' }}>
              <p
                className="font-serif text-2xl italic"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Lina
              </p>
              <p className="text-xs mt-1" style={{ color: '#666' }}>
                独立调香师 · 京都
              </p>
            </div>
          </div>

          {/* Right: Image */}
          <AboutImage />
        </div>
      </div>
    </section>
  );
}
