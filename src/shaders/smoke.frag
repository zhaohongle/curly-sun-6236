// 烟雾 Fragment Shader — Ray Marching Volumetric Smoke
// 颜色 #C9302C → #8B1A1A 渐变, 8 秒循环, 底部偏左升起, 轻微横向飘移 2-3px

const glsl = String.raw;

export const smokeFragmentShader = glsl`
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uOpacity;
  
  varying vec2 vUv;
  
  // ===== Simplex 3D Noise =====
  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  
  // FBM 多层噪声
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  // ===== Ray Marching =====
  
  // 烟雾密度函数
  float smokeDensity(vec3 p, float time) {
    // 8 秒循环
    float t = mod(time, 8.0) / 8.0;
    
    // 底部偏左升起：烟雾源在 (-0.3, -0.5) 附近
    vec2 source = vec2(-0.3, -0.5);
    
    // 烟雾上升方向 + 轻微横向飘移 (2-3px ≈ 0.02-0.03)
    float driftX = sin(time * 0.5) * 0.025 + 0.01;
    
    // 从底部向上升
    vec2 riseDir = vec2(driftX, 1.0);
    
    // 随时间上升的烟雾位置
    float height = fract(p.y * 0.5 + t * 2.0);
    
    // 烟雾中心轨迹
    vec2 center = source + riseDir * height * 0.8;
    
    // 到中心的距离
    float distToCenter = length(p.xy - center);
    
    // 基础烟雾形状 — 越靠近中心越浓
    float shape = smoothstep(0.4, 0.0, distToCenter);
    
    // 垂直渐变 — 底部浓顶部淡
    float verticalFade = smoothstep(-0.5, 0.0, p.y) * smoothstep(0.5, -0.2, p.y);
    
    // FBM 噪声扰动
    vec3 noisePos = vec3(p.x * 3.0 + time * 0.1, p.y * 2.0 - time * 0.3, p.z * 3.0 + time * 0.15);
    float noise = fbm(noisePos) * 0.5 + 0.5;
    
    // 组合密度
    float density = shape * verticalFade * noise;
    
    // 滚动时加速消散
    density *= (1.0 - uScroll * 0.5);
    
    return clamp(density, 0.0, 1.0);
  }
  
  // 颜色渐变 #C9302C → #8B1A1A
  vec3 smokeColor(float density) {
    vec3 cinnabar = vec3(0.788, 0.188, 0.173);   // #C9302C
    vec3 dark = vec3(0.545, 0.102, 0.102);         // #8B1A1A
    
    // 密度高的区域偏暗红，低密度偏朱砂红
    return mix(cinnabar, dark, density * 1.5);
  }
  
  void main() {
    // 归一化坐标 (-1, 1)
    vec2 uv = vUv * 2.0 - 1.0;
    
    // 根据屏幕比例修正
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;
    
    // Ray Marching 参数
    int steps = 32;
    float stepSize = 0.06;
    vec3 rayOrigin = vec3(uv, -1.0);
    vec3 rayDir = vec3(0.0, 0.0, 1.0);
    
    vec4 accumulatedColor = vec4(0.0);
    float totalDensity = 0.0;
    
    for (int i = 0; i < 32; i++) {
      vec3 p = rayOrigin + rayDir * float(i) * stepSize;
      
      // 采样烟雾密度
      float density = smokeDensity(p, uTime);
      
      if (density > 0.01) {
        // 累积颜色
        vec3 col = smokeColor(density);
        float alpha = density * 0.12; // 单次步进透明度
        
        // 预乘 alpha 累积
        accumulatedColor.rgb += col * alpha * (1.0 - accumulatedColor.a);
        accumulatedColor.a += alpha * (1.0 - accumulatedColor.a);
        
        totalDensity += density;
        
        // 透明度饱和提前退出
        if (accumulatedColor.a > 0.95) break;
      }
    }
    
    // 应用整体透明度和滚动消散
    accumulatedColor.a *= uOpacity;
    
    gl_FragColor = accumulatedColor;
  }
`;
