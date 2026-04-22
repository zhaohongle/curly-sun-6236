---
type: architecture
outputFor: [tech-lead, scrum-master, frontend, backend, devops]
dependencies: [prd]
---

# 系统架构文档

## 文档信息
- **功能名称**：lina-perfume-portfolio
- **版本**：1.0
- **创建日期**：2026-04-22
- **作者**：Architect Agent

## 摘要

> 下游 Agent 请优先阅读本节，需要细节时再查阅完整文档。

- **架构模式**：纯前端 SPA（单页应用），无后端，零数据库
- **技术栈**：React 19 + TypeScript + Vite + Tailwind CSS + GSAP + Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing + WebGL/GLSL
- **核心设计决策**：
  1. **Vite 而非 Next.js**：纯作品集无需 SSR，Vite 构建更轻量，HMR 更快，首屏体积更小，有利于 LCP < 2.5s 目标
  2. **Three.js + R3F 而非纯 GSAP**：烟雾和 grain 效果必须由 GPU 驱动（GLSL Shader），GSAP 无法胜任，但两者需要共存（见 §4）
  3. **React.Suspense + dynamic import 实现 shader 异步加载**：Three.js 相关代码拆分到独立 chunk，首屏不阻塞 JS 主线程
- **主要风险**：
  1. 🔴 Three.js volumetric smoke shader 在低端移动设备帧率可能 < 30fps，需多级降级策略
  2. 🟡 GSAP ScrollTrigger 与 R3F 的 useFrame 循环存在渲染管线竞争，需严格隔离
  3. 🟡 自定义 Canvas 2D 墨迹光标在 touch 设备上可能干扰原生滚动
  4. 🟢 formSpree 免费版有月提交次数限制（50 次），需告知 Lina 或升级
- **项目结构**：Feature-based 目录组织，shader 模块化独立管理

---

## 1. 架构概述

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React 19 SPA                        │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │  │
│  │  │   DOM Layer  │  │ R3F Canvas  │  │  Canvas 2D    │  │  │
│  │  │  (Tailwind +│  │ (Three.js + │  │  (墨迹光标)   │  │  │
│  │  │   GSAP)     │  │   GLSL)     │  │               │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └───────┬───────┘  │  │
│  │         │                │                 │          │  │
│  │  ┌──────▼────────────────▼─────────────────▼──────┐   │  │
│  │  │           GSAP ScrollTrigger 编排层              │   │  │
│  │  │  ┌─────────────────────────────────────────┐   │   │  │
│  │  │  │  事件总线：scroll → ScrollTrigger → GSAP │   │   │  │
│  │  │  │  timeline → 各区块动画 (DOM / R3F / C2D) │   │   │  │
│  │  │  └─────────────────────────────────────────┘   │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐                     │  │
│  │  │  Data Layer  │  │  Config     │                     │  │
│  │  │  (JSON 配置) │  │  (作品数据)  │                     │  │
│  │  └─────────────┘  └─────────────┘                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  外部服务                                              │  │
│  │  formSpree.io (预约表单提交)  │  Google Fonts (字体)   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │    Vercel / Netlify    │
              │  (静态托管 + CDN)       │
              └───────────────────────┘
