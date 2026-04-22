import { useEffect, useState } from 'react';

/**
 * 加载屏组件
 * 朱砂红脉冲动画 + 进度条
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 进度条动画
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center">
      {/* 朱砂红脉冲圆环 */}
      <div className="relative mb-8">
        <div
          className="w-16 h-16 rounded-full border-2 border-cinnabar animate-pulse"
          style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div className="absolute inset-0 w-16 h-16 rounded-full bg-cinnabar/20 animate-ping" />
      </div>

      {/* 进度条 */}
      <div className="w-48 h-px bg-cream/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-cinnabar transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* 品牌文字 */}
      <p className="mt-4 font-serif text-cream/40 text-sm tracking-widest">
        LINA
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
