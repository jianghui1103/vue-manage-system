import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 静态资源服务的文件夹，默认public
  base: './',
  // 静态资源服务的文件夹，默认public
  publicDir: 'static',
  server: {
    proxy: {
      "/api": {
        target: "http://load.antangbusiness.com/api",
        // target: "http://localhost:8001", // 所要代理的目标地址
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api/, "")
        },
      },
    },
  },
})