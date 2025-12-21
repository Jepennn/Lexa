import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    assetsInlineLimit: 0,
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content.tsx"),
        "service-worker": resolve(__dirname, "src/service-worker.ts"),
      },
    },
  },
  plugins: [
    react({
      include: /\.(jsx|tsx)$/,
      exclude: /content\.tsx$/,
    }),
    tailwindcss(),
  ],

  //Added for shadcn ui to work
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
