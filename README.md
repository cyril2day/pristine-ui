# Pristine UI

![npm version](https://img.shields.io/npm/v/@cyril2day2/pristine-ui?style=flat-square)
![license](https://img.shields.io/npm/l/@cyril2day2/pristine-ui?style=flat-square)
![Vue 3](https://img.shields.io/badge/Vue-3-4fc08d?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646cff?style=flat-square&logo=vite)

A collection of reusable, clean‑design Vue 3 UI components built with TypeScript and Sass. Designed for developers who value clean design, accessibility, and a straightforward developer experience.

## Features

- **Vue 3** – Composition API and `<script setup>` syntax
- **TypeScript** – Fully typed components and utilities
- **Design Tokens** – Consistent spacing, colors, typography via CSS custom properties
- **Clean design** – Subtle shadows, rounded corners, familiar interactions
- **Accessible** – WAI ARIA attributes, keyboard navigation, focus management
- **Tree‑shakeable** – ES module exports with side‑effect‑free JavaScript
- **CSS‑variable based theming** – Light/dark theme support via CSS custom properties

## Components

- `CardDisplay` – Outlined and elevated card containers
- `CheckBox` – Clean checkbox with tri‑state (checked/unchecked/indeterminate)
- `ComboBox` – Filterable dropdown with keyboard navigation
- `PushButton` – Button with role variants (normal, primary, destructive, cancel)
- `SegmentedControl` – Capsule or rounded‑rectangle segmented control
- `SwitchToggle` – Clean toggle switch with smooth animation
- `TextArea` – Resizable textarea with character counter
- `TextField` – Clean text field with clearable support

## Installation

```bash
npm install @cyril2day2/pristine-ui
# or
pnpm add @cyril2day2/pristine-ui
# or
yarn add @cyril2day2/pristine-ui
```

## Peer Dependencies

Pristine UI expects `vue` (^3.5.26), `normalize.css` (^8.0.1) and `pristine‑styles` (^0.1.0) to be installed in your project. If you haven’t added them yet:

```bash
npm install vue normalize.css pristine-styles
```

**Note:** `pristine‑styles` already includes `normalize.css` as a dependency, so installing `pristine‑styles` will automatically satisfy the `normalize.css` requirement. However, listing both keeps the dependency explicit.

## Usage

### Import Individual Components (Recommended)

```vue
<script setup lang="ts">
import { PushButton, SwitchToggle } from '@cyril2day2/pristine-ui'
</script>

<template>
  <PushButton role="primary">Click me</PushButton>
  <SwitchToggle v-model="enabled" />
</template>
```

### Use the Plugin for Global Registration

```ts
import { createApp } from 'vue'
import App from './App.vue'
import PristineUI from '@cyril2day2/pristine-ui'

const app = createApp(App)
app.use(PristineUI)
app.mount('#app')
```

After registering the plugin, all components become available globally without explicit imports.

### Include Default Styles

Components rely on CSS custom properties (design tokens) for colors, spacing, etc. **The design tokens are required**—without them, components will have virtually no styling (colors, spacing, typography, etc.). To get the expected appearance, you must import both the component styles and the design tokens.

1. **Install the design tokens package** (if you haven’t already):

   ```bash
   npm install pristine-styles
   ```

2. **Import the design tokens** in your main CSS/SCSS file:

   ```css
   @import 'pristine-styles';
   ```
   or in SCSS:
   ```scss
   @use 'pristine-styles';
   ```

3. **Import the component styles** from the library:

   ```js
   import '@cyril2day2/pristine-ui/dist/style.css';
   ```

If you wish to customize the design tokens, you can override any CSS custom property after importing `pristine‑styles`. For advanced customization, you may replace `pristine‑styles` entirely with your own token system, provided you define the same set of CSS custom properties.

## Theming

Pristine UI supports light/dark themes via CSS custom properties. The token file (provided by the `pristine‑styles` package) includes automatic theme detection via `prefers-color-scheme` and a manual `.dark` class toggle.

### Using OS Preference

No extra work needed—the token CSS automatically adapts to the user’s system preference.

### Manual Theme Toggle

Add a `.dark` class to the `<html>` element to switch to dark theme:

```js
document.documentElement.classList.add('dark')
```

Remove the class to revert to light theme.

### Customizing Tokens

Override any token by re‑defining the corresponding CSS custom property in your own stylesheet:

```css
:root {
  --color-blue: #0a84ff;
  --space-4: 1rem;
  /* … */
}
```

## Styling Approach

Pristine UI separates **component styles** (layout, component‑specific CSS) from **design tokens** (colors, spacing, typography, etc.). This separation gives you full control over the visual design while keeping the component logic independent.

- **Component styles** are bundled in `@cyril2day2/pristine-ui/dist/style.css`. They define how components are laid out and interact, but they reference design tokens for all color, spacing, and typography values.
- **Design tokens** are provided by the `pristine‑styles` package. They are a set of CSS custom properties (variables) that you can override in your own stylesheet.

To customize the appearance, simply re‑define any token in your CSS:

```css
:root {
  --color-blue: #0a84ff;
  --space-4: 1rem;
  /* … override any token defined in pristine‑styles */
}
```

Because tokens are decoupled, you can even replace `pristine‑styles` entirely with your own token system, as long as you define the same set of CSS custom properties.

## Component API

Each component is documented with TypeScript interfaces. Hover over the component name in your IDE to see available props, events, and slots.

For a live interactive demo, run the local development server (see **Development** below).

## Development

This repository includes a demo page that showcases all components. To run it locally:

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open `http://localhost:5173` in your browser.

### Running Tests

Unit tests are written with Vitest and Vue Test Utils.

```bash
pnpm test:unit
```

### Linting

```bash
pnpm lint
```


## License

MIT © [psi](https://github.com/cyril2day)

## Acknowledgments

- Design inspired by Apple’s Human Interface Guidelines
- Built with [Vite](https://vite.dev/) and [Vue 3](https://vuejs.org/)
- Functional utilities powered by [Underscore.js](https://underscorejs.org/)

## Contributing

Contributions are welcome! Please open an issue or a pull request on GitHub.

**Maintainer:** psi – [cyril2day](https://github.com/cyril2day) – cylonsido@gmail.com
