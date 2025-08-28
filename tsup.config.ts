import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  name: 'scratch-ext', // Replace it with your extension name
  entry: ['src/index.ts', 'src/index.js'],
  target: ['esnext'],
  format: ['iife'],
  outDir: 'dist',
  banner: {
    // Replace it with your extension's metadata
    js: `// Name: Better Message
// Version: 1.0.0
// ID: BetterMsg
// Description: 更好的弹窗！美观 | 实用 | 丰富
// By: Skydog
// License: MIT
`
  },
  platform: 'browser',
  clean: !options.watch,
  watch: options.watch,

  // 启用CSS内联打包
  injectStyle: true,
  esbuildOptions(options) {
    options.charset = 'utf8'
    // 确保CSS被处理为JS模块
    options.loader = {
      ...options.loader,
      '.css': 'text'
    }
  },
  onSuccess: options.watch
    ? 'echo "Build completed! Files updated."'
    : undefined
}))