```

### 1.2 渲染管线分层

本项目的核心挑战在于**三套渲染系统共存**：

| 层级 | 技术 | 负责范围 | 渲染频率 |
|------|------|----------|----------|
| **Layer 1 - DOM** | React + Tailwind + GSAP | 文字、布局、卡片、表单 | 按需重绘 |
| **Layer 2 - WebGL** | R3F + GLSL Shader | 烟雾、film grain、光晕 | 60fps (useFrame) |
| **Layer 3 - Canvas 2D** | 独立 Canvas 元素 | 墨迹光标轨迹 | 跟随鼠标 |

**关键架构原则**：三层通过**事件总线 + GSAP timeline** 串联，而非直接互相调用。DOM 层的 ScrollTrigger 驱动 R3F 层的时间参数，R3F 层不直接监听 scroll。

### 1.3 架构决策

| 决策 | 选项 | 选择 | 原因 |
|------|------|------|------|
| 构建工具 | Vite / Next.js / CRA | **Vite** | 纯前端无 SSR 需求，Vite 构建体积最小，HMR 最快，原生支持 dynamic import code splitting |
| 3D 渲染 | Three.js vanilla / R3F / Spline | **R3F + drei** | React 声明式管理 Three.js 生命周期，与 React 19 兼容性好，drei 提供现成 helpers |
| 动画引擎 | GSAP / Framer Motion / React Spring | **GSAP + ScrollTrigger** | ScrollTrigger 是横向滚动时间轴和 pin 动画的最优解，生态最成熟 |
| Shader 管理 | 内联 string / 外部 .glsl / glslify | **外部 .glsl + vite-plugin-glsl** | 类型安全、语法高亮、可独立测试 |
| 状态管理 | useState / Zustand / Redux | **useState + Context** | 项目无复杂状态流，Zustand 增加不必要的包体积 |
| 字体加载 | 自托管 / Google Fonts CDN / 混合 | **Google Fonts CDN + font-display: swap** | 减少首屏体积，swap 避免 FOUT，中文字体自托管 subset |
| 部署平台 | Vercel / Netlify / GitHub Pages | **Vercel**（推荐） | 自动 preview deployment，内置图片优化，全球 CDN |

---

## 2. 技术栈

### 2.1 核心依赖

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 构建工具 | Vite | ^6.x | 构建 + HMR + dynamic import |
| 前端框架 | React | ^19.x | UI 框架 |
| 类型系统 | TypeScript | ^5.x | 全项目类型安全 |
| CSS 框架 | Tailwind CSS | ^4.x | 原子化 CSS + 自定义色板 |
| 3D 引擎 | three.js | ^0.170.x | WebGL 核心 |
| R3F 桥接 | @react-three/fiber | ^9.x | React → Three.js 声明式桥接 |
| R3F 工具集 | @react-three/drei | ^10.x | 预置组件（CameraControls、Environment 等） |
| R3F 后处理 | @react-three/postprocessing | ^3.x | EffectComposer、Noise 等 |
| 动画 | gsap | ^3.12.x | 核心动画引擎 + ScrollTrigger + SplitText（需 Club 许可） |
| 平滑滚动 | @studio-freight/lenis | ^1.x | 平滑滚动库，与 GSAP ScrollTrigger 官方兼容 |
| Shader 编译 | vite-plugin-glsl | ^1.x | .glsl 文件 → JS module |
| 表单 | @formspree/react | ^2.x | 表单提交 SDK |
| 字体 | @fontsource/instrument-serif | ^5.x | 大标题字体自托管 |

### 2.2 开发工具

| 工具 | 用途 |
|------|------|
| @types/three | Three.js 类型定义 |
| eslint + @typescript-eslint | 代码规范 |
| prettier | 代码格式化 |
| vitest + @testing-library/react | 测试框架 |

### 2.3 外部服务

| 服务 | 用途 | 免费额度 | 备注 |
|------|------|----------|------|
| formSpree.io | 预约表单提交 | 50 次/月 | 超出需升级 ($10/月) |
| Google Fonts | 英文字体 CDN | 免费 | Instrument Serif, Inter |
| Vercel | 静态托管 | 100GB 带宽/月 | 免费计划足够 |

---

## 3. 目录结构

采用 **Feature-based 组织**，按页面区块垂直切分，而非按技术类型水平切分：

```
lina-perfume-portfolio/
├── public/
│   ├── fonts/                    # 自托管字体子集
│   │   └── source-han-serif-subset.woff2
│   ├── images/                   # 静态图片（作品缩略图、Lina 肖像等）
│   │   ├── hero-fallback.jpg     # WebGL 降级时的 Hero 静态图
│   │   └── about.jpg
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                  # 应用入口
│   ├── App.tsx                   # 根组件（路由/区块编排）
│   │
│   ├── config/                   # JSON 配置层
│   │   ├── works.json            # 作品数据（id, title, notes, images, year）
│   │   ├── process.json          # 流程时间轴数据
│   │   ├── site.json             # 全局配置（色板、SEO meta、font URLs）
│   │   └── index.ts              # 统一导出 + 类型定义
│   │
│   ├── components/               # 共享基础组件
│   │   ├── InkCursor/            # 墨迹自定义光标
│   │   │   ├── InkCursor.tsx     # Canvas 2D 光标组件
│   │   │   ├── inkTrail.ts       # Canvas 2D 绘制逻辑（纯函数）
│   │   │   └── useMousePosition.ts # 鼠标位置 hook
│   │   ├── FilmGrain/            # 胶片颗粒滤镜
│   │   │   ├── FilmGrain.tsx     # R3F 后处理组件
│   │   │   └── GrainShader.ts    # GLSL shader 引用
│   │   ├── LoadingScreen/        # Shader 异步加载过渡
│   │   │   └── LoadingScreen.tsx
│   │   ├── ReducedMotion/        # prefers-reduced-motion 适配
│   │   │   └── useReducedMotion.ts
│   │   └── SEO/
│   │       └── SEO.tsx           # 动态 meta 标签注入
│   │
│   ├── sections/                 # 页面区块（按垂直切分）
│   │   ├── Hero/
│   │   │   ├── Hero.tsx          # Hero 区块组件
│   │   │   ├── SmokeScene.tsx    # R3F Canvas 包裹
│   │   │   ├── SmokeShader/      # 朱砂烟雾 shader 模块
│   │   │   │   ├── SmokeShaderMaterial.ts  # ShaderMaterial 工厂
│   │   │   │   ├── smoke.vert.glsl  # 顶点着色器
│   │   │   │   ├── smoke.frag.glsl  # 片段着色器（Perlin noise + 颜色渐变）
│   │   │   │   └── smoke.types.ts  # Shader uniforms 类型
│   │   │   └── useSmokeAnimation.ts # 烟雾动画 hook
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── AboutImage.tsx
│   │   ├── Works/
│   │   │   ├── Works.tsx
│   │   │   ├── WorkCard.tsx
│   │   │   └── useRevealAnimation.ts # clip-path 揭幕动画 hook
│   │   ├── Process/
│   │   │   ├── Process.tsx       # 横向滚动时间轴容器
│   │   │   ├── TimelineItem.tsx
│   │   │   └── useHorizontalScroll.ts # GSAP ScrollTrigger 横向滚动 hook
│   │   └── Contact/
│   │       ├── Contact.tsx
│   │       ├── BookingForm.tsx   # formSpree 表单
│   │       └── useFormSubmission.ts
│   │
│   ├── hooks/                    # 通用 hooks
│   │   ├── useWebGLSupport.ts    # WebGL 能力检测
│   │   ├── usePerformanceTier.ts # 设备性能分级
│   │   ├── useScrollProgress.ts  # 全局滚动进度
│   │   └── useDeviceType.ts      # 设备类型检测
│   │
│   ├── shaders/                  # 全局 shader 工具
│   │   ├── common/
│   │   │   ├── noise.glsl        # Simplex/Perlin noise 函数
│   │   │   └── colors.glsl       # 色板常量（朱砂红 #C9302C 等）
│   │   └── utils/
│   │       └── createShaderMaterial.ts # ShaderMaterial 创建工具
│   │
│   ├── styles/
│   │   ├── globals.css           # Tailwind 指令 + 自定义 base
│   │   ├── tokens.css            # CSS 自定义属性（色板、字号、间距）
│   │   └── animations.css        # CSS keyframe（clip-path 等 fallback）
│   │
│   ├── utils/
│   │   ├── analytics.ts          # 埋点（可选）
│   │   └── perf.ts               # 性能测量（LCP, FCP 上报）
│   │
│   └── types/
│       ├── work.ts               # 作品数据类型
│       ├── process.ts            # 流程步骤数据类型
│       └── global.d.ts           # .glsl module 声明
│
├── tests/
│   ├── unit/
│   │   ├── SmokeShader.test.ts   # Shader 配置单元测试
│   │   ├── InkCursor.test.tsx
│   │   └── useFormSubmission.test.ts
│   └── e2e/
│       └── navigation.spec.ts    # Playwright E2E 测试
│
├── index.html                    # HTML 入口（含 preload 字体/首屏资源）
├── vite.config.ts                # Vite 配置 + code splitting
├── tailwind.config.ts            # Tailwind 配置（色板、字体、自定义动画）
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. 核心技术模块设计

