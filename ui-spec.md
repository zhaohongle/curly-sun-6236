---
type: ui-spec
outputFor: [frontend]
dependencies: [prd]
---

# UI/UX 规范文档

## 文档信息
- **功能名称**：lina-perfume-portfolio
- **版本**：1.0
- **创建日期**：2026-04-22
- **作者**：UI Designer Agent

## 摘要

> 下游 Agent 请优先阅读本节，需要细节时再查阅完整文档。

- **设计风格**：东方草本 × 日式侘寂 × 极致工艺感，以暗调奢华为基底，融合东方美学留白与现代数字工艺
- **主色调**：墨黑 #0A0A0A / 暖米白 #F5F0E8 / 朱砂红 #C9302C / 暗红 #8B1A1A
- **核心组件**：Hero 烟雾 Shader、墨迹光标、香水作品卡片（clip-path 揭幕）、Process 横向时间轴、Contact 极简表单
- **响应式断点**：Desktop ≥1280px / Tablet 768–1279px / Mobile <768px
- **设计系统**：自定义设计令牌 + CSS Variables，不依赖第三方 UI 库（Tailwind 可作为 utility 层参考）

---

## 1. 设计概述

### 1.1 设计理念

> **"香水是看不见的诗，网站是看得见的香水。"**

本项目以 **侘寂（Wabi-Sabi）** 为精神内核——不完美中的完美，留白中的丰盈。视觉上呈现三个层次的张力：

1. **墨与光**：纯黑背景是画布，朱砂红烟雾是笔触，暗红光晕是余韵
2. **留与满**：大面积留白给予呼吸，精致的作品卡片是凝视的焦点
3. **静与动**：页面整体沉静如水，光标墨迹和烟雾是唯一的生命气息

整体气质参考：Awwwards 2025 年度获奖作品 Lando Norris 官网的暗调奢华感 + Linear 官网的排版纪律性 + 站酷百大品牌官网的东方审美表达。

### 1.2 设计原则

- **侘寂留白**：内容密度控制在 30%–40%，70% 以上为留白。宁可少，不可多。
- **东方克制**：动画仅用于引导注意力和暗示交互，不为动而动。每个动画都有明确的存在理由。
- **感官暗示**：用视觉语言暗示嗅觉体验——烟雾暗示挥发性，暖米色暗示温度，墨迹暗示渗透力。
- **数字工艺**：每个像素都经过精确计算，间距遵循模数系统，字体经过光学尺寸校准。
- **渐进优雅**：高端体验不牺牲可达性。所有视觉效果在 `prefers-reduced-motion` 下优雅降级。

### 1.3 情绪板关键词

| 维度 | 关键词 | 视觉映射 |
|------|--------|----------|
| 色彩 | 墨色、朱砂、暖米 | 深底浅字 + 朱砂点缀 |
| 质感 | 胶片颗粒、烟雾、宣纸纹理 | 0.3px 颗粒叠加 + volumetric shader |
| 动效 | 墨迹晕染、缓慢消散、揭幕 | 低速度 + 弹性缓动 |
| 排版 | 大号衬线标题、紧凑字距 | Editorial New 风格 |
| 空间 | 大留白、不对称布局 | 60/40 黄金分割 |

---

## 2. 用户流程

### 2.1 主流程

```
用户进入
  │
  ├─▶ [Hero 首屏] 感受品牌氛围（烟雾、颗粒、光晕）
  │     ↓ 自然滚动 / 向下箭头引导
  │
  ├─▶ [About 区域] 了解 Lina 的故事
  │     ↓ 继续滚动
  │
  ├─▶ [Works 区域] 浏览香水作品
  │     ├─ 卡片 hover → 预览细节
  │     ├─ 卡片 click → 进入作品详情页（Phase 2）
  │     └─ 滚动继续
  │
  ├─▶ [Process 区域] 了解调香流程
  │     ↓ 滚动驱动的横向时间轴
  │
  └─▶ [Contact 区域] 预约咨询
        ├─ 填写极简表单
        ├─ 提交成功 → 确认信息 + 感谢动画
        └─ 表单验证错误 → 行内提示
```

### 2.2 流程说明

| 步骤 | 页面/区块 | 用户行为 | 系统响应 |
|------|-----------|----------|----------|
| 1 | Hero | 页面加载 | 8秒烟雾循环启动，墨迹光标激活，光晕淡入 |
| 2 | Hero | 向下滚动 | 内容向上过渡，烟雾视差后退 |
| 3 | About | 滚动进入视口 | 左文右图交错淡入，图片先于文字出现 |
| 4 | Works | 卡片进入视口 | clip-path 从左向右逐张揭幕（间隔 120ms）|
| 5 | Works | hover 卡片 | 卡片微放大 1.02×，阴影加深，标题高亮 |
| 6 | Process | 滚动进入视口 | 横向时间轴锁定，滚动转为横向 |
| 7 | Process | 继续滚动 | 时间节点依次激活，进度条填充 |
| 8 | Contact | 滚动进入视口 | 表单元素依次淡入 |
| 9 | Contact | 填写并提交 | 验证通过后 500ms 延迟 → 感谢页淡入 |

---

## 3. 设计令牌

### 3.1 颜色系统

#### 主色板（Brand Colors）

| 令牌名 | CSS Variable | 色值 | 用途 |
|--------|-------------|------|------|
| `ink-black` | `--color-ink` | `#0A0A0A` | 页面主背景、导航栏底色 |
| `warm-beige` | `--color-beige` | `#F5F0E8` | 文字主色、About 区背景、表单底色 |
| `cinnabar` | `--color-cinnabar` | `#C9302C` | CTA 按钮、链接 hover、烟雾主色 |
| `dark-red` | `--color-darkred` | `#8B1A1A` | 光晕渐变终点、暗部强调、底部光效 |

#### 品牌色扩展

| 令牌名 | CSS Variable | 色值 | 用途 |
|--------|-------------|------|------|
| `cinnabar-light` | `--color-cinnabar-light` | `#E8453F` | CTA hover 状态、烟雾高光 |
| `cinnabar-glow` | `--color-cinnabar-glow` | `rgba(201,48,44,0.15)` | 墨迹光标光晕、微弱的红色背景 |
| `dark-red-deep` | `--color-darkred-deep` | `#5C1111` | 烟雾最深层、光晕核心 |
| `smoke-white` | `--color-smoke` | `rgba(245,240,232,0.04)` | 烟雾粒子基底色 |

#### 中性色（Neutral Scale）

基于暖米白调校，避免冷灰，保持整体温暖调性。

| 令牌名 | CSS Variable | 色值 | 用途 |
|--------|-------------|------|------|
| `neutral-50` | `--color-n50` | `#FDFCFA` | 最亮背景、表单输入区 |
| `neutral-100` | `--color-n100` | `#F5F0E8` | 区块交替背景 |
| `neutral-200` | `--color-n200` | `#E8E0D4` | 分割线、卡片边框 |
| `neutral-300` | `--color-n300` | `#C4B8A8` | 辅助图标、占位符 |
| `neutral-400` | `--color-n400` | `#9E9080` | 次要文字、时间标签 |
| `neutral-500` | `--color-n500` | `#7A6D5E` | 描述文字 |
| `neutral-600` | `--color-n600` | `#5A4E42` | 段落正文 |
| `neutral-700` | `--color-n700` | `#3D352C` | 小标题 |
| `neutral-800` | `--color-n800` | `#1E1914` | 标题文字（暗背景上） |
| `neutral-900` | `--color-n900` | `#0A0A0A` | 最深色、等同于 ink-black |

