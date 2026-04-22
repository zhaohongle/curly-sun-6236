import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        rice: '#F5F0E8',
        cinnabar: { DEFAULT: '#C9302C', dark: '#8B1A1A', glow: '#FF6B3A' },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Noto Serif SC"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'smoke-drift': 'smokeDrift 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        smokeDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(5px, -10px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
