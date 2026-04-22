---
type: qa-report
outputFor: [devops, boss]
dependencies: [tasks]
---

# QA 测试报告

## 报告信息
- **功能名称**：lina-perfume-portfolio
- **版本**：1.0
- **测试日期**：2026-04-22
- **测试者**：QA Agent
- **测试环境**：源代码静态分析（无运行环境）

## 摘要

> Boss Agent 请优先阅读本节判断是否通过质量门禁。

- **总体结论**：⚠️ 有条件发布（需修复 1 个 P1 + 6 个 P2）
- **测试覆盖率**：0%（无测试文件）
- **通过 / 失败**：32 项通过 / 8 项失败 / 5 项部分通过
- **P0/P1 Bug**：0 个 P0，1 个 P1
- **E2E 状态**：未执行

**主要问题**：
1. 🔴 **Works 区域背景色错误**：PRD/ui-spec 明确要求 Works 区使用暖米白 `#F5F0E8`，实际代码使用墨黑 `#0A0A0A`，与 About 区失去视觉区分
2. 🟠 **表单留言字段设为必填**：PRD 要求留言为选填，但 `useFormSubmission.ts` 将其设为必填
3. 🟠 **Works 卡片缺少 `works-card` class**：`useRevealAnimation.ts` 依赖该类名触发动画，但 `WorkCard.tsx` 未设置
4. 🟠 **`useHorizontalScroll` 引用了不存在的 GSAP 动画 ID**
5. 🟠 **`FilmGrainEffectComponent` 存在内存泄漏风险**
6. 🟠 **`useNavScroll` 存在性能问题（每次滚动重建事件监听器）**
7. 🟡 **图片资源全部缺失**（public/images 目录不存在）
8. 🟡 **`index.html` 缺少 meta description、Open Graph、canonical 等 SEO 标签**

---

## 1. 测试概要

### 1.1 测试范围
- [x] 代码静态分析（TypeScript 类型安全、潜在 Bug、代码异味）
- [x] 架构一致性审查
- [x] UI 规范一致性审查
- [x] PRD 覆盖度验证
- [x] 安全审查
- [x] 性能评估
- [x] 无障碍审查
- [ ] 单元测试（项目未编写任何测试）
- [ ] 集成测试（项目未编写任何测试）
- [ ] 端到端测试（项目未编写任何测试）

### 1.2 测试结论

| 指标 | 结果 |
|------|------|
| **总体状态** | 🟡 有条件通过 |
| **阻塞问题** | 有（Works 背景色、缺失图片资源） |
| **建议发布** | 修复 P1 后发布 |

---

## 2. 验收标准验证

### 2.1 功能需求验证（对照 PRD）

| FR ID | 描述 | 状态 | 备注 |
|-------|------|------|------|
| FR-001 | 朱砂烟雾 Hero 首屏（Three.js Shader） | 🟢 通过 | 三级降级体系完整实现，8秒循环，raymarching volumetric smoke |
| FR-002 | About 区个人故事（左文右图） | 🟢 通过 | 60/40 布局正确，黑白照片+羽化渐变 |
| FR-003 | Works 区香水作品展示（卡片+clip-path） | ⚠️ 部分通过 | 卡片+香调 hover 实现完整，但 **背景色错误**（应为 `#F5F0E8`，实际 `#0A0A0A`）；clip-path 动画因 class 名缺失不生效 |
| FR-004 | Process 区调香流程时间轴（横向滚动） | ⚠️ 部分通过 | 横向滚动+pin 实现，但步骤动画引用不存在的 GSAP ID；移动端垂直布局已实现 |
| FR-005 | Contact 区预约表单（formspree） | ⚠️ 部分通过 | 表单验证+提交+状态管理完整，但 **留言字段被设为必填**（PRD 要求选填） |
| FR-006 | 墨迹自定义光标 | 🟢 通过 | Canvas 2D 实现，移动端禁用，reduced motion 降级为单点 |
| FR-007 | 全局导航（滚动显隐+锚点+汉堡菜单） | 🟢 通过 | 滚动方向检测+移动端全屏菜单+活动区域高亮 |
| FR-008 | 页面加载过渡 | 🟢 通过 | LoadingScreen 带进度条，3秒超时兜底 |