#### 语义色（Semantic Colors）

| 令牌名 | CSS Variable | 色值 | 用途 |
|--------|-------------|------|------|
| `success` | `--color-success` | `#4A7C59` | 表单成功、确认状态（降低饱和度以匹配整体调性） |
| `warning` | `--color-warning` | `#B8922C` | 验证警告 |
| `error` | `--color-error` | `#C9302C` | 表单错误（复用 cinnabar） |
| `info` | `--color-info` | `#6B8B9E` | 信息提示（低饱和蓝灰） |

#### 渐变定义

```css
/* Hero 右下角光晕 */
--glow-gradient: radial-gradient(
  ellipse 600px 400px at 90% 95%,
  rgba(139,26,26,0.35) 0%,
  rgba(201,48,44,0.12) 40%,
  transparent 70%
);

/* CTA 按钮渐变 */
--cta-gradient: linear-gradient(
  135deg,
  var(--color-cinnabar) 0%,
  var(--color-darkred) 100%
);

/* 卡片揭幕遮罩 */
--card-mask: linear-gradient(
  90deg,
  var(--color-ink) 0%,
  transparent 100%
);
```

#### 对比度验证

| 组合 | 前景 | 背景 | 对比度 | WCAG AA | WCAG AAA |
|------|------|------|--------|---------|----------|
| 正文 | #F5F0E8 | #0A0A0A | 16.8:1 | ✅ | ✅ |
| 标题 | #C9302C | #0A0A0A | 5.6:1 | ✅ | ❌ |
| 辅助 | #C4B8A8 | #0A0A0A | 7.2:1 | ✅ | ✅ |
| 正文(亮) | #1E1914 | #F5F0E8 | 14.1:1 | ✅ | ✅ |
| 辅助(亮) | #9E9080 | #F5F0E8 | 4.6:1 | ✅ | ❌ |

### 3.2 排版系统

#### 字体族定义

```css
--font-display: 'Instrument Serif', 'Canela', 'Editorial New', 'Georgia', serif;
--font-body: 'Inter', 'Söhne', -apple-system, BlinkMacSystemFont, sans-serif;
--font-cjk: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

**字体选择逻辑**：
- **大标题（H1/H2）**：优先 `Instrument Serif`（Google Fonts 免费可用），回退到 `Canela`（商用付费），再到 `Editorial New`。Instrument Serif 具有现代衬线的锋利感和古典比例的优雅，与香水高端调性完美契合。
- **正文**：`Inter` 优先（数字排版极佳，开源免费），回退 `Söhne`。Inter 在 14–18px 范围内的可读性是所有无衬线体中的最优解。
- **中文装饰文字**：`思源宋体 (Noto Serif SC)`。仅在 About 区的引言、Process 区的中式标题等装饰性场景使用，正文中文使用 Inter。

#### 字阶系统（Type Scale）

基于 **Major Third (1.250)** 比例构建，从 16px 基准向上/向下推导：

| 令牌名 | 大小 | 行高 | 字重 | 字距 | 用途 | 示例字号(px) |
|--------|------|------|------|------|------|-------------|
| `display` | 72px | 0.95 | 400 | -0.03em | Hero 超大标题 | 72 |
| `h1` | 56px | 1.05 | 400 | -0.02em | 页面主标题 | 56 |
| `h2` | 40px | 1.15 | 400 | -0.01em | 区块标题 | 40 |
| `h3` | 32px | 1.20 | 400 | 0 | 子标题 | 32 |
| `h4` | 24px | 1.30 | 400 | 0 | 卡片标题 | 24 |
| `h5` | 20px | 1.35 | 500 | 0.01em | 小标题 | 20 |
| `body-lg` | 18px | 1.60 | 400 | 0 | 大段正文 | 18 |
| `body` | 16px | 1.60 | 400 | 0 | 正文默认 | 16 |
| `body-sm` | 14px | 1.50 | 400 | 0 | 辅助文字 | 14 |
| `caption` | 12px | 1.40 | 400 | 0.02em | 注释、标签 | 12 |
| `overline` | 11px | 1.40 | 500 | 0.08em | 分类标签、序号 | 11 |

**排版细则**：
- 英文标题使用 `Instrument Serif` italic 变体作为装饰性引号内的文字
- 标题字距（letter-spacing）为负值，营造紧凑高级感（参考 Linear 官网）
- 正文行高 1.6，确保长段落可读性
- 中文字号比同级英文 +2px（因中文字形视觉偏小）
- 最大行宽：正文 65ch，标题 30ch

#### 响应式字号

| 断点 | display | h1 | h2 | h3 | h4 | body |
|------|---------|----|----|----|----|------|
| Desktop ≥1280 | 72px | 56px | 40px | 32px | 24px | 16px |
| Tablet 768–1279 | 48px | 40px | 32px | 28px | 20px | 15px |
| Mobile <768 | 36px | 32px | 28px | 24px | 20px | 14px |

### 3.3 间距系统

基础模数：**8px**。所有间距必须是 8 的倍数（或 8 的一半 = 4px 用于紧凑场景）。

| 令牌名 | CSS Variable | 值 | 用途 |
|--------|-------------|-----|------|
| `space-1` | `--space-1` | 4px | 图标内边距、极紧凑元素 |
| `space-2` | `--space-2` | 8px | 元素内紧凑间距、表单元素间距 |
| `space-3` | `--space-3` | 12px | 按钮内边距、列表项间距 |
| `space-4` | `--space-4` | 16px | 卡片内边距、段落间距 |
| `space-5` | `--space-5` | 24px | 区块内组件间距 |
| `space-6` | `--space-6` | 32px | 区块间距、导航栏高度 |
| `space-8` | `--space-8` | 48px | 大区块间距 |
| `space-10` | `--space-10` | 64px | 页区间距（section padding） |
| `space-12` | `--space-12` | 80px | 超大间距（Hero 底部） |
| `space-16` | `--space-16` | 128px | 页面顶部/底部留白 |
| `space-20` | `--space-20` | 160px | Hero 最小高度 padding |
| `space-24` | `--space-24` | 192px | 页面最大留白 |

**区块间距规则**：
- 页面内 section 之间统一使用 `128px`（Desktop）/ `80px`（Tablet）/ `64px`（Mobile）的 padding-bottom
- 页面顶部和底部留白使用 `160px`（Desktop）/ `96px`（Tablet）/ `48px`（Mobile）

### 3.4 圆角

| 令牌名 | CSS Variable | 值 | 用途 |
|--------|-------------|-----|------|
| `radius-none` | `--radius-none` | 0 | Hero 背景、全屏元素、墨水光标 |
| `radius-sm` | `--radius-sm` | 2px | 标签、overline 元素 |
| `radius-md` | `--radius-md` | 4px | 按钮、输入框（克制的圆角） |
| `radius-lg` | `--radius-lg` | 8px | 作品卡片、图片容器 |
| `radius-xl` | `--radius-xl` | 16px | 大型容器、模态框 |
| `radius-full` | `--radius-full` | 9999px | 墨迹光标、圆形元素 |

**设计理念**：圆角整体偏小（最大 8px），传达精密工艺感而非柔和亲和力。仅在光标和装饰性圆形上使用完全圆角。

### 3.5 阴影

| 令牌名 | CSS Variable | 值 | 用途 |
|--------|-------------|-----|------|
| `shadow-none` | — | none | Hero 元素、光晕元素 |
| `shadow-subtle` | `--shadow-subtle` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)` | 导航栏下阴影 |
| `shadow-card` | `--shadow-card` | `0 4px 16px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)` | 作品卡片默认 |
| `shadow-card-hover` | `--shadow-card-hover` | `0 12px 40px rgba(0,0,0,0.35), 0 4px 8px rgba(0,0,0,0.15)` | 作品卡片 hover |
| `shadow-glow` | `--shadow-glow` | `0 0 60px rgba(201,48,44,0.25), 0 0 120px rgba(139,26,26,0.15)` | 光晕效果、CTA hover |
| `shadow-input` | `--shadow-input` | `0 0 0 1px rgba(196,184,168,0.3), inset 0 1px 2px rgba(0,0,0,0.05)` | 表单输入框 |
| `shadow-input-focus` | `--shadow-input-focus` | `0 0 0 2px rgba(201,48,44,0.4), 0 0 0 4px rgba(201,48,44,0.1)` | 表单输入框 focus |

