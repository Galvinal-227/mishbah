import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/')
          ) {
            return 'vendor';
          }
          if (id.includes('firebase') || id.includes('@firebase')) {
            return 'firebase';
          }
          if (id.includes('gsap') || id.includes('lenis')) {
            return 'animation';
          }
          return 'vendor';
        },
      },
    },
  },
});