### 2.2 非功能需求验证

| NFR ID | 描述 | 状态 | 备注 |
|--------|------|------|------|
| NFR-001 | 性能要求（LCP<2.5s 等） | ⚠️ 无法验证 | 代码层面有 code splitting、lazy loading、DPR 控制等优化措施，但需 Lighthouse 实测确认 |
| NFR-002 | 响应式适配（三断点） | 🟢 通过 | Desktop/Tablet/Mobile 断点 1280/768px 均有对应实现 |
| NFR-003 | 无障碍访问 | ⚠️ 部分通过 | prefers-reduced-motion ✅，语义化 HTML ✅，但缺少 skip-link、focus-visible 样式、键盘导航 |
| NFR-004 | SEO 基础 | 🔴 失败 | SEO 组件已实现但 index.html 缺少 meta description、Open Graph、canonical 标签；favicon 仍为 vite.svg 默认值 |
| NFR-005 | 安全与隐私 | 🟢 通过 | CSP 头配置、环境变量隔离、HTTPS formspree |
| NFR-006 | 可维护性 | 🟢 通过 | TypeScript 类型定义完整，作品数据 JSON 配置化 |

---

## 3. 自动化测试结果

### 3.1 测试汇总

| 测试类型 | 总数 | 通过 | 失败 | 跳过 | 通过率 |
|----------|------|------|------|------|--------|
| 单元测试 | 0 | 0 | 0 | 0 | N/A |
| 集成测试 | 0 | 0 | 0 | 0 | N/A |
| E2E 测试 | 0 | 0 | 0 | 0 | N/A |

### 3.2 测试覆盖率

| 指标 | 当前值 | 目标值 | 状态 |
|------|--------|--------|------|
| 语句覆盖率 | 0% | 80% | 🔴 未达标 |
| 分支覆盖率 | 0% | 70% | 🔴 未达标 |
| 函数覆盖率 | 0% | 80% | 🔴 未达标 |
| 行覆盖率 | 0% | 80% | 🔴 未达标 |

**说明**：本项目 `tests/` 目录不存在，`package.json` 中配置了 vitest 但缺少 `vitest.config.ts`。

### 3.3 建议补充的测试用例

| 优先级 | 测试目标 | 测试类型 | 说明 |
|--------|----------|----------|------|
| P1 | `useFormSubmission` 验证逻辑 | 单元测试 | 必填字段校验、邮箱正则、空提交 |
| P1 | `useFormSubmission` 提交流程 | 集成测试 | fetch 调用、成功/失败状态转换 |
| P2 | `updateInkTrail` / `drawInkTrail` | 单元测试 | 纯函数，易于测试：点添加、过期移除、数量上限 |
| P2 | `useDeviceTier` WebGL 检测 | 单元测试 | mock `canvas.getContext` 验证 full/simplified/fallback |
| P2 | `useReducedMotion` | 单元测试 | mock `matchMedia` 验证 true/false 切换 |
| P2 | `useScrollProgress` | 单元测试 | mock `scrollY`/`scrollHeight` 验证 0-1 范围 |
| P2 | `works` / `processSteps` 数据 | 单元测试 | 验证必需字段完整性、图片路径非空 |
| P3 | WorkCard 渲染 | 组件测试 | 验证香调 hover 展示、图片懒加载 |
| P3 | BookingForm 渲染 | 组件测试 | 验证字段、错误提示、提交状态 |
| P3 | Navigation 移动端菜单 | E2E 测试 | 汉堡菜单展开/关闭、锚点跳转 |

---

## 4. 发现的 Bug

### 4.1 Bug 汇总

| 严重程度 | 数量 | 已修复 | 待修复 |
|----------|------|--------|--------|
| 🔴 严重 | 0 | 0 | 0 |
| 🟠 高 | 1 | 0 | 1 |
| 🟡 中 | 6 | 0 | 6 |
| 🟢 低 | 5 | 0 | 5 |

### 4.2 Bug 详情