### 4.1 Three.js Volumetric Smoke Shader

#### 调研结论

基于 Three.js Journey "Coffee Smoke" 教程和社区最佳实践，采用**双层策略**：

1. **方案 A（高配设备）— Volumetric Raymarching**：在 Fragment Shader 中使用 raymarching + FBM（Fractal Brownian Motion）噪声模拟体积烟雾。将 Perlin 噪声预烘焙到 3D texture（WebGLRenderTarget），运行时采样。朱砂红渐变通过 uniforms 传递颜色插值参数。
2. **方案 B（中端设备）— 粒子系统 + 噪声贴图**：使用 ~500 个半透明粒子，每个粒子使用噪声贴图做 alpha mask，通过 GSAP 控制上升速度。
3. **方案 C（低端设备）— CSS 动画降级**：纯 CSS `@keyframes` 模拟烟雾流动 + 静态渐变背景。

#### Shader 模块架构

```
SmokeShaderMaterial.ts
    │
    ├── uniforms:
    │   ├── uTime (float)          — 时间驱动动画
    │   ├── uColor1 (vec3)         — 起始色 #C9302C
    │   ├── uColor2 (vec3)         — 终止色 #8B1A1A
    │   ├── uOpacity (float)       — 透明度（ScrollTrigger 驱动淡入淡出）
    │   ├── uNoiseTexture (sampler2D) — 预烘焙的 Perlin noise texture
    │   └── uResolution (vec2)     — 屏幕分辨率
    │
    ├── smoke.vert.glsl:
    │   └── 全屏 quad，UV pass-through
    │
    └── smoke.frag.glsl:
        ├── fbm()                  — Fractal Brownian Motion 噪声函数
        ├── smokeDensity()         — 基于 UV + time 计算烟雾密度
        ├── colorGradient()        — uColor1 → uColor2 渐变
        └── main()                 — 密度 * 颜色 * 边缘衰减
```

