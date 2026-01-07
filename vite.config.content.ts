import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  //Added for shadcn ui to work
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  //Build for content script
  build: {
    minify: false,
    emptyOutDir: false,
    outDir: "dist/content",
    rollupOptions: {
      input: "src/content/Content.tsx",
      output: {
        format: "iife",
        entryFileNames: "content.js",
        assetFileNames: "content.css",
        inlineDynamicImports: true,
      },
    },
  },
});