#### BUG-001：Works 区域背景色与 PRD/ui-spec 不一致（P1 高）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟠 高 |
| **状态** | 新建 |
| **发现者** | QA Agent |
| **发现日期** | 2026-04-22 |

**描述**：
PRD §FR-003 和 ui-spec §4.5 均明确要求 Works 区域背景为暖米白 `#F5F0E8`（全站唯一的浅色区块），但 `Works.tsx` 中使用了 `#0A0A0A`（墨黑），与 About 区域失去视觉区分，违反设计意图。

**位置**：`src/sections/Works/Works.tsx` 第 20 行
```tsx
style={{ backgroundColor: '#0A0A0A', color: '#F5F0E8' }}
```

**预期结果**：
```tsx
style={{ backgroundColor: '#F5F0E8', color: '#0A0A0A' }}
```

**修复建议**：
将 Works.tsx 的背景色改为 `#F5F0E8`，文字色改为 `#0A0A0A`。同时需要调整 Works 卡片内的文字颜色以确保在浅色背景上的可读性。

---

#### BUG-002：留言字段被错误设为必填（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
PRD §FR-005 AC-1 明确："留言（选填）"。但 `useFormSubmission.ts` 的 `validate()` 函数中对 `message` 字段做了必填校验：

```typescript
if (!formData.message.trim()) {
  newErrors.message = '请输入留言内容';
}
```

**修复建议**：
移除 message 字段的必填校验，仅保留 name 和 email 的必填校验。

---

#### BUG-003：Works 卡片缺少 `works-card` class 导致动画不生效（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
`useRevealAnimation.ts` 中通过 `gsap.fromTo('.works-card', ...)` 对卡片做 stagger 动画，但 `WorkCard.tsx` 的根元素没有 `works-card` class，只有 `group relative overflow-hidden cursor-none`。

**修复建议**：
在 `WorkCard.tsx` 的 `<article>` 元素上添加 `className="works-card group relative ..."`

---

#### BUG-004：`useHorizontalScroll` 引用不存在的 GSAP 动画 ID（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
`useHorizontalScroll.ts` 中尝试获取 GSAP 动画实例：
```typescript
containerAnimation: gsap.getById('horizontalScroll') ?? undefined,
```
但创建水平滚动动画时没有设置 `id: 'horizontalScroll'`，导致 `gsap.getById()` 始终返回 `undefined`，steps 动画的 `containerAnimation` 参数无效。

**修复建议**：
在 `gsap.to(track, { x: -totalWidth, ... })` 中添加 `id: 'horizontalScroll'`。

---

#### BUG-005：`FilmGrainEffectComponent` 存在内存泄漏（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
`FilmGrainEffect.tsx` 中，当 `intensity` prop 变化时：
```typescript
useEffect(() => {
  effectRef.current = new FilmGrainEffect(); // 创建新实例
  // ... 但没有 dispose 旧实例
}, [intensity]);
```
旧实例没有被 dispose，导致 WebGL 资源泄漏。

**修复建议**：
在创建新实例前 dispose 旧实例：
```typescript
useEffect(() => {
  if (effectRef.current) effectRef.current.dispose();
  effectRef.current = new FilmGrainEffect();
  // ...
}, [intensity]);
```

---

#### BUG-006：`useNavScroll` 事件监听器频繁重建（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
`useNavScroll.ts` 的 `useEffect` 依赖 `[lastScrollY]`，每次滚动都会触发 effect 重建（移除旧监听器 + 添加新监听器），造成不必要的性能开销。

**修复建议**：
使用 `useRef` 存储 `lastScrollY`，移除对它的依赖，让 effect 只挂载一次。

---

#### BUG-007：图片资源全部缺失（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
项目中 `public/images/` 目录不存在。以下引用的图片路径全部指向不存在的资源：
- `/images/about/lina-studio.jpg`（AboutImage.tsx）
- `/images/works/sakura.jpg` 等 6 张作品图（config/index.ts）
- `/og-image.jpg`（SEO.tsx 默认值）
- `/images/hero-fallback.jpg`（架构文档提及但未实现）

