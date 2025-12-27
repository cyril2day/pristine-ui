# PristineUI

An Apple-inspired Vue.js component library that harmonizes the elegance of Apple’s Human Interface Guidelines with the inclusivity of WAI-ARIA design patterns. Delivers clean, intuitive, and accessible UI components.

## Features

- **Apple HIG Inspired** – Familiar, clean, and elegant design language.
- **Accessibility First** – Built with WAI-ARIA patterns and semantic HTML.
- **TypeScript Support** – Full type safety and IntelliSense.
- **Sass/SCSS Styling** – Modular, customizable styles with design tokens.
- **BEM Naming** – Consistent and predictable CSS class names.
- **Responsive Design** – Works across mobile, tablet, and desktop breakpoints.
- **Light/Dark Mode** – Automatic theme detection with custom CSS variables.
- **Vitest Unit Testing** – Reliable, fast tests for every component.
- **ESLint Configuration** – Code quality and consistency.

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
import { BaseButton } from 'pristine-ui'
</script>

<template>
  <BaseButton variant="primary" size="medium">
    Click Me
  </BaseButton>
</template>
```

## Project Structure

```
pristine-ui/
├── src/
│   ├── components/          # Vue components (BaseButton, ModalDialog, etc.)
│   ├── styles/
│   │   ├── variables/       # Design tokens (colors, spacing, typography)
│   │   ├── base/            # CSS reset, utilities
│   │   └── features/        # Component-specific styles
│   └── __tests__/           # Unit tests
├── dist/                    # Built library (published)
├── plans/                   # Project documentation and architecture
├── references/              # Apple HIG and ARIA references
└── contexts/                # Project inception and concept notes
```

## Development

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/pristine-ui.git
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

## Styling Guidelines

- **Colors** – Use HSL for easy theme switching.
- **Spacing** – Relative units (rem, em) and a 4‑px base unit.
- **Breakpoints** – 320px (mobile), 735px (tablet), 1250px (desktop).
- **BEM** – All component classes follow Block‑Element‑Modifier syntax.
- **Dark Mode** – Implemented via CSS custom properties and `prefers-color-scheme`.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) (to be added) and ensure your code follows the project’s style and accessibility standards.

## License

MIT © [psi](https://github.com/psi)
