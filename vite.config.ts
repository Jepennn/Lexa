import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    // Bara för debugging, ta bort i produktion
    minify: false,
    assetsInlineLimit: 0,
    outDir: "dist/ui",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        serviceWorker: resolve(__dirname, "src/serviceWorker.ts"),
        sidePanel: resolve(__dirname, "sidePanel.html"),
      },

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  plugins: [
    react({
      include: /\.(jsx|tsx)$/,
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