**关键实现细节**：
- **8秒循环**：`uTime` 从 0 到 8 循环，通过 `fract(time / 8.0)` 实现无缝 loop
- **颜色渐变**：在 fragment shader 中使用 `mix(uColor1, uColor2, density)` 实现烟雾从底部朱砂红向顶部深红的自然过渡
- **边缘衰减**：使用 `smoothstep()` 在烟雾边缘做 soft falloff
- **性能关键**：FBM 迭代次数控制在 4 层（而非标准的 6-7 层），移动端降至 2 层

#### 预烘焙策略

```typescript
// 启动时预计算噪声到 texture，避免每帧运行复杂噪声函数
function createNoiseTexture(renderer: WebGLRenderer) {
  const size = 256; // 足够分辨率
  const target = new WebGLRenderTarget(size, size, {
    type: HalfFloatType,
    minFilter: LinearFilter,
  });
  // 用一次性 pass 将 noise 写入 target
  // 之后 shader 只需 sampler2D 采样，零 CPU 开销
}
```

### 4.2 Film Grain Shader

#### 方案选择

基于社区讨论（Reddit r/threejs），采用**轻量方案**而非完整 post-processing pipeline：

```typescript
// 方案：全屏 quad + fragment shader 直接叠加噪声
// 优点：无需 EffectComposer，无需 offscreen render targets，极轻
// 缺点：只能做 grain，不能组合其他 effect

// 备选：@react-three/postprocessing 的 Noise effect
// 优点：官方维护，可组合 Bloom/Vignette
// 缺点：增加 ~30KB bundle
```

**推荐方案**：使用 `@react-three/postprocessing` 的 `Noise` effect，因为：
1. 后续可能需要添加 Bloom（光晕）效果
2. `react-postprocessing` 已内置 gamma correction 和 MSAA
3. 额外 bundle 体积可通过 code splitting 延迟加载

```tsx
// FilmGrain.tsx
import { EffectComposer, Noise } from '@react-three/postprocessing'

export function FilmGrain() {
  return (
    <EffectComposer disableNormalPass>
      <Noise opacity={0.08} premultiply />
    </EffectComposer>
  )
}
```

### 4.3 R3F + GSAP 共存架构

#### 调研结论

基于 GSAP 官方论坛、R3F GitHub Discussions 和 Reddit 讨论，核心矛盾在于：
- **GSAP 通过 `useEffect` 创建动画实例，直接修改 DOM/对象属性**
- **R3F 的 `useFrame` 每帧运行，可能与 GSAP 竞争同一对象的 transform**

#### 解决方案：**职责隔离 + useFrame 代理**

```
┌─────────────────────────────────────────────────┐
│              GSAP ScrollTrigger                  │
│  (监听 scroll → 产生 progress 值 0→1)            │
└──────────────────┬──────────────────────────────┘
                   │ gsap.timeline().progress()
                   ▼
┌─────────────────────────────────────────────────┐
│         useSmokeAnimation hook                   │
│  (接收 progress → 更新 React state/ref)          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         R3F useFrame(delta)                      │
│  (读取 ref.current → 更新 shader uniforms)       │
│  不与 GSAP 竞争，GSAP 只写目标值                  │
│  useFrame 负责 interpolate 到目标                │
└─────────────────────────────────────────────────┘
```

**具体实现模式**：

```typescript
// useSmokeAnimation.ts — GSAP 侧
export function useSmokeAnimation() {
  const smokeProgress = useRef({ value: 0 })

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      }
    })
    // GSAP 只修改 ref 值，不碰 Three.js 对象
    tl.to(smokeProgress.current, {
      value: 1,
      duration: 1,
      ease: 'power2.out',
    })
    return () => tl.kill()
  }, [])

  return smokeProgress
}

// SmokeScene.tsx — R3F 侧
function SmokeScene() {
  const progress = useSmokeAnimation()
  const materialRef = useRef<ShaderMaterial>(null!)

  useFrame((_, delta) => {
    // useFrame 负责插值，GSAP 只给目标值
    materialRef.current.uniforms.uOpacity.value =
      THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        progress.current.value,
        delta * 4
      )
  })

  return <shaderMaterial ref={materialRef} ... />
}
```