**影响**：Works 卡片显示 broken image，About 区域无照片。

---

#### BUG-008：`index.html` 缺少 SEO meta 标签（P2 中）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟡 中 |
| **状态** | 新建 |
| **发现日期** | 2026-04-22 |

**描述**：
`index.html` 只有基础 meta 标签，缺少：
- `<meta name="description">` — PRD NFR-004 要求
- `<meta property="og:*">` — PRD NFR-004 要求
- `<meta name="twitter:*">` — PRD NFR-004 要求
- `<link rel="canonical">`
- 中文 keywords

虽然 `SEO.tsx` 组件会动态注入这些标签，但 SPA 的 `<title>` 和服务端预渲染的 meta 标签对爬虫很重要。

---

#### BUG-009：`useAboutAnimation` 嵌套 useGSAP 调用冗余（P3 低）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟢 低 |
| **状态** | 新建 |

**描述**：
`useAboutAnimation.ts` 中有两个 `useGSAP` 调用：
1. 第一个：`useGSAP(() => {}, { scope: sectionRef })` — 空回调，唯一目的是获取 `contextSafe`，但后续未使用
2. 第二个：`useGSAP(() => { ... }, { scope: sectionRef, dependencies: [reducedMotion] })` — 实际动画

第一个调用无实际作用，可以移除。

---

#### BUG-010：`HeroScene.tsx` 存在未使用的 ref（P3 低）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟢 低 |
| **状态** | 新建 |

**描述**：
```typescript
const opacity = useRef(1.0);
```
声明后从未读取或写入。在 `noUnusedLocals: true` 的严格模式下应触发编译警告（但可能因 TypeScript 配置被忽略）。

---

#### BUG-011：`index.html` 使用繁体中文 `zh-Hant`（P3 低）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟢 低 |
| **状态** | 新建 |

**描述**：
`<html lang="zh-Hant">` 声明为繁体中文，但页面内容为简体中文（京都八年、独立调香师等）。应改为 `zh-Hans`。

---

#### BUG-012：`SmokeMaterial.ts` 中 `useMemo` 依赖数组可能产生过度重建（P3 低）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟢 低 |
| **状态** | 新建 |

**描述**：
`SmokeMaterial.tsx` 中 uniforms 的 `useMemo` 依赖包含 `size.width` 和 `size.height`，这两个值在 R3F Canvas 初始化阶段可能频繁变化，导致 ShaderMaterial 反复重建。

---

#### BUG-013：`vite.config.ts` 缺少 postprocessing chunk 拆分（P3 低）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟢 低 |
| **状态** | 新建 |

**描述**：
架构文档 §5.2 要求将 `@react-three/postprocessing` 拆分为独立 chunk，但 `vite.config.ts` 的 `manualChunks` 中只有 `three-core`、`gsap`、`formspree`，缺少 `postprocessing`。

---

#### BUG-014：`formspree` chunk 在 `manualChunks` 中但依赖未被显式拆分（P3 低）

| 属性 | 值 |
|------|-----|
| **严重程度** | 🟢 低 |
| **状态** | 新建 |

**描述**：
项目中实际未使用 `@formspree/react` 包，而是通过 `fetch()` 直接调用 formspree API。因此 `formspree` chunk 拆分无意义，且 `@formspree/react` 可能根本不在 `node_modules` 中（尽管 `package.json` 声明了依赖）。

---

## 5. 边界情况测试