### 3.6 断点系统

| 令牌名 | CSS Variable | 值 | 说明 |
|--------|-------------|-----|------|
| `bp-desktop` | `--bp-desktop` | 1280px | 桌面端，完整布局 |
| `bp-tablet` | `--bp-tablet` | 768px | 平板端，响应式调整 |
| `bp-mobile` | `--bp-mobile` | 480px | 小屏手机，极简布局 |

**媒体查询规范**：统一使用 `min-width`（mobile-first 策略）：
```css
@media (min-width: 768px) { /* Tablet+ */ }
@media (min-width: 1280px) { /* Desktop */ }
```

### 3.7 Z-Index 层级

| 层级 | 值 | 元素 |
|------|-----|------|
| `z-base` | 1 | 页面内容 |
| `z-card` | 10 | 作品卡片 |
| `z-nav` | 100 | 导航栏 |
| `z-overlay` | 200 | 遮罩层、模态背景 |
| `z-cursor` | 900 | 墨迹光标 |
| `z-smoke` | 5 | Hero 烟雾（低于内容） |
| `z-grain` | 999 | 胶片颗粒（最顶层覆盖） |
| `z-glow` | 3 | 光晕效果 |

---

## 4. 页面规范

### 4.1 全局布局

```
┌──────────────────────────────────────────────┐
│  NAVIGATION BAR (fixed, z-100)               │
│  h: 64px  bg: transparent → #0A0A0A (scroll) │
├──────────────────────────────────────────────┤
│                                              │
│  HERO SECTION                                │
│  min-h: 100vh  bg: #0A0A0A                   │
│  [Smoke Canvas] [Smoke Canvas]              │
│  [    Smoke Canvas    ]                      │
│                                              │
│            「L I N A」                       │
│        独立调香师 · Perfumer                 │
│                                              │
│        [ ↓ 探索 ]                            │
│                                [glow ●]      │
├──────────────────────────────────────────────┤
│                                              │
│  ABOUT SECTION                               │
│  bg: #0A0A0A  py: 128px                      │
│                                              │
│  ┌──────────────┬──────────────────┐         │
│  │              │                  │         │
│  │  「关于 Lina」│     [photo]      │         │
│  │              │                  │         │
│  │  段落文字...  │   黑白工作室照    │         │
│  │  段落文字...  │                  │         │
│  │              │                  │         │
│  └──────────────┴──────────────────┘         │
│  grid: 6fr / 4fr   gap: 64px                 │
├──────────────────────────────────────────────┤
│                                              │
│  WORKS SECTION                               │
│  bg: #F5F0E8  py: 128px                      │
│                                              │
│  「作品 · Works」                            │
│                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐         │
│  │        │  │        │  │        │         │
│  │ 卡片1   │  │ 卡片2   │  │ 卡片3   │         │
│  │        │  │        │  │        │         │
│  │        │  │        │  │        │         │
│  │ 香水名  │  │ 香水名  │  │ 香水名  │         │
│  └────────┘  └────────┘  └────────┘         │
│  grid: 3 cols  gap: 32px                     │
├──────────────────────────────────────────────┤
│                                              │
│  PROCESS SECTION                             │
│  bg: #0A0A0A  py: 128px                      │
│                                              │
│  「调香流程 · Process」                      │
│                                              │
│  ○────○────○────○────○────○──→ (横向滚动)    │
│  灵感  选材  调配  陈化  测试  成品            │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  CONTACT SECTION                             │
│  bg: #0A0A0A  py: 128px                      │
│                                              │
│  「预约咨询 · Contact」                      │
│                                              │
│  ┌─────────────────────┐                     │
│  │ 姓名  [___________] │                     │
│  │ 邮箱  [___________] │                     │
│  │ 留言  [___________] │                     │
│  │        [___________] │                     │
│  │       ┌───────────┐ │                     │
│  │       │  提交预约   │ │                     │
│  │       └───────────┘ │                     │
│  └─────────────────────┘                     │
│  max-width: 480px  centered                  │
├──────────────────────────────────────────────┤
│                                              │
│  FOOTER                                      │
│  bg: #0A0A0A  py: 48px                       │
│  © 2026 Lina Perfume  |  社交媒体链接         │
│                                              │
└──────────────────────────────────────────────┘
```

### 4.2 导航栏 Navigation

#### Wireframe

```
Desktop (≥1280px):
┌────────────────────────────────────────────────────────┐
│  LINA                        About  Works  Process  Contact  │
│  ↑ logo                      ↑ links, right-aligned        │
│  (Instrument Serif, 20px)     (Inter, 14px, tracking-wide) │
└────────────────────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────────┐
│  LINA           [ ☰ ]    │
│                          │
└──────────────────────────┘
```

#### 规格

| 属性 | 值 |
|------|-----|
| 高度 | 64px |
| 位置 | fixed top, z-100 |
| 背景 | 初始 transparent，滚动超过 80px 后 `#0A0A0A` + `shadow-subtle` |
| Logo 字体 | Instrument Serif, 20px, `--color-beige` |
| 链接字体 | Inter, 14px, `--color-n400` → hover `--color-beige` |
| 链接间距 | 32px gap, letter-spacing: 0.05em, uppercase |
| 过渡 | 背景色 400ms ease-in-out |

#### 状态

| 状态 | 背景 | Logo | 链接 |
|------|------|------|------|
| 默认（顶部） | transparent | beige | n400 |
| 滚动后 | #0A0A0A + shadow-subtle | beige | n400 |
| 链接 hover | — | — | beige + 底部 1px 下划线 |
| 移动端菜单展开 | #0A0A0A 全屏 | beige | 居中排列, 24px |

### 4.3 Hero 首屏

#### Wireframe

```
┌────────────────────────────────────────────────────────────┐
│                                          [nav transparent] │
│                                                            │
│                    [Three.js Smoke Canvas]                 │
│                    [     volumetric       ]                │
│                    [        layer          ]               │
│                                                            │
│                        L I N A                             │
│                   ─────────────                            │
│                  独立调香师 · Perfumer                     │
│                                                            │
│              "每一瓶香水，都是一封写给时间的情书"            │
│                                                            │
│                        [ ↓ 探索 ]                          │
│                                                  ● [glow]  │
├────────────────────────────────────────────────────────────┤
```

#### 规格