**关键原则**：
- GSAP **永远不直接操作** Three.js 对象（mesh、camera、material）
- GSAP 只操作 **plain JS object / ref**
- R3F 的 `useFrame` 从 ref 读取值，通过 `lerp` 平滑过渡
- 这样避免了 React re-render 与 Three.js render loop 的冲突

### 4.4 GSAP ScrollTrigger 动画编排

#### 各区块动画策略

| 区块 | 动画类型 | ScrollTrigger 配置 | 备注 |
|------|----------|-------------------|------|
| Hero | 烟雾淡出 + 标题上浮 | `scrub: true`, 触发区间 `top top → 30% top` | R3F 透明度 + GSAP DOM 动画 |
| About | 左文 clip-path 揭示 + 右图 parallax | `scrub: 1`, 触发区间 `top 80% → bottom 20%` | CSS clip-path + translate |
| Works | 卡片逐个 clip-path 揭幕 | `stagger: 0.15`, `scrub: 0.8` | 每张卡片独立 trigger |
| Process | 垂直 scroll → 水平 translate + pin | `pin: true`, `scrub: 1`, `end: () => "+=" + containerWidth` | **最复杂动画** |
| Contact | 表单淡入 + 底部装饰烟雾 | `scrub: true`, `trigger: #contact` | 复用 SmokeShader 但不同 uniforms |

#### 横向滚动时间轴实现

```typescript
// useHorizontalScroll.ts
export function useHorizontalScroll(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current!
    const scrollWidth = container.scrollWidth - window.innerWidth

    gsap.to(container, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: '#process-section',
        pin: true,
        scrub: 1,
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
        anticipatePin: 1, // 避免 pin 闪烁
      }
    })
  }, [])
}
```

**移动端适配**：在 `useDeviceType` hook 中检测设备类型，移动端切换为垂直堆叠布局（CSS media query），禁用 pin。

### 4.5 墨迹自定义光标

#### 架构设计

采用 **独立 Canvas 2D 覆盖层**，与 Three.js Canvas 完全隔离：

```typescript
// InkCursor.tsx
// 固定定位的 Canvas 覆盖整个视口，pointer-events: none
// 鼠标移动时在 Canvas 上绘制墨迹效果

function InkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { x, y } = useMousePosition()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    // 设置 Canvas 尺寸 = 窗口尺寸
    // 使用 requestAnimationFrame 绘制循环
    // 在鼠标位置绘制半透明径向渐变（模拟墨迹晕染）
    // 使用 trailing buffer 存储最近 N 个鼠标位置，绘制渐隐轨迹
  }, [])

  return <canvas ref={canvasRef} className="ink-cursor" />
}
```

**性能优化**：
- Canvas 尺寸限制为 `min(window.innerWidth, 1920)` 避免超大画布
- 轨迹点数量上限 20 个，超出则移除最旧的
- 使用 `globalCompositeOperation = 'multiply'` 实现墨迹叠加效果
- `prefers-reduced-motion` 时退化为纯 CSS 圆点光标

### 4.6 数据层设计（JSON 配置化）

```typescript
// config/works.json
[
  {
    "id": "midnight-orchid",
    "title": "午夜兰",
    "subtitle": "Midnight Orchid",
    "year": 2024,
    "category": "木质调",
    "notes": {
      "top": ["佛手柑", "紫苏"],
      "heart": ["墨兰", "沉香"],
      "base": ["檀香", "琥珀"]
    },
    "images": {
      "thumbnail": "/images/works/midnight-orchid-thumb.jpg",
      "gallery": [
        "/images/works/midnight-orchid-1.jpg",
        "/images/works/midnight-orchid-2.jpg",
        "/images/works/midnight-orchid-3.jpg"
      ]
    },
    "description": "灵感来自京都夜晚的兰花温室...",
    "featured": true
  }
]
```

```typescript
// config/process.json
[
  {
    "step": 1,
    "title": "灵感采集",
    "description": "从自然、文学、记忆中提取嗅觉意象",
    "duration": "1-2 周",
    "icon": "🌿"
  },
  {
    "step": 2,
    "title": "配方实验",
    "description": "在调香室中反复调配，寻找完美平衡",
    "duration": "2-4 周",
    "icon": "🧪"
  }
  // ... 更多步骤
]
```

**类型定义**：

```typescript
// types/work.ts
export interface Work {
  id: string;
  title: string;
  subtitle: string;
  year: number;
  category: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  images: { thumbnail: string; gallery: string[] };
  description: string;
  featured: boolean;
}
```

**数据加载策略**：
- JSON 文件通过 Vite `import` 在构建时内联（小数据量 < 50KB）
- 作品图片使用 `<img loading="lazy">` + `fetchpriority="low"`（非首屏卡片）
- Hero 首屏图片预加载：`<link rel="preload">`（降级场景用）

---

