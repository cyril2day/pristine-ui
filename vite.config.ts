import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  const baseConfig = {
    plugins: [
      vue(),
      vueDevTools(),
      // Generate TypeScript declarations only for library builds
      isLib && dts({
        tsconfigPath: './tsconfig.app.json',
        rollupTypes: true,
        outDir: 'dist',
        include: ['src/**/*.vue', 'src/**/*.ts'],
        exclude: ['src/**/__tests__', 'src/page', 'src/App.vue', 'src/main.ts'],
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: true
    },
  }

  if (isLib) {
    return {
      ...baseConfig,
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'PristineUI',
          fileName: (format) => `pristine-ui.${format}.js`,
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          // Externalize dependencies that should not be bundled
          external: ['vue', 'normalize.css'],
          output: {
            globals: {
              vue: 'Vue',
            },
            exports: 'named',
            assetFileNames: 'style.css',
          },
        },
        cssCodeSplit: true,
        sourcemap: true,
        minify: 'terser',
        outDir: 'dist',
        emptyOutDir: true,
      },
    }
  }

  // Default config for dev server and demo app build
  return baseConfig
})
