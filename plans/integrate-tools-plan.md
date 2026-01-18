# Integration Plan: Underscore.js, Sass, and Normalize.css

## Overview
Integrate three key tools into the Vue 3 + TypeScript + Vite project:
1. **Underscore.js** – JavaScript utility library for functional programming helpers.
2. **Sass** – CSS preprocessor for advanced styling capabilities.
3. **Normalize.css** – Modern CSS reset for consistent baseline styling.

## Dependencies

### Package Installation Commands
Using pnpm (project’s package manager):

```bash
pnpm add underscore normalize.css
pnpm add -D sass @types/underscore
```

### Expected Changes to `package.json`
- `dependencies` will include `underscore` and `normalize.css`
- `devDependencies` will include `sass` and `@types/underscore`

## Configuration Steps

### 1. Sass Support
Vite has built‑in Sass support; no extra configuration required. The `sass` package must be installed as a dev dependency for the preprocessor to work.

### 2. Global Styles
Create a dedicated styles directory and a global SCSS file that imports Normalize.css and defines project‑wide base styles.

**File structure:**
```
src/
  styles/
    global.scss
    _variables.scss (optional)
```

**`src/styles/global.scss` content:**
```scss
@import 'normalize.css';

/* Project‑specific base styles */
:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
}

body {
  font-family: 'Inter', sans‑serif;
  background-color: #f9f9f9;
  color: #333;
}
```

### 3. Import Global Styles in Entry Point
Update `src/main.ts` to import the global SCSS file:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/global.scss' // ← add this line

createApp(App).mount('#app')
```

### 4. Create a Demo Component (Optional but Recommended)
Demonstrate the use of Underscore.js and Sass in a Vue component.

**Create `src/components/DemoComponent.vue`:**
```vue
<script setup lang="ts">
import _ from 'underscore'

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const chunked = _.chunk(items, 3)
</script>

<template>
  <div class="demo">
    <h2>Underscore.js + Sass Demo</h2>
    <p>Original array: {{ items }}</p>
    <div class="chunks">
      <div v-for="(chunk, index) in chunked" :key="index" class="chunk">
        Chunk {{ index + 1 }}: {{ chunk }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  padding: 2rem;
  background: var(--primary-color);
  border-radius: 8px;

  h2 {
    color: white;
    margin-bottom: 1rem;
  }

  .chunks {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .chunk {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>
```

**Update `src/App.vue` to use the demo component:**
```vue
<script setup lang="ts">
import DemoComponent from '@/components/DemoComponent.vue'
</script>

<template>
  <div>
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the documentation
    </p>
    <DemoComponent />
  </div>
</template>

<style scoped></style>
```

### 5. TypeScript Support for Underscore
The `@types/underscore` package provides TypeScript definitions. No additional configuration is needed; the types will be automatically picked up by `vue-tsc`.

## Verification

### 1. Install Dependencies
Run the installation commands and verify that `package.json` is updated correctly.

### 2. Start Development Server
```bash
pnpm dev
```
- Check that the page loads without errors.
- Confirm that Normalize.css is applied (e.g., default margins removed).
- Verify that the demo component renders and shows chunked data.
- Inspect the component’s styles to ensure SCSS is compiled correctly.

### 3. Build for Production
```bash
pnpm build
```
- Ensure the build completes without Sass‑related errors.
- Confirm that the generated CSS includes the normalized styles.

## Optional Enhancements

### Alias for Underscore
If you prefer a shorter import alias, add a Vite alias in `vite.config.ts`:
```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '_': 'underscore' // ← add this line
  }
}
```
Then you can import as `import _ from '_'`.

### SCSS Modules
Enable CSS Modules for component‑scoped styles by using `<style module lang="scss">`.

### Linting & Formatting
Update ESLint / Prettier configurations if needed to handle SCSS syntax.

## Files to Create/Modify

| Path | Change | Purpose |
|------|--------|---------|
| `package.json` | Add dependencies | Install required packages |
| `src/styles/global.scss` | Create new file | Global styles + Normalize import |
| `src/main.ts` | Add import line | Load global styles |
| `src/components/DemoComponent.vue` | Create new file | Demonstrate Underscore + Sass usage |
| `src/App.vue` | Import & use demo component | Showcase integration |

## Next Steps
1. Review this plan with the team/stakeholder.
2. Switch to **Code Mode** to execute the implementation.
3. After implementation, run the verification steps to confirm everything works as expected.
4. Update project documentation (README) if desired.

---
*Plan generated on 2026‑01‑17*