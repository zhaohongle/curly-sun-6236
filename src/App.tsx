import { lazy, Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { SEO } from './components/SEO';
import { Navigation } from './components/Navigation/Navigation';
import { InkCursor } from './components/InkCursor/InkCursor';
import { ScrollProgress } from './components/ScrollProgress/ScrollProgress';

// 延迟加载 Hero（Three.js 重资源）
const Hero = lazy(() => import('./sections/Hero'));

// 内容区块直接导入（轻量 DOM 组件）
import { About } from './sections/About/About';
import { Works } from './sections/Works/Works';
import { Process } from './sections/Process/Process';
import { Contact } from './sections/Contact/Contact';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 超时兜底：3 秒后强制显示内容
    const timer = setTimeout(() => setLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <SEO />
      <Navigation />

      {/* 加载屏 */}
      {!loaded && <LoadingScreen />}

      {/* 主内容 */}
      <main
        className={`transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Hero — Three.js 异步加载 */}
        <Suspense fallback={<div className="h-screen bg-ink" />}>
          <Hero />
        </Suspense>

        {/* 内容区块 */}
        <About />
        <Works />
        <Process />
        <Contact />

        {/* 页脚 */}
        <footer className="py-12 px-6 bg-ink text-center border-t border-rice/5">
          <p className="font-serif text-sm text-rice/30 tracking-wider">
            Lina — 東方草本調香師
          </p>
          <p className="font-sans text-xs text-rice/20 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </footer>
      </main>

      {/* 全局交互层 */}
      <InkCursor />
      <ScrollProgress />
    </ErrorBoundary>
  );
}