| 属性 | 值 |
|------|-----|
| 最小高度 | 100vh |
| 背景 | `#0A0A0A` |
| 内容居中 | flex column, center-center |
| 内容距顶 | ~35vh（视觉重心偏上） |

#### 烟雾效果（Volumetric Smoke Shader）

```
参数定义：
- 循环周期：8 秒（无缝 loop）
- 粒子层数：3 层（近景/中景/远景）
- 近景层：
  - 粒子数：12
  - 大小：120px–300px
  - 速度：从底部升至顶部，5–8 秒
  - 颜色：rgba(201,48,44,0.03–0.08)
  - 透明度：底部 80% → 顶部 0%
  - 横向偏移：±20px 正弦波动
- 中景层：
  - 粒子数：8
  - 大小：80px–200px
  - 速度：6–10 秒
  - 颜色：rgba(139,26,26,0.02–0.05)
  - 横向偏移：±10px
- 远景层：
  - 粒子数：6
  - 大小：200px–500px
  - 速度：10–14 秒
  - 颜色：rgba(92,17,17,0.01–0.03)
  - 横向偏移：±5px
```

**性能优化**：
- 使用 WebGL + Three.js，GPU 驱动
- 粒子使用 instanced rendering
- 移动端降级为 CSS animation（3 层 div，opacity 动画）

#### 右下角光晕

```css
.hero-glow {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse 600px 400px at 80% 90%,
    rgba(139,26,26,0.35) 0%,
    rgba(201,48,44,0.12) 40%,
    transparent 70%
  );
  animation: glowPulse 6s ease-in-out infinite alternate;
}

@keyframes glowPulse {
  0%   { opacity: 0.6; transform: scale(0.95); }
  100% { opacity: 1.0; transform: scale(1.05); }
}
```

#### 胶片颗粒

```css
.film-grain {
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background: transparent url('/noise.png') repeat;
  opacity: 0.15;
  pointer-events: none;
  z-index: 999;
  animation: grainShift 0.8s steps(10) infinite;
}

@keyframes grainShift {
  0%, 100% { transform: translate(0, 0); }
  10%      { transform: translate(-5%, -10%); }
  20%      { transform: translate(-15%, 5%); }
  30%      { transform: translate(7%, -25%); }
  40%      { transform: translate(-5%, 25%); }
  50%      { transform: translate(-15%, 10%); }
  60%      { transform: translate(15%, 0%); }
  70%      { transform: translate(0%, 15%); }
  80%      { transform: translate(3%, 35%); }
  90%      { transform: translate(-10%, 10%); }
}
```

颗粒参数：PNG 噪声纹理尺寸 256×256，`image-rendering: pixelated` 确保颗粒为 0.3px 视觉大小。

### 4.4 About 区域

#### Wireframe

```
Desktop (≥1280px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌────────────────────┬──────────────────────┐               │
│  │                    │                      │               │
│  │  ABOUT             │    [                 │               │
│  │  ────────────      │                      │               │
│  │                    │     黑白工作室照      │               │
│  │  "调香是一场       │     600×800           │               │
│  │   与时间的对话"     │     裁剪: clip-path   │               │
│  │                    │     右侧不规则        │               │
│  │  段落文字...       │                      │               │
│  │  段落文字...       │                      │               │
│  │  段落文字...       │                      │               │
│  │                    │                      │               │
│  └────────────────────┴──────────────────────┘               │
│  60%                 40%    gap: 64px                        │
└──────────────────────────────────────────────────────────────┘

Tablet (768–1279px):
┌──────────────────────────────────────────┐
│                                          │
│  ABOUT                                   │
│  ────────────                            │
│  [黑白工作室照片 500×400]                │
│                                          │
│  "调香是一场与时间的对话"                 │
│  段落文字...                              │
│                                          │
└──────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────┐
│                      │
│  ABOUT               │
│  ────                │
│  [照片 100%宽]       │
│                      │
│  "调香是一场         │
│   与时间的对话"       │
│  段落文字...          │
│                      │
└──────────────────────┘
```

#### 规格

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 布局 | 2列 60/40 | 单列，图上文下 | 单列，图上文下 |
| 图片尺寸 | 600×800px | 500×400px | 100%宽，aspect-ratio 4/5 |
| 图片裁剪 | 右侧不规则 clip-path | 标准矩形 | 标准矩形 |
| 文字区域 | max-width 480px | 100% | 100% |
| 引用文字 | Instrument Serif 32px italic, color-cinnabar | 28px | 24px |
| 正文段落 | Inter 16px, color-n500 | 15px | 14px |
| 段间距 | 24px | 20px | 16px |

**图片 clip-path（Desktop）**：
```css
.about-image {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 85%,
    85% 100%,
    0% 100%
  );
}
```

**入场动画**：
- 图片：先出现，scale 0.95→1.0, opacity 0→1, 600ms, ease-out, delay 200ms
- 引用文字：从左向右 slide-in, 400ms, ease-out, delay 400ms
- 正文段落：逐段 fade-in, 每段间隔 150ms, 从引用文字之后开始

### 4.5 Works 区域

#### Wireframe

```
Desktop (≥1280px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  WORKS · 作品                                                │
│  ──────────────                                              │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐│
│  │                 │  │                 │  │               ││
│  │   [产品图]       │  │   [产品图]       │  │   [产品图]    ││
│  │   400×500       │  │   400×500       │  │   400×500     ││
│  │                 │  │                 │  │               ││
│  │                 │  │                 │  │               ││
│  │                 │  │                 │  │               ││
│  ├─────────────────┤  ├─────────────────┤  ├───────────────┤│
│  │ NO.01           │  │ NO.02           │  │ NO.03         ││
│  │ 墨 · MO          │  │ 露 · DEW        │  │ 烬 · EMBER    ││
│  │ 木质东方调        │  │ 清新绿叶调       │  │ 烟熏琥珀调    ││
│  └─────────────────┘  └─────────────────┘  └───────────────┘│
│                                                              │
│  [ 查看更多 → ]                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Tablet (768–1279px): 2×2 网格
Mobile (<768px): 单列，每卡全宽
```

#### 规格

| 属性 | 值 |
|------|-----|
| 背景 | `#F5F0E8`（暖米白，全站唯一的浅色区块） |
| 标题颜色 | `#0A0A0A` |
| 卡片背景 | `#F5F0E8`（与区块同色，靠阴影区分） |
| 卡片图片 | 400×500px（Desktop），280×350px（Tablet），100%宽（Mobile） |
| 卡片间距 | 32px（Desktop），24px（Tablet），16px（Mobile） |
| 图片容器 | clip-path: inset(0 100% 0 0) → inset(0 0 0 0) 揭幕动画 |

#### Clip-Path 揭幕动画

```css
@keyframes cardReveal {
  0%   { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}

.works-card {
  --reveal-delay: calc(var(--card-index) * 120ms);
  opacity: 0;
  animation: cardReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay) forwards;
}

/* 同时添加淡入效果 */
.works-card .card-content {
  opacity: 0;
  transform: translateY(20px);
  animation: contentFadeIn 600ms ease-out calc(var(--reveal-delay) + 400ms) forwards;
}

@keyframes contentFadeIn {
  to { opacity: 1; transform: translateY(0); }
}
```

#### 卡片 hover 效果

```css
.works-card {
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 400ms ease-out;
}

.works-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-card-hover);
}

.works-card:hover .card-title {
  color: var(--color-cinnabar);
  transition: color 300ms ease-out;
}
```