## 5. 性能优化策略

### 5.1 性能目标

| 指标 | 目标值 | 测量工具 |
|------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse / Web Vitals |
| FCP (First Contentful Paint) | < 1.5s | Lighthouse |
| TTI (Time to Interactive) | < 3.5s | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Web Vitals |
| Hero 动画帧率（桌面） | 60fps | Chrome DevTools Performance |
| Hero 动画帧率（移动端） | ≥ 30fps | Chrome DevTools Remote Debug |
| 首屏 JS bundle | < 150KB (gzip) | Webpack Bundle Analyzer |

### 5.2 Code Splitting 策略

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js 全家桶 → 独立 chunk (~200KB gzip)
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          // GSAP → 独立 chunk (~30KB gzip)
          'gsap': ['gsap'],
          // 后处理 → 独立 chunk (~15KB gzip)
          'postprocessing': ['@react-three/postprocessing'],
          // formSpree → 按需加载 (~5KB gzip)
          'formspree': ['@formspree/react'],
        }
      }
    }
  }
})
```

**加载时序**：
```
1. 首屏加载: React + Tailwind + Hero 基础 DOM (< 150KB)
2. 后台加载: three chunk（显示 LoadingScreen）
3. 按需加载: gsap chunk（滚动到 About 时加载）
4. 按需加载: postprocessing chunk（Hero 加载完后后台预加载）
5. 按需加载: formspree chunk（滚动到 Contact 时加载）
```

### 5.3 React.Suspense 异步加载

```typescript
// App.tsx
const SmokeScene = lazy(() => import('./sections/Hero/SmokeScene'))
const FilmGrain = lazy(() => import('./components/FilmGrain/FilmGrain'))

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <SmokeScene />
        <FilmGrain />
      </Suspense>
      {/* DOM 层直接渲染，不受 Suspense 阻塞 */}
      <HeroContent />
      <About />
      <Works />
      <Process />
      <Contact />
    </>
  )
}
```

### 5.4 WebGL 降级策略

#### 三级降级体系

```
┌─────────────────────────────────────────────────┐
│              WebGL 能力检测                       │
│  useWebGLSupport() → 返回 'full' | 'partial' |   │
│  'none'                                         │
└──────────────────┬──────────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
  full          partial        none
 (桌面/旗舰)    (中端手机)    (老旧设备/无WebGL)
     │             │             │
     ▼             ▼             ▼
  Volumetric    粒子系统      CSS 静态渐变
  Raymarching   + 简化噪声    + 背景图
  60fps         30fps         60fps
```

#### 实现

```typescript
// hooks/useWebGLSupport.ts
export function useWebGLSupport(): 'full' | 'partial' | 'none' {
  const [tier, setTier] = useState<'full' | 'partial' | 'none'>('full')

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return setTier('none')

    const renderer = gl.getParameter(gl.RENDERER)
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)

    // 检测移动设备 + 性能
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
    const isLowEnd = maxTextureSize < 4096

    if (isMobile && isLowEnd) {
      setTier('partial')
    } else if (isMobile) {
      // 旗舰手机但移动端，降低 shader 复杂度
      setTier('full') // 但会传 mobile=true 给 shader
    }
  }, [])

  return tier
}

