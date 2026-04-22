// Film Grain Fragment Shader
// 0.3px 颗粒, 15% 密度

const glsl = String.raw;

export const filmGrainGLSL = glsl`
uniform float uTime;
uniform float uIntensity;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float filmGrain(vec2 uv, float time) {
  // 基于时间的随机种子
  float seed = time * 0.001;
  vec2 p = uv * 1000.0; // 0.3px 级别颗粒
  
  float n = fract(sin(dot(floor(p + seed), vec2(12.9898, 78.233))) * 43758.5453);
  
  // 15% 密度 — 大部分像素不受影响
  float density = step(0.85, n);
  
  // 灰度噪声范围
  float grain = (n - 0.5) * density;
  
  return grain;
}
`;
