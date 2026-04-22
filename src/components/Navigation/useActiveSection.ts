import { useState, useEffect } from 'react';

const SECTIONS = ['about', 'works', 'process', 'contact'];

/**
 * Uses IntersectionObserver to track which section is currently in view.
 * Returns the ID of the active section.
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionElements: HTMLElement[] = [];

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      sectionElements.push(el);

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          }
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const obs of observers) {
        obs.disconnect();
      }
    };
  }, []);

  return activeSection;
}