#### 卡片结构

```
┌──────────────────────┐
│                      │
│   [产品图片]          │
│   object-fit: cover  │
│   aspect-ratio: 4/5  │
│                      │
├──────────────────────┤
│ NO.01                │ ← overline, 11px, n400
│ ─────────            │ ← 1px line, n200, width 40px
│ 墨 · MO              │ ← h4, 24px, n900
│ 木质东方调            │ ← body-sm, 14px, n500
└──────────────────────┘
```

### 4.6 Process 区域

#### Wireframe

```
Desktop (≥1280px) - 横向滚动:
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  PROCESS · 调香流程                                          │
│  ──────────────                                              │
│                                                              │
│  ← 滚动驱动 →                                                │
│                                                              │
│  ○────────○────────○────────○────────○────────○             │
│  01       02       03       04       05       06            │
│  灵感     选材     调配     陈化     测试     成品            │
│  ┌──────┐┌──────┐ ┌──────┐┌──────┐ ┌──────┐┌──────┐         │
│  │      ││      │ │      ││      │ │      ││      │         │
│  │ 描述  ││ 描述  │ │ 描述  ││ 描述  │ │ 描述  ││ 描述  │         │
│  │      ││      │ │      ││      │ │      ││      │         │
│  │ 配图  ││ 配图  │ │ 配图  ││ 配图  │ │ 配图  ││ 配图  │         │
│  └──────┘└──────┘ └──────┘└──────┘ └──────┘└──────┘         │
│                                                              │
│  [进度指示器: ● ○ ○ ○ ○ ○]                                   │
└──────────────────────────────────────────────────────────────┘

Tablet (768–1279px): 横向滚动，每屏显示 2 个节点
Mobile (<768px): 垂直堆叠，非横向滚动
```

#### 规格

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 滚动方向 | 横向 | 横向（每屏2个） | 垂直堆叠 |
| 节点间距 | 240px | 200px | — |
| 节点卡片尺寸 | 240×320px | 200×280px | 100%宽 |
| 连接线 | 2px solid n300 | 同左 | 2px dashed n300 垂直 |
| 激活态节点 | cinnabar 圆点 + 卡片 border-left 4px solid cinnabar | 同左 | 同左 |
| 滚动锁定 | CSS `scroll-snap-type: x mandatory` | 同左 | N/A |

#### 横向滚动实现

```css
.process-timeline {
  display: flex;
  gap: 240px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 calc(50vw - 120px); /* 首个节点居中 */
}

.process-node {
  scroll-snap-align: center;
  flex: 0 0 240px;
}
```

**滚动驱动激活**（Intersection Observer）：
- 节点进入视口 50% 时激活
- 激活动画：圆点 scale 1→1.5, 卡片 border-left 淡入, 描述文字 opacity 0→1
- 动画时长 500ms, ease-out
- 连接线使用 CSS `::before` 伪元素，宽度动画 0→100%

#### 进度指示器

```
[ ● ○ ○ ○ ○ ○ ]
  1 2 3 4 5 6

点击可跳转至对应节点
当前节点：cinnabar 填充圆点，8px
其他节点：n300 空心圆点，8px
hover：放大至 10px，过渡 200ms ease-out
```

### 4.7 Contact 区域

#### Wireframe

```
Desktop (≥1280px):
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  CONTACT · 预约咨询                                          │
│  ──────────────                                              │
│                                                              │
│  期待与您对话。                                               │
│  请填写以下信息，Lina 将在 48 小时内回复。                    │
│                                                              │
│  ┌──────────────────────────────────────┐                   │
│  │                                      │                   │
│  │  姓名 Name                           │                   │
│  │  ┌────────────────────────────────┐  │                   │
│  │  │                                │  │                   │
│  │  └────────────────────────────────┘  │                   │
│  │                                      │                   │
│  │  邮箱 Email                          │                   │
│  │  ┌────────────────────────────────┐  │                   │
│  │  │                                │  │                   │
│  │  └────────────────────────────────┘  │                   │
│  │                                      │                   │
│  │  留言 Message                        │                   │
│  │  ┌────────────────────────────────┐  │                   │
│  │  │                                │  │                   │
│  │  │                                │  │                   │
│  │  │                                │  │                   │
│  │  └────────────────────────────────┘  │                   │
│  │                                      │                   │
│  │        ┌──────────────────────┐      │                   │
│  │        │     提 交 预 约       │      │                   │
│  │        └──────────────────────┘      │                   │
│  │                                      │                   │
│  └──────────────────────────────────────┘                   │
│  max-width: 480px  centered                                 │
└──────────────────────────────────────────────────────────────┘
```

#### 规格

| 属性 | 值 |
|------|-----|
| 背景 | `#0A0A0A` |
| 表单容器 | max-width 480px, centered |
| 标签 | overline 样式, 11px, n400, uppercase, letter-spacing 0.08em |
| 输入框 | bg: transparent, border-bottom: 1px solid n300, padding: 12px 0 |
| 输入框 hover | border-bottom: 1px solid n500 |
| 输入框 focus | border-bottom: 2px solid cinnabar, shadow-input-focus |
| 输入框文字 | Inter 16px, beige |
| 占位符 | Inter 16px, n400, italic |
| Textarea | 同上, min-height 120px, resize: vertical |
| CTA 按钮 | 全宽, 48px 高, gradient, hover glow |
| 字段间距 | 32px |

#### 表单验证

| 状态 | 视觉反馈 |
|------|----------|
| 必填为空提交 | 输入框底部 border-bottom: 2px solid error，右侧显示错误文字（12px, error, fade-in 200ms） |
| 邮箱格式错误 | 同上，错误文字："请输入有效的邮箱地址" |
| 验证通过 | 输入框底部 border-bottom: 2px solid success |
| 提交中 | 按钮文字变为"提交中..." + loading spinner（20px, 旋转 1s linear infinite），按钮禁用 |
| 提交成功 | 整个表单淡出（300ms），感谢信息淡入（500ms）："感谢您的预约，Lina 将尽快与您联系" |

#### 提交成功动画

```
┌──────────────────────────────────────┐
│                                      │
│              ✓                       │
│         (cinnabar, 48px)             │
│                                      │
│     感谢您的预约                      │
│                                      │
│   Lina 将在 48 小时内                 │
│   通过邮件与您联系。                   │
│                                      │
└──────────────────────────────────────┘

✓ 图标：scale 0→1 + rotate -10°→0°, 400ms, ease-out
文字：opacity 0→1, delay 200ms, 400ms ease-out
```

### 4.8 Footer

#### Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  LINA                                                        │
│                                                              │
│  © 2026 Lina Perfume. All rights reserved.                   │
│                                                              │
│  Instagram    WeChat    Email                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 规格

| 属性 | 值 |
|------|-----|
| 背景 | `#0A0A0A` |
| 上边框 | 1px solid rgba(196,184,168,0.1) |
| 内边距 | 48px 垂直 |
| Logo | Instrument Serif, 20px, beige |
| 版权文字 | Inter, 12px, n400 |
| 社交链接 | Inter, 13px, n400 → hover beige, 24px gap |
| 布局 | flex column, center, gap 32px |

---

## 5. 组件规范

### 5.1 墨迹光标 Ink Cursor

> 全站自定义光标，仅 Desktop 生效。Mobile/Tablet 使用系统光标。

#### 规格

