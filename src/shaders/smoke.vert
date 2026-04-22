// 烟雾顶点着色器 — 底部偏左升起
const glsl = String.raw;

export const smokeVertexShader = glsl`
  uniform float uTime;
  uniform float uResolution;
  
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDensity;
  
  void main() {
    vUv = uv;
    
    // 基础位置
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;
