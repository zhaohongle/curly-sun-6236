import { useState, useCallback } from 'react';
import { useNavScroll } from './useNavScroll';
import { useActiveSection } from './useActiveSection';
import { useDeviceType } from '@/hooks';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'works', label: 'Works' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Navigation — fixed top nav, hides on scroll down / shows on scroll up.
 * Desktop: horizontal links with active indicator.
 * Mobile: hamburger menu → full-screen overlay.
 */
export function Navigation(): React.ReactNode {
  const visible = useNavScroll();
  const activeSection = useActiveSection();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  }, []);

  // Desktop navigation
  if (!isMobile) {
    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-serif text-xl tracking-wider"
              style={{ fontFamily: "'Instrument Serif', serif", color: '#F5F0E8' }}
            >
              Lina
            </button>

            {/* Nav links */}
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 cursor-none py-1"
                  style={{
                    color: activeSection === item.id ? '#C9302C' : 'rgba(245,240,232,0.6)',
                  }}
                >
                  {item.label}
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ backgroundColor: '#C9302C' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Mobile navigation with hamburger
  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          background: 'rgba(10,10,10,0.9)',
        }}
      >
        <div className="flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-serif text-lg tracking-wider"
            style={{ fontFamily: "'Instrument Serif', serif", color: '#F5F0E8' }}
          >
            Lina
          </button>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                backgroundColor: '#F5F0E8',
                transform: menuOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                backgroundColor: '#F5F0E8',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                backgroundColor: '#F5F0E8',
                transform: menuOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center transition-opacity duration-500"
        style={{
          background: 'rgba(10,10,10,0.98)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="font-serif text-3xl py-4 transition-colors duration-300"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: activeSection === item.id ? '#C9302C' : '#F5F0E8',
              transitionDelay: menuOpen ? `${index * 80}ms` : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
