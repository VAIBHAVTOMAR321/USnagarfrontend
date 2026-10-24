
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// Remove the React Router version marker from production bundles
function removeReactRouterVersion() {
  return {
    name: "remove-react-router-version",

    generateBundle(options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "chunk") continue;

        file.code = file.code.replace(
          /window\.__reactRouterVersion\s*=\s*["'][^"']*["']/g,
          "void 0"
        );
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "/pauripargati",

  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/pauripargati/pauripargati_backend": {
        target: "https://mahadevaaya.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },

  preview: {
    host: "0.0.0.0",
    port: 4173,
  },

  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    removeReactRouterVersion(),
  ],

  // Production build settings
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
  },
});