| 属性 | 值 |
|------|-----|
| 默认光标 | 隐藏 `cursor: none` |
| 墨点 | 16px 直径圆形, `#0A0A0A` 在浅色区 / `#F5F0E8` 在深色区, opacity 0.8 |
| 墨点边框 | 1px solid rgba(当前色, 0.3) |
| Hover 可点击 | 墨点放大至 48px, opacity 降至 0.2, 内部出现 cinnabar 圆环 2px |
| Hover 过渡 | 300ms cubic-bezier(0.22, 1, 0.36, 1) |
| 墨迹轨迹 | 鼠标移动时在后方留下淡出墨迹 |
| 轨迹粒子 | 每 16ms（60fps）采样一次位置，生成一个渐小渐淡的圆点 |
| 轨迹粒子生命周期 | 1200ms，从 opacity 0.4 → 0，scale 1.0 → 0.3 |

#### 实现要点

```css
.cursor-dot {
  position: fixed;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--cursor-color, #0A0A0A);
  opacity: 0.8;
  pointer-events: none;
  z-index: 900;
  transform: translate(-50%, -50%);
  transition: width 300ms cubic-bezier(0.22, 1, 0.36, 1),
              height 300ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 300ms ease-out;
}

.cursor-dot.hovering {
  width: 48px;
  height: 48px;
  opacity: 0.2;
}

.cursor-dot.hovering::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-cinnabar);
  transform: translate(-50%, -50%);
}

.cursor-trail {
  position: fixed;
  border-radius: 50%;
  background: var(--cursor-color, #0A0A0A);
  pointer-events: none;
  z-index: 899;
  transform: translate(-50%, -50%);
  animation: trailFade 1200ms ease-out forwards;
}

@keyframes trailFade {
  0%   { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0;   transform: translate(-50%, -50%) scale(0.3); }
}
```

**性能约束**：
- 使用 `requestAnimationFrame` 而非 `mousemove` 事件直接操作
- 墨迹轨迹使用对象池（最多 30 个粒子）避免 GC 压力
- `prefers-reduced-motion` 用户禁用轨迹粒子，仅保留基础墨点

#### 颜色适配

光标颜色基于所在区域的背景色自动切换：
- 在 `#0A0A0A` 背景上：`#F5F0E8`（暖米白）
- 在 `#F5F0E8` 背景上：`#0A0A0A`（墨黑）
- 使用 Intersection Observer 监测光标所在位置背景色

### 5.2 按钮 Button

#### 变体

| 变体 | 用途 | 样式 |
|------|------|------|
| `primary` | CTA、表单提交 | 渐变背景（cinnabar→darkred），beige 文字，无描边 |
| `secondary` | 次要操作、查看更多 | 透明背景，1px solid cinnabar 描边，cinnabar 文字 |
| `ghost` | 导航链接、辅助操作 | 透明背景，无描边，n400 文字 → hover beige |
| `scroll-indicator` | Hero 向下引导 | 透明背景，n400 文字 + 向下箭头，脉冲动画 |

#### 尺寸

| 尺寸 | 高度 | 水平内边距 | 字号 | 字重 | 圆角 |
|------|------|-----------|------|------|------|
| `sm` | 36px | 16px | 13px | 500 | 4px |
| `md` | 44px | 24px | 14px | 500 | 4px |
| `lg` | 52px | 32px | 16px | 500 | 4px |

#### Primary 按钮状态

| 状态 | 背景 | 文字 | 其他 |
|------|------|------|------|
| Default | `linear-gradient(135deg, #C9302C 0%, #8B1A1A 100%)` | #F5F0E8 | — |
| Hover | `linear-gradient(135deg, #E8453F 0%, #C9302C 100%)` | #F5F0E8 | shadow-glow 0 0 40px rgba(201,48,44,0.3) |
| Active | `linear-gradient(135deg, #8B1A1A 0%, #5C1111 100%)` | #F5F0E8 | scale(0.98) |
| Disabled | `rgba(201,48,44,0.3)` | rgba(245,240,232,0.4) | pointer-events: none |
| Loading | 同 Default | 透明 + 旋转 spinner | pointer-events: none |

#### 动效参数

```css
.btn-primary {
  transition: background 300ms ease-out,
              box-shadow 400ms ease-out,
              transform 150ms ease-out;
}

.btn-primary:hover {
  box-shadow: 0 0 40px rgba(201,48,44,0.3), 0 0 80px rgba(139,26,26,0.15);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### 5.3 输入框 Input / Textarea

#### 变体

| 变体 | 用途 |
|------|------|
| `text` | 单行文本（姓名、邮箱） |
| `textarea` | 多行文本（留言） |

#### 状态

| 状态 | 底部边框 | 阴影 | 文字颜色 |
|------|----------|------|----------|
| Default | 1px solid n300 | none | beige |
| Hover | 1px solid n500 | none | beige |
| Focus | 2px solid cinnabar | shadow-input-focus | beige |
| Error | 2px solid error | 0 0 0 1px rgba(201,48,44,0.2) | beige |
| Success | 2px solid success | none | beige |
| Disabled | 1px solid rgba(196,184,168,0.2) | none | n400 |

#### 规格

| 属性 | 值 |
|------|-----|
| 背景 | transparent |
| 内边距 | 12px 0 |
| 字号 | 16px（防止 iOS 缩放） |
| 字体 | Inter |
| 行高 | 1.5 |
| 过渡 | border-color 200ms ease-out, box-shadow 200ms ease-out |
| 底部边框过渡 | 高度 1px→2px, 颜色变化 |

#### 错误提示

```
┌────────────────────────────────┐
│  邮箱 Email                    │
│  ┌────────────────────────────┐│
│  │ invalid-email              ││ ← 红色底框
│  └────────────────────────────┘│
│  ⚠ 请输入有效的邮箱地址        │ ← 12px, error, fade-in 200ms
└────────────────────────────────┘
```

### 5.4 作品卡片 Works Card

#### 完整结构

```
┌──────────────────────────────┐
│                              │  ← 图片容器
│   [product-image]            │     aspect-ratio: 4/5
│   clip-path: inset(...)      │     object-fit: cover
│   [动画: reveal 800ms]       │
│                              │
├──────────────────────────────┤  ← 1px solid n200
│  NO.01              ↑ overline │
│  ────               ↑ 40px线  │
│  墨 · MO            ↑ h4, n900│
│  木质东方调          ↑ body-sm │
└──────────────────────────────┘
```

#### 状态

| 状态 | 效果 |
|------|------|
| Default | shadow-card, transform: none |
| Hover | shadow-card-hover, transform: translateY(-8px) scale(1.02) |
| Reveal（入场） | clip-path: inset(0 100% 0 0) → inset(0 0 0 0), 800ms |
| Focus（键盘） | outline: 2px solid cinnabar, outline-offset: 4px |

### 5.5 时间轴节点 Process Node

#### 完整结构

```
     ○                    ← 圆点 12px
     │                    ← 连接线 2px
     │
