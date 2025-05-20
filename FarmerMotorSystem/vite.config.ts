import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client', // <--- Pointing to the client folder
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './client/public/images'),
    },
  },
  build: {
    outDir: '../dist', // Output to root-level dist folder
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
  },
});