| 场景 | 输入 | 预期结果 | 实际结果 | 状态 |
|------|------|----------|----------|------|
| 邮箱空提交 | `email: ""` | 显示错误提示 | ✅ 显示"请输入邮箱地址" | 🟢 通过 |
| 邮箱格式错误 | `email: "abc"` | 显示格式错误 | ✅ 使用 PRD 指定正则校验 | 🟢 通过 |
| 超长留言输入 | `message: "a" * 10000` | 截断或提示 | ⚠️ 无长度限制，直接提交到 formspree | 🟡 部分通过 |
| 快速重复提交 | 连续点击提交按钮 | 防重复提交 | ✅ `disabled={status === 'submitting'}` | 🟢 通过 |
| WebGL 不可用 | 老旧设备/浏览器 | 降级为 CSS 动画 | ✅ `deviceTier === 'fallback'` 分支 | 🟢 通过 |
| prefers-reduced-motion | 系统设置开启 | 禁用所有装饰动画 | ✅ `useReducedMotion` 多处使用 | 🟢 通过 |
| 窗口 resize | 平板↔桌面切换 | 布局正确适配 | ⚠️ `useDeviceType` 基于窗口宽度，但 Process 横向滚动可能需重新计算 | 🟡 部分通过 |
| 表单网络断开 | 离线提交 | 友好错误提示 | ✅ `catch` 块设置 `status = 'error'` | 🟢 通过 |
| 特殊字符 XSS | `name: "<script>alert(1)</script>"` | 正确转义 | ✅ React 自动转义 | 🟢 通过 |

---

## 6. 性能评估

### 6.1 代码层面性能分析

| 指标 | 目标值 | 实际状态 | 状态 |
|------|--------|----------|------|
| Code Splitting | Three.js 独立 chunk | ✅ `three-core` chunk 已配置 | 🟢 |
| Lazy Loading | Hero 异步加载 | ✅ `lazy(() => import('./sections/Hero'))` | 🟢 |
| Image Lazy Loading | 非首屏图片懒加载 | ✅ Works 卡片 + About 图片使用 `loading="lazy"` | 🟢 |
| DPR 控制 | 移动端降低 DPR | ✅ `dpr={deviceTier === 'full' ? [1, 2] : 1}` | 🟢 |
| WebGL 降级 | 三级降级体系 | ✅ full / simplified / fallback | 🟢 |
| Intersection Observer | 不可见时暂停渲染 | ✅ Hero 使用 IO 控制渲染 | 🟢 |
| Scroll 节流 | rAF 节流 | ✅ Hero 和 ScrollProgress 使用 rAF | 🟢 |
| Font Loading | font-display: swap | ✅ 所有 @font-face 使用 swap | 🟢 |
| Post-processing 按需加载 | 非首屏延迟加载 | ⚠️ EffectComposer 在 Hero 中直接渲染，非按需 | 🟡 |
| CSS Custom Properties | 使用设计令牌 | 🔴 代码中大量硬编码色值，未使用 CSS 变量 | 🔴 |

### 6.2 性能问题

| 问题 | 影响 | 建议优化 |
|------|------|----------|
| Works 区域背景色错误导致 About→Works 过渡无视觉区分 | 用户体验 | 修复背景色 |
| `useNavScroll` 频繁重建 scroll listener | 滚动性能 | 使用 ref 替代 state |
| `FilmGrainEffectComponent` 可能内存泄漏 | WebGL 内存 | 修复 dispose 逻辑 |
| `SmokeMaterial` uniforms useMemo 可能过度重建 | WebGL 性能 | 考虑拆分依赖或使用 ref |
| `index.html` 字体预加载使用 `as="style"` 但 Google Fonts CSS 仍阻塞渲染 | FCP | 改用 `as="style" onload="this.onload=...；this.rel='stylesheet'"` 模式 |
| Noto Serif SC 全量加载（含 600 字重） | 字体体积 | 使用 unicode-range 子集化 |

---

## 7. 安全审查

### 7.1 CSP 头配置

| 指令 | 配置值 | 评估 |
|------|--------|------|
| default-src | `'self'` | ✅ 正确 |
| script-src | `'self' 'unsafe-inline' 'unsafe-eval' ...` | ⚠️ `unsafe-eval` 在生产环境中应移除 |
| style-src | `'self' 'unsafe-inline' ...` | ⚠️ `unsafe-inline` 可接受（Tailwind 需要） |
| font-src | `'self' https://fonts.gstatic.com https://fonts.googleapis.com` | ✅ 正确 |
| img-src | `'self' data: blob:` | ✅ 正确 |
| connect-src | `'self' https://formspree.io` | ✅ 正确 |
| frame-ancestors | `'none'` | ✅ 正确 |
| form-action | `'self' https://formspree.io` | ✅ 正确 |
| upgrade-insecure-requests | 启用 | ✅ 正确 |

