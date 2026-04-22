import { useRef, useEffect, useCallback } from 'react';
import { useMousePosition } from './useMousePosition';
import { useReducedMotion, useDeviceType } from '@/hooks';
import { updateInkTrail, drawInkTrail, type InkTrailState } from './inkTrail';

/**
 * InkCursor — full-screen Canvas overlay for the ink-style cursor.
 * - pointer-events: none, z-index 9999
 * - Returns null on mobile/touch devices
 * - In reduced-motion mode: only shows the main ink dot
 */
export function InkCursor(): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<InkTrailState>({ points: [] });
  const animationRef = useRef<number>(0);

  const mouse = useMousePosition();
  const reducedMotion = useReducedMotion();
  const deviceType = useDeviceType();

  // Return null on mobile/touch devices
  if (deviceType === 'mobile') return null;

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update trail state
    const now = performance.now();
    trailRef.current = updateInkTrail(trailRef.current, mouse.x, mouse.y, now);

    // Draw
    drawInkTrail(ctx, trailRef.current, now, reducedMotion);

    animationRef.current = requestAnimationFrame(animate);
  }, [mouse.x, mouse.y, reducedMotion]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Start/stop animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