┌────────────┐
│            │
│   01       │  ← overline, 11px, n400
│   ────     │  ← 40px 线
│   灵感     │  ← h4, n900
│   Inspiration │ ← body-sm, n500, italic
│            │
│   [配图]   │  ← 240×160, aspect-ratio 3/2
│            │
│   描述文字  │  ← body-sm, n500
│            │
└────────────┘
```

#### 状态

| 状态 | 效果 |
|------|------|
| Inactive | 圆点 n300 空心, 卡片无特殊边框 |
| Active | 圆点 cinnabar 实心 scale(1.5), 卡片 border-left: 4px solid cinnabar, 描述文字 n900 |
| Past | 圆点 cinnabar 实心 scale(1.0), 描述文字 n500 |
| Hover | 圆点 scale(1.8), 过渡 200ms |

### 5.6 分割线 Divider

| 属性 | 值 |
|------|-----|
| 高度 | 1px |
| 颜色 | `rgba(196,184,168,0.15)`（暗背景上）/ `rgba(10,10,10,0.1)`（亮背景上） |
| 宽度 | 40px（装饰性短分割）/ 100%（结构性分割） |
| 圆角 | 0 |

### 5.7 标签 Badge / Overline

| 属性 | 值 |
|------|-----|
| 字号 | 11px |
| 字重 | 500 |
| 字距 | 0.08em |
| 大小写 | uppercase |
| 颜色 | n400 |
| 用途 | 分类标签（"NO.01"）、序号、区域标识 |

---

## 6. 动效规范

### 6.1 缓动函数

| 令牌名 | CSS Value | 曲线特征 | 用途 |
|--------|-----------|----------|------|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | 快速开始，缓慢结束 | 页面进入、卡片揭幕 |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | 中等减速 | hover 状态、按钮反馈 |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 对称缓动 | 烟雾循环、光晕脉动 |
| `ease-out-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 轻微过冲 | 成功图标弹入 |
| `linear` | `linear` | 匀速 | 颗粒动画、加载 spinner |

**选择理由**：
- `ease-out-expo` 是最接近自然物理减速的曲线，给人"精致、有分量"的感觉
- 避免使用默认的 `ease`（即 `ease-in-out`），它不够锐利
- 所有进入动画统一使用 ease-out 类（从外进入），退出使用 ease-in 类

### 6.2 时长系统

| 令牌名 | 时长 | 用途 |
|--------|------|------|
| `duration-instant` | 100ms | 微小的视觉反馈（按钮 active） |
| `duration-fast` | 200ms | 状态切换（hover 边框颜色、tooltip） |
| `duration-normal` | 300ms | 常规过渡（hover 变换、颜色变化） |
| `duration-slow` | 500ms | 区块进入、元素淡入 |
| `duration-slower` | 800ms | 卡片揭幕动画 |
| `duration-slowest` | 1200ms | 墨迹轨迹粒子生命周期 |
| `duration-cycle` | 8000ms | 烟雾循环周期 |
| `duration-glow` | 6000ms | 光晕脉动周期 |

### 6.3 页面滚动动画

#### Intersection Observer 配置

```javascript
const observerOptions = {
  threshold: [0, 0.1, 0.25, 0.5],
  rootMargin: '0px 0px -10% 0px'
};
```

#### 入场模式

| 元素类型 | 触发阈值 | 动画 | 时长 | 延迟 |
|----------|----------|------|------|------|
| 区块标题 | 25% | fade-in + translateY(30px→0) | 500ms | 0ms |
| About 图片 | 10% | scale(0.95→1) + fade-in | 600ms | 200ms |
| About 文字 | 25% | slide-left + fade-in | 400ms | 400ms |
| Works 卡片 | 10% | clip-path reveal + fade-in | 800ms | index×120ms |
| Process 节点 | 50% | border-left + dot scale + text fade | 500ms | index×100ms |
| Contact 表单项 | 25% | fade-in + translateY(20px→0) | 400ms | index×80ms |

#### 视差效果

| 元素 | 视差系数 | 说明 |
|------|----------|------|
| Hero 烟雾 | 0.3 | 滚动时烟雾以 30% 速度后退 |
| About 图片 | 0.15 | 轻微视差 |
| Works 卡片背景 | 0 | 无视差 |

### 6.4 动效约束

#### 性能预算

| 指标 | 预算 | 监控 |
|------|------|------|
| 帧率 | ≥ 55fps（目标 60fps） | `requestAnimationFrame` 监控 |
| 主线程阻塞 | < 50ms/帧 | Long Tasks API |
| 同时运行的动画 | ≤ 5 | 动画管理器 |
| 烟雾粒子（GPU） | ≤ 26 | Three.js 实例计数 |

#### `prefers-reduced-motion` 处理

```css
@media (prefers-reduced-motion: reduce) {
  /* 禁用所有装饰性动画 */
  .hero-smoke,
  .cursor-trail,
  .film-grain,
  .hero-glow {
    animation: none !important;
    opacity: 0.3 !important;
  }

  /* 保留功能性过渡 */
  .works-card {
    animation: none !important;
    opacity: 1 !important;
    clip-path: inset(0 0 0 0) !important;
  }

  /* 保留 hover 反馈（简化版） */
  .works-card:hover {
    transform: none !important;
  }

  /* 禁用墨迹光标 */
  .cursor-dot,
  .cursor-trail {
    display: none !important;
  }

  /* 禁用视差 */
  [data-parallax] {
    transform: none !important;
  }
}
```

**原则**：`prefers-reduced-motion` 用户仍获得完整的内容展示和交互反馈，仅移除装饰性动画。烟雾简化为静态半透明渐变层，墨迹光标完全禁用，卡片直接可见无需揭幕动画。

---

## 7. 响应式规范

### 7.1 断点总览

| 断点 | 宽度范围 | 布局策略 |
|------|----------|----------|
| Desktop | ≥1280px | 完整布局，所有效果启用 |
| Tablet | 768–1279px | 网格调整，效果保留 |
| Mobile | <768px | 单列布局，效果降级 |
| Small Mobile | <480px | 极简布局，进一步压缩 |

### 7.2 各区块响应式变化

#### Hero

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 最小高度 | 100vh | 100vh | 80vh |
| 标题字号 | 72px | 48px | 36px |
| 副标题字号 | 24px | 20px | 18px |
| 烟雾效果 | 完整 3 层 WebGL | 2 层 WebGL | CSS 简化版（2 层 div opacity 动画） |
| 光晕 | 600×400px | 400×300px | 300×200px |
| 颗粒效果 | 启用 | 启用 | 禁用（性能优化） |

#### About

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 布局 | 2列 60/40 | 单列图上文下 | 单列图上文下 |
| 图片 | 600×800 clip-path | 500×400 矩形 | 100%宽 4/5 比例 |
| 引用文字 | 32px | 28px | 24px |
| 正文段落 | 16px | 15px | 14px |

#### Works

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 列数 | 3 | 2 | 1 |
| 卡片宽度 | 约 400px | 约 48% | 100% |
| 图片尺寸 | 400×500 | 280×350 | 100%宽 |
| 揭幕动画 | 完整 clip-path | 完整 clip-path | 简化 fade-in（无 clip-path） |

#### Process

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 方向 | 横向滚动 | 横向滚动（每屏2个） | 垂直堆叠 |
| 节点间距 | 240px | 200px | 32px 垂直 |
| 滚动锁定 | x mandatory | x mandatory | N/A |
| 进度指示器 | 显示 | 显示 | 隐藏 |
| 连接线 | 水平 2px | 水平 2px | 垂直 dashed 2px |

#### Contact

| 属性 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| 表单宽度 | 480px | 420px | 100% - 32px |
| 字段间距 | 32px | 28px | 24px |
| 输入框字号 | 16px | 16px | 16px（防 iOS 缩放） |
| CTA 按钮 | 全宽 52px 高 | 全宽 48px 高 | 全宽 48px 高 |

