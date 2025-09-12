/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react({
      // Disable linting during build
      jsxRuntime: 'automatic',
      babel: {
        plugins: []
      }
    }),
    tailwindcss(),
  ],
  build: {
    // Disable linting warnings during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress linting warnings during build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    },
    // Continue build even with TypeScript errors
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    port: 7722,
  },
  resolve: {
    alias: {
      "@": new URL('./src', import.meta.url).pathname,
    },
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