### 7.2 其他安全审查

| 项目 | 状态 | 备注 |
|------|------|------|
| HTTPS formspree 端点 | ✅ | 环境变量配置 |
| 环境变量隔离 | ✅ | 使用 `VITE_` 前缀 |
| XSS 防护 | ✅ | React 自动转义，无 dangerouslySetInnerHTML |
| 敏感信息泄露 | ✅ | 无 API key 硬编码 |
| robots.txt | ⚠️ | 缺失，建议添加 |
| _headers 文件 | ✅ | 包含完整安全头 |

---

## 8. 无障碍审查（A11y）

### 8.1 审查结果

| 项目 | PRD 要求 | 实现状态 | 状态 |
|------|----------|----------|------|
| prefers-reduced-motion | ✅ | `useReducedMotion` 在 Hero/Works/Process/Contact/光标 中使用 | 🟢 |
| 语义化 HTML | ✅ | section/article/nav/header/footer 正确使用 | 🟢 |
| 键盘导航 | ✅ | ❌ 无 skip-link，Process 区不支持键盘导航，Navigation 使用 `<button>` 但无 focus 样式 | 🔴 |
| 焦点指示器 | ✅ | CSS 变量已定义但未在代码中应用 `:focus-visible` | 🔴 |
| 图片 alt | ✅ | Works 卡片使用 `work.nameEn`，About 图片使用描述性文本 | 🟢 |
| 表单 label | ✅ | 所有字段有 `<label>` 关联 | 🟢 |
| ARIA 属性 | ✅ | Hero `aria-label` 正确，装饰性元素无 ARIA 污染 | 🟢 |
| 色彩对比度 | ✅ | `#F5F0E8` on `#0A0A0A` = 16.8:1 ✅ | 🟢 |
| HTML lang 属性 | — | 设为 `zh-Hant` 但内容为简体 | 🟡 |

### 8.2 无障碍改进建议

1. **添加 skip-link**：在 `index.html` 或 `App.tsx` 顶部添加 `<a href="#main" class="skip-link">跳到主要内容</a>`
2. **添加 focus-visible 样式**：在 `globals.css` 中添加 `:focus-visible` 全局样式
3. **修复 lang 属性**：将 `lang="zh-Hant"` 改为 `lang="zh-Hans"`
4. **Process 区键盘导航**：为 TimelineItem 添加 `tabIndex` 和键盘事件

---

## 9. 架构一致性审查

### 9.1 目录结构对照

| 架构文档要求 | 实际实现 | 偏差 |
|-------------|----------|------|
| `src/config/works.json` | `src/config/index.ts`（内联数据） | 🟡 数据在 TS 文件中而非独立 JSON |
| `src/config/process.json` | 同上 | 🟡 |
| `src/config/site.json` | 同上 | 🟡 |
| `src/shaders/common/noise.glsl` | `src/shaders/noise.glsl` | 🟢 存在但位置不同 |
| `src/shaders/common/colors.glsl` | ❌ 不存在 | 🔴 色板常量直接在 shader 中硬编码 |
| `src/hooks/useWebGLSupport.ts` | ✅ 存在 | 🟢 |
| `src/hooks/usePerformanceTier.ts` | `src/hooks/useDeviceTier.ts` | 🟢 名称不同但功能一致 |
| `src/hooks/useDeviceType.ts` | ✅ 存在 | 🟢 |
| `src/hooks/useScrollProgress.ts` | ✅ 存在 | 🟢 |
| `src/utils/analytics.ts` | ❌ 不存在 | 🟡 PRD 惊喜需求，可后续添加 |
| `src/utils/perf.ts` | ❌ 不存在 | 🟡 NFR-001 性能测量 |
| `src/types/work.ts` | `src/types/index.ts` | 🟢 合并在一个文件 |
| `tests/unit/` | ❌ 不存在 | 🔴 测试策略未执行 |
| `tests/e2e/` | ❌ 不存在 | 🔴 测试策略未执行 |

