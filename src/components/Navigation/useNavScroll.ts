import { useState, useEffect } from 'react';

/**
 * Navigation scroll hook — tracks scroll direction for show/hide.
 * Hides on scroll down, shows on scroll up.
 */
export function useNavScroll(): boolean {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < 10) {
            // Always visible at top
            setVisible(true);
          } else if (currentScrollY > lastScrollY) {
            // Scrolling down — hide
            setVisible(false);
          } else {
            // Scrolling up — show
            setVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return visible;
}
