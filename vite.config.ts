import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Components from 'unplugin-vue-components/vite'

import Inspect from 'vite-plugin-inspect'
import path from "path";

const src = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  resolve: {
    alias: {
      "@": src
    }
  },
  plugins: [vue(), WindiCSS(), AutoImport({
    imports: ['vue'],
    resolvers: [
      ElementPlusResolver(),

    ],
    dts: path.resolve(__dirname, 'src', 'auto-imports.d.ts')
  }),
  Components({
    resolvers: [
      ElementPlusResolver(),
    ],
    dts: path.resolve(__dirname, 'src', 'components.d.ts')
  }),

  Inspect()
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
}));