// hooks/useDeviceType.ts
export function useDeviceType() {
  const [type, setType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  useEffect(() => {
    const w = window.innerWidth
    if (w < 768) setType('mobile')
    else if (w < 1024) setType('tablet')
    else setType('desktop')
  }, [])
  return type
}
```

#### 降级时的 UI 表现

| 场景 | Hero | Film Grain | 墨迹光标 |
|------|------|------------|----------|
| **full** | Volumetric Shader 60fps | Noise Effect | Canvas 2D 晕染 |
| **partial** | 粒子系统 30fps | 关闭 | CSS 圆点 |
| **none** | 静态渐变背景图 | 关闭 | 系统默认光标 |

### 5.5 图片优化

| 图片类型 | 格式 | 优化策略 |
|----------|------|----------|
| 作品缩略图 | WebP + AVIF fallback | Vite image plugin 自动压缩 |
| Hero 降级背景图 | WebP, ≤ 100KB | 预加载 `<link rel="preload">` |
| Lina 肖像 | WebP, ≤ 80KB | `fetchpriority="high"` (About 区) |
| Favicon | ICO + PNG | 标准多尺寸 |

### 5.6 字体优化

```css
/* Tailwind 配置中的字体策略 */
@layer base {
  /* 英文字体：Google Fonts CDN + font-display: swap */
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

  /* 中文字体：自托管 subset（仅包含常用汉字）*/
  @font-face {
    font-family: 'SourceHanSerif';
    src: url('/fonts/source-han-serif-subset.woff2') format('woff2');
    font-display: swap;
    font-weight: 400;
  }
}
```

**中文字体子集策略**：使用 `glyphhanger` 或 `fonttools pyftsubset` 基于站点实际使用的汉字生成子集，控制在 ≤ 200KB。

---

## 6. 动画编排总览

### 6.1 GSAP Timeline 注册表

所有 GSAP 动画通过**自定义 hook** 封装，在 `useEffect` 中注册，`cleanup` 中销毁：

```typescript
// 每个 section 的动画 hook 遵循统一模式:
function useXXXAnimation(elementRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // GSAP 动画逻辑
      gsap.to(elementRef.current, { ... })
    })
    return () => ctx.revert() // React 18/19 StrictMode 兼容
  }, [])
}
```

**`gsap.context()` 是关键**：在 React 18/19 StrictMode 下，useEffect 会执行两次，`gsap.context()` 确保 GSAP 能正确清理重复创建的动画实例。

### 6.2 动画时间线

```
Scroll Position:  0% ────────── 25% ────────── 50% ────────── 75% ────────── 100%
                  │             │              │              │               │
                  ▼             ▼              ▼              ▼               ▼
              ┌──────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   ┌──────┐
              │ Hero │    │  About   │    │  Works   │    │ Process  │   │Contact│
              │ 烟雾 │    │ 揭示动画  │    │ 卡片揭幕  │    │ 横向滚动  │   │ 表单  │
              │ 淡出 │    │ parallax │    │ stagger  │    │ pin      │   │ 淡入  │
              └──────┘    └──────────┘    └──────────┘    └──────────┘   └──────┘
```

### 6.3 clip-path 揭幕动画

```css
/* CSS fallback + GSAP 驱动 */
.work-card {
  clip-path: inset(0 100% 0 0); /* 初始：完全隐藏 */
}

/* GSAP 动画 */
gsap.to('.work-card', {
  clipPath: 'inset(0 0% 0 0)', // 最终：从左向右完全揭示
  duration: 1,
  ease: 'power3.inOut',
  scrollTrigger: { ... }
})
```

---

## 7. 安全设计

### 7.1 前端安全

由于是纯静态站点，安全风险较低，但仍需注意：

| 措施 | 实现方式 |
|------|----------|
| HTTPS 强制 | Vercel 自动配置 |
| CSP (Content Security Policy) | `_headers` 文件配置，限制 script-src 到自身域名 |
| XSS 防护 | React 自动转义，表单输入不直接渲染 innerHTML |
| formSpree 提交防护 | formSpree 自带 honeypot + rate limiting |
| 字体 CDN 完整性 | Google Fonts SRI hash 校验 |

### 7.2 CSP Header

```
# _headers (Vercel/Netlify)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://formspree.io; connect-src https://formspree.io;
```

---

## 8. 部署架构

### 8.1 部署平台对比

| 维度 | Vercel (推荐) | Netlify | GitHub Pages |
|------|---------------|---------|-------------|
| 构建速度 | ~30s | ~45s | ~60s |
| 全球 CDN | ✅ (Edge Network) | ✅ | ✅ (Fastly) |
| Preview Deploy | ✅ (每 PR) | ✅ | ❌ |
| 图片优化 | ✅ (自动 WebP/AVIF) | ✅ (需插件) | ❌ |
| 自定义 Header | ✅ | ✅ | ❌ |
| 免费额度 | 100GB 带宽 | 100GB 带宽 | 100GB 带宽 |
| 自定义域名 | ✅ | ✅ | ✅ |

**推荐 Vercel**：构建速度最快，图片优化开箱即用，Preview Deploy 方便设计评审。

### 8.2 部署配置

```json
// vercel.json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://formspree.io; connect-src https://formspree.io;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }
      ]
    }
  ]
}
```

### 8.3 CI/CD 流程

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  git push    │───▶│  Vercel     │───▶│  Lighthouse │───▶│  部署完成    │
│  main branch │    │  自动构建    │    │  性能门禁    │    │  生产环境    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  Preview     │
                 │  Deploy      │
                 │  (每 PR)     │
                 └─────────────┘
```

**CI 门禁**（可选，通过 Vercel Speed Insights 或自定义 script）：
- Lighthouse Performance ≥ 85
- LCP < 2.5s
- 无 console.error

---

## 9. 测试策略

### 9.1 测试分层

| 层级 | 工具 | 覆盖率目标 | 测试内容 |
|------|------|-----------|----------|
| 单元测试 | Vitest | > 80% | 工具函数、数据解析、hook 逻辑 |
| 组件测试 | @testing-library/react | > 70% | 表单提交、卡片渲染 |
| E2E 测试 | Playwright | 核心路径 | 页面导航、表单提交、移动端降级 |

