// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@google/genai'],
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'google-genai': ['@google/genai'],
          'react-vendor': ['react', 'react-dom'],
          'pdf-vendor': ['jspdf', 'html2pdf.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    target: 'esnext',
  },
});