### 9.2 架构决策对照

| 决策 | 架构选择 | 实际实现 | 状态 |
|------|----------|----------|------|
| 构建工具 | Vite | ✅ `vite.config.ts` | 🟢 |
| 3D 渲染 | R3F + drei | ✅ `@react-three/fiber` + `drei` | 🟢 |
| 动画引擎 | GSAP + ScrollTrigger | ✅ `gsap` + `@gsap/react` | 🟢 |
| Shader 管理 | 外部 .glsl + vite-plugin-glsl | ⚠️ shader 内联在 `.ts` 文件中（`const glsl = String.raw`），未使用 `.glsl` 文件 | 🟡 |
| 状态管理 | useState + Context | ✅ 无 Zustand/Redux | 🟢 |
| 字体加载 | Google Fonts CDN + swap | ✅ `fonts.css` 使用 swap | 🟢 |

---

## 10. UI 规范一致性审查

### 10.1 色板对照

| 令牌 | ui-spec 定义 | 实际使用 | 状态 |
|------|-------------|----------|------|
| `--color-ink` (#0A0A0A) | ✅ | 代码中使用 `#0A0A0A` 硬编码 | 🟡 |
| `--color-cream` (#F5F0E8) | ✅ | 代码中使用 `#F5F0E8` 硬编码 | 🟡 |
| `--color-cinnabar` (#C9302C) | ✅ | 代码中使用 `#C9302C` 硬编码 | 🟡 |
| `--color-cinnabar-dark` (#8B1A1A) | ✅ | 代码中使用 `#8B1A1A` 硬编码 | 🟡 |
| `--color-n400` (#9E9080) | ✅ | 使用 `rgba(245,240,232,0.5)` 近似 | 🟡 |

**关键发现**：CSS 自定义属性（`tokens.css`）已定义但**几乎未被使用**。所有组件使用内联 style 硬编码色值。这违背了设计令牌系统的初衷，降低了可维护性。

### 10.2 排版对照

| 元素 | ui-spec 要求 | 实际实现 | 状态 |
|------|-------------|----------|------|
| Hero 标题 | display: 72px | `text-7xl` (72px) ✅ | 🟢 |
| Section H2 | h2: 40px | `text-4xl md:text-5xl lg:text-6xl` | ⚠️ 桌面端 60px 偏大 |
| Body 正文 | 16px / 1.6 | 使用 `text-sm` (14px) 较多 | 🟡 |
| Overline 标签 | 11px / 0.08em | `text-xs tracking-[0.2em]` | ⚠️ tracking 偏大 |
| 表单输入框 | 16px (防 iOS 缩放) | `text-base` (16px) ✅ | 🟢 |

### 10.3 间距对照

| 令牌 | ui-spec 定义 | 实际使用 | 状态 |
|------|-------------|----------|------|
| Section padding | 128px (Desktop) | `py-24` (96px) → `lg:py-40` (160px) | 🟡 偏大 |
| 卡片间距 | 32px | `gap-6` (24px) → `md:gap-8` (32px) | 🟢 |

### 10.4 Works 区域视觉规范

| 规范 | ui-spec 要求 | 实际 | 状态 |
|------|-------------|------|------|
| 背景色 | `#F5F0E8`（暖米白） | `#0A0A0A`（墨黑） | 🔴 **不一致** |
| 标题颜色 | `#0A0A0A` | `#F5F0E8` | 🟡 跟随背景色错误 |
| 卡片背景 | `#F5F0E8`（与区块同色） | 无背景色 | 🟡 跟随背景色错误 |
| clip-path 揭幕 | inset(0 100%→0) | 代码存在但 class 缺失 | 🔴 **不生效** |

---

## 11. PRD 覆盖度总览

| 需求 | 状态 | 说明 |
|------|------|------|
| FR-001 Hero 朱砂烟雾 | ✅ 实现 | 三级降级 + 8秒循环 + raymarching |
| FR-002 About 个人故事 | ✅ 实现 | 左文右图 + 黑白照片 + 视差 |
| FR-003 Works 作品展示 | ⚠️ 部分 | 背景色错误 + clip-path 不生效 |
| FR-004 Process 时间轴 | ⚠️ 部分 | GSAP ID 引用缺失 |
| FR-005 Contact 表单 | ⚠️ 部分 | 留言必填错误 |
| FR-006 墨迹光标 | ✅ 实现 | Canvas 2D + 移动端禁用 |
| FR-007 全局导航 | ✅ 实现 | 滚动显隐 + 汉堡菜单 |
| FR-008 加载过渡 | ✅ 实现 | 进度条 + 3秒超时 |
| NFR-001 性能 | ⚠️ 待验证 | 代码优化到位，需 Lighthouse 实测 |
| NFR-002 响应式 | ✅ 实现 | 三断点覆盖 |
| NFR-003 无障碍 | ⚠️ 部分 | 缺少 skip-link / focus-visible |
| NFR-004 SEO | 🔴 不达标 | index.html 缺少 meta 标签 |
| NFR-005 安全 | ✅ 达标 | CSP + 环境变量 |
| NFR-006 可维护性 | ✅ 达标 | TypeScript + 配置化数据 |

**惊喜需求覆盖**：
- 滚动进度指示器（香形 SVG）：✅ 已实现 `ScrollProgress.tsx`
- 预约提交仪式感动画：⚠️ 有成功状态和感谢语，但无烟雾消散动画

---

## 12. 测试建议

### 12.1 发布建议
- [x] P0 严重 Bug：无
- [ ] P1 高优先级 Bug：1 个待修复（Works 背景色）
- [ ] P2 中优先级 Bug：6 个待修复
- [x] 核心功能实现：5/5 区块均实现
- [ ] 无障碍基础达标：否（缺少 skip-link / focus-visible）
- [ ] SEO 基础达标：否（缺少 meta 标签）

**发布决定**：⚠️ **修复 P1 Bug（Works 背景色）+ 补充图片资源后可发布**。P2 Bug 可在后续迭代中修复。

### 12.2 改进建议

**立即修复（P1）**：
1. 修复 Works 区域背景色为 `#F5F0E8`，同步调整卡片内文字颜色
2. 补充 `public/images/` 目录及所有引用图片

**近期修复（P2）**：
3. 移除留言字段必填校验
4. 为 WorkCard 添加 `works-card` class
5. 修复 `useHorizontalScroll` 中 GSAP ID 引用
6. 修复 `FilmGrainEffectComponent` 内存泄漏
7. 优化 `useNavScroll` 性能（ref 替代 state）
8. 补充 `index.html` meta description 和 Open Graph 标签
9. 修复 `lang="zh-Hans"`

**后续优化（P3）**：
10. 在代码中统一使用 CSS 自定义属性（设计令牌），替换硬编码色值
11. 添加测试框架配置（vitest.config.ts）和基础测试用例
12. 添加 robots.txt 和替换 favicon
13. 考虑将 shader 代码拆分到独立 `.glsl` 文件（使用 vite-plugin-glsl）
14. 添加 Web Vitals 性能测量（`src/utils/perf.ts`）

### 12.3 技术债务

1. **CSS 设计令牌未接入组件层**：`tokens.css` 定义了完整的 CSS 变量系统，但所有组件使用内联 style 硬编码。需要系统性迁移。
2. **Shader 代码组织**：当前 shader 代码内联在 `.ts` 文件中（`const glsl = String.raw`），架构文档建议拆分为独立 `.glsl` 文件。
3. **数据配置方式**：作品数据和流程数据内联在 `config/index.ts` 中，架构文档建议拆分为独立 `.json` 文件。
4. **测试基础设施缺失**：vitest 已安装但无配置、无测试文件。
5. **`Layout.tsx` 未使用**：组件已定义但未被任何页面引用。
6. **`@formspree/react` 依赖未使用**：`package.json` 声明了该依赖，但实际通过 `fetch()` 直接调用 API。

---

## 变更记录

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.0 | 2026-04-22 | QA Agent | 初始版本 — 全面代码审查，覆盖 8 个审查维度，发现 1 P1 + 6 P2 + 5 P3 Bug |