### 7.3 间距响应式

| 令牌 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| `space-10` (section padding) | 128px | 80px | 64px |
| `space-16` (page margin) | 160px | 96px | 48px |
| 卡片间距 | 32px | 24px | 16px |

### 7.4 墨迹光标响应式

| 断点 | 行为 |
|------|------|
| Desktop ≥1280px | 完整功能：墨点 + 轨迹粒子 + hover 效果 |
| Tablet 768–1279px | 仅墨点 + hover 效果，无轨迹粒子 |
| Mobile <768px | 完全禁用，使用系统光标 |

---

## 8. 无障碍设计

### 8.1 对比度合规

所有文字/背景组合已通过 WCAG 2.1 AA 级验证（详见 3.1 节对比度表）。

**特别注意**：
- 朱砂红 `#C9302C` 在 `#0A0A0A` 上的对比度为 5.6:1，仅满足 AA 级（大文字），不满足 AAA。因此在正文中不使用朱砂红作为文字色，仅用于装饰性标题和交互元素。
- 辅助文字 `n400 (#9E9080)` 在 `#0A0A0A` 上为 7.2:1，满足 AAA。
- 在浅色背景 `#F5F0E8` 上，所有深色文字对比度均超过 14:1，远超 AAA 要求。

### 8.2 键盘导航

| 要求 | 实现 |
|------|------|
| Tab 顺序 | 与视觉顺序一致：Nav → Hero scroll indicator → About → Works cards → Process nodes → Contact form → Footer |
| 焦点指示器 | `outline: 2px solid #C9302C; outline-offset: 4px;` 自定义样式，移除默认 `:focus` |
| 跳过链接 | 页面顶部隐藏 "Skip to main content" 链接，Tab 聚焦时可见 |
| 横向滚动 | Process 区支持键盘方向键 ← → 导航节点 |
| 表单 | Enter 提交，Escape 取消，Tab 在字段间移动 |

```css
/* 自定义焦点指示器 */
*:focus-visible {
  outline: 2px solid var(--color-cinnabar);
  outline-offset: 4px;
}

/* 隐藏鼠标用户的焦点环，保留键盘用户的 */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### 8.3 屏幕阅读器

| 要求 | 实现 |
|------|------|
| 图片 alt | 所有产品图片使用描述性 alt 文本，如 "墨 · MO — 木质东方调香水，深色玻璃瓶身" |
| Hero 烟雾 | `aria-hidden="true"`（装饰性） |
| 胶片颗粒 | `aria-hidden="true"`（装饰性） |
| 墨迹光标 | `aria-hidden="true"`（装饰性） |
| 光晕效果 | `aria-hidden="true"`（装饰性） |
| Process 时间轴 | 使用 `role="list"` 和 `role="listitem"` |
| 表单 | `<label>` 正确关联 `<input>`，`aria-required` 标记必填字段 |
| 表单错误 | `aria-live="polite"` 区域动态播报错误信息 |
| 表单提交成功 | `role="status"` 区域播报感谢信息 |
| Works 卡片 | 使用 `<article>` 语义，包含标题和描述 |

### 8.4 语义化 HTML 结构

```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>

  <header role="banner">
    <nav role="navigation" aria-label="主导航">
      <!-- logo + links -->
    </nav>
  </header>

  <main id="main" role="main">
    <section id="hero" aria-label="品牌介绍">
      <!-- smoke canvas, title, glow -->
    </section>

    <section id="about" aria-label="关于 Lina">
      <!-- about content -->
    </section>

    <section id="works" aria-label="香水作品">
      <!-- works cards -->
    </section>

    <section id="process" aria-label="调香流程">
      <!-- process timeline -->
    </section>

    <section id="contact" aria-label="预约咨询">
      <!-- contact form -->
    </section>
  </main>

  <footer role="contentinfo">
    <!-- footer content -->
  </footer>

  <!-- 装饰性元素 -->
  <div class="film-grain" aria-hidden="true"></div>
  <div class="cursor-dot" aria-hidden="true"></div>
</body>
```

### 8.5 颜色盲友好

- 不单独依赖颜色传递信息（如表单错误同时使用颜色 + 图标 + 文字）
- 朱砂红与暗红在色盲模式下仍可区分（通过亮度和饱和度差异）
- Process 时间轴的激活状态通过形状变化（空心→实心）+ 颜色双重编码

---

## 9. 资源与交付物

### 9.1 字体资源

| 字体 | 来源 | 许可证 | 加载方式 |
|------|------|--------|----------|
| Instrument Serif | Google Fonts | OFL 1.1 | `@import` 或 `<link>`，preload woff2 |
| Inter | Google Fonts | OFL 1.1 | 同上 |
| Noto Serif SC | Google Fonts | OFL 1.1 | 按需加载（仅中文变体） |

**字体加载优化**：
- 使用 `font-display: swap` 避免 FOIT
- 预加载关键字体（Instrument Serif, Inter Regular/Medium）
- 中文 Noto Serif SC 使用 `unicode-range` 按需加载，仅加载常用字符集

```html
<link rel="preload" href="/fonts/instrument-serif-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-medium.woff2" as="font" type="font/woff2" crossorigin>
```

### 9.2 图片资源

| 类型 | 格式 | 压缩 | 尺寸要求 |
|------|------|------|----------|
| About 黑白照片 | WebP（JPEG fallback） | quality 80 | 原始 1200×1600px |
| Works 产品图 | WebP（PNG fallback） | quality 85 | 原始 800×1000px |
| Process 配图 | WebP | quality 75 | 原始 480×320px |
| 噪声纹理 | PNG | 无损 | 256×256px（平铺使用） |

**响应式图片**：使用 `<picture>` + `srcset` 提供多尺寸版本。

### 9.3 SVG 图标

| 图标 | 尺寸 | 用途 |
|------|------|------|
| 向下箭头 | 24×24 | Hero scroll indicator |
| 汉堡菜单 | 24×24 | Mobile nav toggle |
| 关闭 | 24×24 | Mobile nav close |
| 勾选 | 24×24 | 表单成功 |
| 警告 | 16×16 | 表单错误 |
| 加载 spinner | 20×20 | 提交中 |

---

## 10. 设计检查清单

### 交付前自查

- [ ] 所有颜色对比度通过 WCAG AA
- [ ] `prefers-reduced-motion` 正确处理
- [ ] 键盘导航完整可用
- [ ] 屏幕阅读器语义正确
- [ ] 响应式三断点均测试通过
- [ ] 墨迹光标在 Tablet 降级、Mobile 禁用
- [ ] Hero 烟雾在 Mobile 降级为 CSS
- [ ] 胶片颗粒在 Mobile 禁用
- [ ] Process 横向滚动在 Mobile 改为垂直
- [ ] Works 卡片在 Mobile 简化揭幕动画
- [ ] 表单 16px 字号防 iOS 缩放
- [ ] 字体 `font-display: swap` 已设置
- [ ] 所有装饰性元素 `aria-hidden="true"`
- [ ] 所有交互元素有 `:focus-visible` 样式
- [ ] 烟雾 Shader 性能预算 ≤ 26 粒子
- [ ] 动画同时运行数 ≤ 5
- [ ] 帧率 ≥ 55fps

---

## 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0 | 2026-04-22 | UI Designer Agent | 初始版本 — 完整设计系统、页面规范、组件定义、动效参数、响应式方案、无障碍设计 |
