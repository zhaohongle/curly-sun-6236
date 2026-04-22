# 设计简报 — Lina 调香师个人作品集网站

## 摘要

为独立调香师 Lina 打造高端个人作品集网站。Lina 在京都学习调香 8 年，作品以"东方草本"为主题。网站需传递极致的东方美学气质，包含 Three.js 朱砂烟雾 shader、墨迹光标、GSAP 滚动动画等沉浸式交互体验。

## 做什么

一个单页（SPA）个人作品集网站，包含以下区块：
1. **Hero 首屏** — 全屏朱砂红烟雾动画（Three.js + Fragment Shader），纯黑底色 #0A0A0A
2. **About 区** — 左文右图布局，黑白工作室照片
3. **Works 区** — 香水作品卡片展示，clip-path 揭幕动画
4. **Process 区** — 调香流程横向滚动时间轴
5. **Contact 区** — 极简预约表单

### 关键交互效果
- **朱砂烟雾 Hero**：volumetric smoke shader，#C9302C → #8B1A1A 渐变，8 秒循环，胶片颗粒感滤镜
- **墨迹光标**：全站自定义光标，移动拖出晕染墨迹轨迹，hover 时圆点变大
- **滚动动画**：GSAP ScrollTrigger 驱动各区块入场动画

### 视觉规范
- 色板：墨黑 #0A0A0A，暖米白 #F5F0E8，朱砂红 #C9302C
- 字体：大标题 Instrument Serif / Canela / Editorial New，正文 Inter / Söhne，中文装饰字体思源宋体
- 排版参考 Linear 官网，质感参考 Awwwards 获奖作品

## 给谁用

- Lina 的潜在客户（想定制香水的人）
- 品牌合作方
- 媒体/杂志编辑
- 对调香艺术感兴趣的访客

## 核心场景

1. 访客首次打开网站 → 被朱砂烟雾和墨迹光标震撼 → 产生品牌记忆
2. 潜在客户浏览作品 → 了解 Lina 的调香风格和理念 → 通过表单预约咨询
3. 媒体编辑访问 → 获取 Lina 的背景信息和代表作品 → 发起合作邀约

## 技术栈

React 19 + TypeScript + Tailwind CSS + GSAP + Three.js + @react-three/fiber + WebGL Shader

## 约束

- 纯前端项目，无后端（表单可用 formspree 或类似服务）
- 响应式设计，移动端优雅降级（烟雾效果可简化）
- 首屏加载性能：LCP < 2.5s（shader 异步加载）
