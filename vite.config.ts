import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three', '@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
          formspree: ['@formspree/react'],
        },
      },
    },
  },
});
