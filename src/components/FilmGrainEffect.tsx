import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

// 内联 film grain fragment shader
const filmGrainFragmentShader = `
uniform float uTime;
uniform float uIntensity;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float filmGrain(vec2 uv, float time) {
  float seed = time * 0.001;
  vec2 p = uv * 1000.0;
  float n = fract(sin(dot(floor(p + seed), vec2(12.9898, 78.233))) * 43758.5453);
  float density = step(0.85, n);
  float grain = (n - 0.5) * density;
  return grain;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float grain = filmGrain(uv, uTime);
  vec3 color = inputColor.rgb + grain * uIntensity;
  outputColor = vec4(color, inputColor.a);
}
`;

// 自定义 PostProcessing Effect 类
class FilmGrainEffect extends Effect {
  constructor() {
    super('FilmGrainEffect', filmGrainFragmentShader, {
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uIntensity', new THREE.Uniform(0.08)],
      ]),
    });
  }

  update(_renderer: THREE.WebGLRenderer, _inputBuffer: any, deltaTime: number) {
    this.uniforms.get('uTime')!.value += deltaTime;
  }
}

/**
 * R3F Film Grain 后处理效果封装
 */
export function FilmGrainEffectComponent({ intensity = 0.08 }: { intensity?: number }) {
  const effectRef = useRef<FilmGrainEffect | null>(null);

  useEffect(() => {
    effectRef.current = new FilmGrainEffect();
    if (intensity !== undefined && effectRef.current) {
      effectRef.current.uniforms.get('uIntensity')!.value = intensity;
    }
  }, [intensity]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (effectRef.current) {
        effectRef.current.dispose();
        effectRef.current = null;
      }
    };
  }, []);

  // 这里返回 effect 给父级 EffectComposer 使用
  // 实际渲染由 sections/Hero/HeroScene.tsx 中的 EffectComposer 处理
  return null;
}

// 导出 Effect 类供 EffectComposer 直接使用
export { FilmGrainEffect };
