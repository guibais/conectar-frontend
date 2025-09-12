/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
      jsxRuntime: "automatic",
      babel: {
        plugins: [],
      },
    }),
    tailwindcss(),
  ],
  build: {
    // Disable linting warnings during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress linting warnings during build
        if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        if (warning.code === "EMPTY_BUNDLE") return;
        warn(warning);
      },
    },
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 7722,
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
