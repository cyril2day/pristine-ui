# PristineUI

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://pristine.cylonsido.dev)

An Apple-inspired Vue.js component library that harmonizes the elegance of Apple’s Human Interface Guidelines with the inclusivity of WAI‑ARIA design patterns. Delivers clean, intuitive, and accessible UI components.

## Features

- **Apple HIG Inspired** – Familiar, clean, and elegant design language.
- **Accessibility First** – Built with WAI‑ARIA patterns and semantic HTML.
- **TypeScript Support** – Full type safety and IntelliSense.
- **Sass/SCSS Styling** – Modular, customizable styles with design tokens.
- **Responsive Design** – Works across mobile, tablet, and desktop.
- **Light/Dark Mode** – Automatic theme detection with custom CSS variables.
- **Vitest Unit Testing** – Reliable, fast tests for every component.
- **ESLint Configuration** – Code quality and consistency.
- **Functional Programming** – Emphasis on pure functions, immutability, and composability.

## Installation

```bash
# using npm
npm install pristine-ui

# using pnpm
pnpm add pristine-ui

# using yarn
yarn add pristine-ui
```

## Usage

```vue
<script setup lang="ts">
import { PushButton } from 'pristine-ui'
</script>

<template>
  <PushButton variant="primary" size="medium">
    Click Me
  </PushButton>
</template>
```

### Available Components

- **PushButton** – Buttons with various roles, sizes, and shapes.
- **TextField** – Text input with states, sizes, and variants.
- **Checkbox** – Checkbox with support for indeterminate state.
- **RadioButton** – Radio button for single selection.
- **SwitchToggle** – Toggle switch with on/off labels.
- **SegmentedControl** – Segmented control for selecting one option from a set.
- **TabView** – Tab view combining segmented control and tab panels.
- **DotIndicator** – Dot indicator for status or pagination.

Each component is documented in the [demo](https://pristine.cylonsido.dev) and can be imported individually.

## Project Structure

```
pristine-ui/
├── src/
│   ├── components/          # Vue components (PushButton, TextField, etc.)
│   ├── composables/         # Reusable composition functions
│   ├── styles/              # Design tokens, base styles, typography
│   ├── views/               # Demo page and views
│   └── __tests__/           # Unit tests
├── references/              # Apple HIG and ARIA reference PDFs
├── plans/                   # Project documentation and architecture
└── public/                  # Static assets for demo
```

## Development

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/cyril2day/pristine-ui.git
cd pristine-ui

# Install dependencies
pnpm install

# Start development server (demo app)
pnpm dev
```

### Build Library

```bash
pnpm build
```

### Run Tests

```bash
pnpm test:unit
```

### Lint Code

```bash
pnpm lint
```

## Coding Guidelines

The project follows a strong functional programming discipline combined with Vue 3 best practices:

- **Pure functions & immutability** – Side effects are isolated, data is never mutated.
- **TypeScript first** – Full type safety, discriminated unions, readonly types.
- **Composition API** – Reusable composables, single‑responsibility components.
- **Comprehensive testing** – Vitest for unit tests, @vue/test‑utils for components.
- **Accessibility by design** – WAI‑ARIA roles, keyboard navigation, semantic HTML.

## Live Demo

Explore all components interactively at [https://pristine.cylonsido.dev](https://pristine.cylonsido.dev).

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) (to be added) and ensure your code follows the project’s style and accessibility standards.

## License

MIT © [psi](https://github.com/psi)
