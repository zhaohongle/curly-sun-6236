import { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 全屏垂直布局容器
 * 所有页面内容包裹在此组件中
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative w-full min-h-screen bg-ink text-cream overflow-hidden">
      {children}
    </div>
  );
}