### 9.2 不可测内容

| 内容 | 原因 | 替代方案 |
|------|------|----------|
| GLSL Shader 渲染结果 | 依赖 GPU，headless 环境无 WebGL | 手动视觉测试 + 截图对比 |
| GSAP 动画时序 | 依赖真实 scroll 事件 | E2E 测试验证 DOM 终态 |
| R3F Canvas 渲染 | 同上 | 视觉回归测试（Percy/Chromatic） |

### 9.3 关键测试用例

```typescript
// useFormSubmission.test.ts
describe('useFormSubmission', () => {
  it('提交成功时返回 success', async => { ... })
  it('表单验证失败时返回错误', async => { ... })
  it('网络错误时返回 error', async => { ... })
})

// works.json 数据验证
describe('works.json', () => {
  it('所有作品都有必需的字段', () => { ... })
  it('所有图片路径存在', () => { ... })
})
```

---

## 10. 无障碍 (A11y)

### 10.1 必须实现

| 项目 | 实现方式 |
|------|----------|
| `prefers-reduced-motion` | 关闭所有 GSAP 动画、Shader 动画退化为静态 |
| 语义化 HTML | `<section>`, `<main>`, `<nav>`, `<h1>`-`<h3>` 层级正确 |
| 键盘导航 | 所有交互元素可 tab 访问 |
| alt 文本 | 所有 `<img>` 有描述性 alt |
| 表单 label | 所有表单字段有 `<label>` |
| 焦点可见 | 自定义 focus-visible 样式（朱砂红描边） |
| 颜色对比度 | 墨黑 #0A0A0A / 暖米白 #F5F0E8 对比度 > 12:1 ✅ |

### 10.2 Reduced Motion 实现

```typescript
// hooks/useReducedMotion.ts
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}
```

---

## 11. SEO 策略

### 11.1 Meta 标签

```html
<!-- index.html head -->
<meta name="description" content="Lina — 独立调香师，东方草本香艺作品集">
<meta name="keywords" content="调香师, 香水, 东方草本, 独立调香, 作品集">

<!-- Open Graph -->
<meta property="og:title" content="Lina Perfume Portfolio">
<meta property="og:description" content="独立调香师 Lina 的个人作品集">
<meta property="og:image" content="/images/og-cover.jpg">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
```

### 11.2 SEO 限制与对策

| 限制 | 影响 | 对策 |
|------|------|------|
| SPA 单页 | 搜索引擎只能抓取一个 URL | 语义化 HTML + 服务端不阻塞 |
| JS 渲染内容 | 部分爬虫不执行 JS | 关键内容（作品列表）直接在 HTML 中渲染 |
| 无 SSR | 首屏 SEO 较弱 | 预渲染 HTML shell + 关键内容直出 |

---

## 12. 风险评估与缓解

### 12.1 技术风险矩阵

| 风险 | 可能性 | 影响 | 等级 | 缓解措施 |
|------|--------|------|------|----------|
| Three.js smoke shader 低端手机卡顿 | 高 | 高 | 🔴 | 三级降级体系 + 性能分级检测 |
| GSAP + R3F 渲染冲突 | 中 | 高 | 🟡 | 职责隔离模式（§4.3），GSAP 不碰 Three.js 对象 |
| formSpree 免费额度不足 | 低 | 中 | 🟢 | 告知 Lina，预留升级路径 |
| 中文字体文件过大 | 中 | 中 | 🟡 | 子集化至 ≤ 200KB，font-display: swap |
| Vite dynamic import 拆分过细 | 低 | 低 | 🟢 | 合并 small chunks，设置 `minChunkSize` |
| GSAP ScrollTrigger 在 Safari 上 pin 不准确 | 中 | 中 | 🟡 | 使用 `invalidateOnRefresh` + `anticipatePin` |
| Canvas 2D 光标在 touch 设备上干扰滚动 | 中 | 低 | 🟡 | touch 设备自动禁用自定义光标 |

### 12.2 已知限制

1. **GSAP ScrollTrigger 的 `pin: true` 在 iOS Safari 上有已知 bug**：当 pin 区域内有 `position: fixed` 元素时可能出现错位。解决方案：pin 区域内避免使用 fixed 定位。
2. **Three.js 在 iOS Safari 上的 WebGL 内存限制较严格**：Texture 超过 4K 可能 OOM。烟雾 noise texture 控制在 256x256。
3. **React 19 与 @react-three/fiber 的兼容性**：R3F v9 已适配 React 19，但需在 `package.json` 中显式声明 peer dependency override。

---

## 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0 | 2026-04-22 | Architect Agent | 初始版本，基于 PRD 完成架构设计 + 技术调研 |
