# Library Build and Deployment Plan

## Overview
Transform the current Vue 3 component project into an npm‑installable library with tree‑shaking support. The library will export reusable UI components (`CardDisplay`, `CheckBox`, `ComboBox`, `PushButton`, `SegmentedControl`, `SwitchToggle`, `TextArea`, `TextField`) as named ES modules and a CommonJS bundle, along with TypeScript declarations and optional CSS tokens.

## Goals
- Package name: `pristine-ui`
- Version: `1.0.0`
- Build outputs: ESM (for modern bundlers) + CJS (for Node environments)
- Tree‑shaking: Enabled via ES module exports and side‑effects flag
- CSS handling: Provide a separate token CSS file; components use CSS custom variables with fallback values
- Exclude demo page from published package
- Provide clear usage documentation

## Required Changes

### 1. Library Entry Point (`src/index.ts`)
Create a central entry point that re‑exports all components and provides a Vue plugin for global registration.

**Content:**
```ts
// Library entry point for Pristine UI components
// Re-export all components as named exports
export { default as CardDisplay } from '@/components/card-display/CardDisplay.vue'
export { default as CheckBox } from '@/components/checkbox/CheckBox.vue'
export { default as ComboBox } from '@/components/combo-box/ComboBox.vue'
export { default as PushButton } from '@/components/push-button/PushButton.vue'
export { default as SegmentedControl } from '@/components/segmented-control/SegmentedControl.vue'
export { default as SwitchToggle } from '@/components/switch-toggle/SwitchToggle.vue'
export { default as TextArea } from '@/components/text-area/TextArea.vue'
export { default as TextField } from '@/components/text-field/TextField.vue'

// Export utility functions
export * from '@/utils/index'

// Plugin that registers all components globally
import type { App } from 'vue'
import CardDisplay from '@/components/card-display/CardDisplay.vue'
import CheckBox from '@/components/checkbox/CheckBox.vue'
import ComboBox from '@/components/combo-box/ComboBox.vue'
import PushButton from '@/components/push-button/PushButton.vue'
import SegmentedControl from '@/components/segmented-control/SegmentedControl.vue'
import SwitchToggle from '@/components/switch-toggle/SwitchToggle.vue'
import TextArea from '@/components/text-area/TextArea.vue'
import TextField from '@/components/text-field/TextField.vue'

const components = {
  CardDisplay,
  CheckBox,
  ComboBox,
  PushButton,
  SegmentedControl,
  SwitchToggle,
  TextArea,
  TextField,
}

export const PristineUI = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

// Default export is the plugin
export default PristineUI
```

### 2. Vite Configuration (`vite.config.ts`)
Update the Vite config to build in library mode, extract CSS, externalize Vue, and produce ESM + CJS bundles.

**Required modifications:**
- Use `build.lib` option with entry `src/index.ts`
- Set `cssCodeSplit: true` and configure `rollupOptions.output`
- Externalize `vue` and `normalize.css` (peer dependencies)
- Possibly add `vite-plugin-dts` for generating `.d.ts` files

**Example configuration:**
```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    dts({ // generates TypeScript declaration files
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PristineUI',
      fileName: (format) => `pristine-ui.${format}.js`,
    },
    rollupOptions: {
      // Externalize dependencies that should not be bundled
      external: ['vue', 'normalize.css'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'terser',
  },
})
```

### 3. Package.json Updates
Update `package.json` with the following fields:

```json
{
  "name": "pristine-ui",
  "version": "1.0.0",
  "private": false,
  "type": "module",
  "description": "A collection of reusable, Apple‑inspired Vue 3 UI components",
  "keywords": ["vue", "ui", "components", "design-system"],
  "license": "MIT",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/cyril2day/pristine-ui"
  },
  "homepage": "https://github.com/cyril2day/pristine-ui#readme",
  "bugs": "https://github.com/cyril2day/pristine-ui/issues",
  "main": "./dist/pristine-ui.cjs.js",
  "module": "./dist/pristine-ui.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/pristine-ui.es.js",
      "require": "./dist/pristine-ui.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./dist/style.css": "./dist/style.css",
    "./*": "./*"
  },
  "files": [
    "dist",
    "src"
  ],
  "sideEffects": [
    "**/*.css"
  ],
  "peerDependencies": {
    "vue": "^3.5.26"
  },
  "dependencies": {
    "normalize.css": "^8.0.1",
    "underscore": "^1.13.7"
  },
  "devDependencies": {
    // existing devDependencies remain
    "vite-plugin-dts": "^4.5.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "test:unit": "vitest",
    "build-only": "vite build",
    "type-check": "vue-tsc --build",
    "lint": "eslint . --fix --cache",
    "build:lib": "vite build --mode lib",
    "prepublishOnly": "npm run build:lib"
  }
}
```

### 4. CSS Token File Generation
Create a separate CSS file that contains all design token definitions (colors, typography, spacing, etc.) for users who want the default theme. This file should be placed in `dist/tokens.css` (or `dist/style.css`).

**Approach:** Use a dedicated SCSS entry (e.g., `src/styles/tokens.scss`) that imports all token partials and is built via Vite’s CSS extraction. Alternatively, we can copy the token SCSS as-is and let users import it directly (requires Sass). Simpler: output a plain CSS file with the compiled tokens.

**Implementation steps:**
- Create `src/styles/tokens.scss` that imports `@forward 'tokens/index';`
- Configure Vite to include this entry as an additional CSS chunk.
- Ensure the built CSS is placed in `dist/style.css`.

### 5. TypeScript Declaration Generation
Ensure TypeScript declaration files are generated for all components and the entry point. The `vite-plugin-dts` plugin will handle this automatically.

### 6. Exclude Demo Page from Published Package
Add a `.npmignore` file (or use `files` field) to exclude `src/page`, `public`, `demo-fixed.png`, etc.

**Example `.npmignore`:**
```
*.log
*.md
*.txt
.vscode
screenshots
public
src/page
src/App.vue
src/main.ts
index.html
plans
references
coding-guidelines
```

### 7. Local Testing & Verification
Before publishing, verify:
- Build runs without errors (`npm run build:lib`)
- Generated bundles are present in `dist/`
- Tree‑shaking works by creating a test app that imports only one component and checking bundle size.
- TypeScript definitions are correct (no missing types).

### 8. Documentation
Update `README.md` with:
- Installation instructions (`npm install pristine-ui`)
- Usage examples (individual component import, global plugin, CSS tokens)
- Component API documentation (maybe auto-generated later)
- Link to demo page (hosted separately, not in package).

## Step‑by‑Step Implementation Order

1. **Switch to Code mode** – All subsequent steps require editing non‑markdown files.
2. **Create library entry point** (`src/index.ts`) as described.
3. **Install `vite-plugin-dts`** (`pnpm add -D vite-plugin-dts`).
4. **Update `vite.config.ts`** with library configuration.
5. **Update `package.json`** fields.
6. **Create CSS token entry** (`src/styles/tokens.scss`).
7. **Add `.npmignore`** (optional if using `files` field).
8. **Run library build** (`pnpm build:lib`) and verify outputs.
9. **Test tree‑shaking** with a minimal Vue app.
10. **Update README.md** with usage instructions.
11. **Publish to npm** (`npm publish`).

## Notes
- The library will be published as `pristine-ui` (ensure the name is available on npm).
- Peer dependency on Vue ensures users can use their own Vue version.
- CSS tokens are optional; components have fallback values for critical properties.
- The demo page remains in the repository but is excluded from the npm package.

## Next Steps
Review this plan and approve. Once approved, switch to **Code mode** to begin implementation.