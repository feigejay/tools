import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true, // 强制使用指定端口
    open: true // 自动打开浏览器
  }
}) 