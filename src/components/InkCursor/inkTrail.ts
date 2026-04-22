/**
 * Ink trail data point.
 */
export interface InkPoint {
  x: number;
  y: number;
  timestamp: number; // ms when point was created
  radius: number;
  opacity: number;
}

/**
 * Ink trail engine state.
 */
export interface InkTrailState {
  points: InkPoint[];
}

// Configuration constants
const MAX_POINTS = 20;
const MAX_AGE_MS = 800;
const MAIN_DOT_RADIUS = 6;
const MAIN_DOT_OPACITY = 0.8;
const TRAIL_OPACITY = 0.3;

/**
 * Pure function: computes the next ink trail state.
 *
 * Rules:
 * - Max 20 trail points, points older than 800ms fade out
 * - Main dot: radius 6px, opacity 0.8
 * - Trail dots: progressively smaller, opacity 0.3
 * - Color: rgba(10,10,10,0.8) main, rgba(10,10,10,0.3) trail
 */
export function updateInkTrail(
  prevState: InkTrailState,
  mouseX: number,
  mouseY: number,
  now: number,
): InkTrailState {
  // Remove expired points
  let points = prevState.points.filter(
    (p) => now - p.timestamp < MAX_AGE_MS,
  );

  // Cap at MAX_POINTS
  if (points.length >= MAX_POINTS) {
    points = points.slice(points.length - MAX_POINTS + 1);
  }

  // Add new point at mouse position
  const newPoint: InkPoint = {
    x: mouseX,
    y: mouseY,
    timestamp: now,
    radius: MAIN_DOT_RADIUS,
    opacity: MAIN_DOT_OPACITY,
  };

  return { points: [...points, newPoint] };
}

/**
 * Draws the ink trail onto a Canvas 2D context.
 */
export function drawInkTrail(
  ctx: CanvasRenderingContext2D,
  state: InkTrailState,
  now: number,
  reducedMotion: boolean,
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (state.points.length === 0) return;

  if (reducedMotion) {
    // Reduced motion: only show the main dot
    const mainPoint = state.points[state.points.length - 1];
    if (mainPoint) {
      ctx.beginPath();
      ctx.arc(mainPoint.x, mainPoint.y, MAIN_DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 10, 10, ${MAIN_DOT_OPACITY})`;
      ctx.fill();
    }
    return;
  }

  // Draw trail points (oldest to newest, increasing opacity)
  for (let i = 0; i < state.points.length; i++) {
    const point = state.points[i];
    const age = now - point.timestamp;
    const ageRatio = age / MAX_AGE_MS; // 0 = fresh, 1 = expired

    // Radius shrinks as point ages
    const radius = MAIN_DOT_RADIUS * (1 - ageRatio * 0.7);
    // Opacity fades as point ages
    const opacity = TRAIL_OPACITY * (1 - ageRatio);

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(10, 10, 10, ${opacity})`;
    ctx.fill();
  }

  // Draw main dot (brightest, on top)
  const mainPoint = state.points[state.points.length - 1];
  if (mainPoint) {
    ctx.beginPath();
    ctx.arc(mainPoint.x, mainPoint.y, MAIN_DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(10, 10, 10, ${MAIN_DOT_OPACITY})`;
    ctx.fill();
  }
}
