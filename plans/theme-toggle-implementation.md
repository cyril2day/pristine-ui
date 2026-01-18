# Theme Toggle Implementation Plan

## Overview
Enhance the demo page by adding a theme toggle (using the existing `SwitchToggle` component) below the GitHub section, allowing users to switch between light and dark modes. The implementation will follow functional programming principles and utilize the project's existing utilities (`existy`, `truthy`, `doWhen`) and Underscore library.

## Theme Management Design

### Functional Utilities
- Use `existy` to check for stored theme in `localStorage`.
- Use `truthy` to evaluate conditions (e.g., whether a stored theme is valid).
- Use `doWhen` to apply side effects only when certain conditions are met.
- Use Underscore's `_.throttle` for efficient media‑query listener updates.

### Pure Functions
```typescript
type Theme = 'light' | 'dark'

/** Reads the stored theme from localStorage (no side effects). */
function getStoredTheme(): Theme | null

/** Detects the OS color‑scheme preference (no side effects). */
function getOSTheme(): Theme

/** Determines the initial theme: stored → OS → light (no side effects). */
function getInitialTheme(): Theme

/** Returns the CSS class name corresponding to a theme. */
function themeToClassName(theme: Theme): string
```

### Side‑Effect Functions
```typescript
/** Applies a theme to the document root (adds/removes `.dark` class). */
function applyTheme(theme: Theme): void

/** Stores the theme in localStorage (if storage is available). */
function persistTheme(theme: Theme): void
```

### Composable `useTheme`
A Vue composable that provides reactive theme state and a toggle function.

**API:**
```typescript
export function useTheme(): {
  theme: Ref<Theme>
  toggleTheme: () => void
}
```

**Implementation notes:**
- On mount, reads the initial theme and applies it.
- Watches the `theme` ref and automatically calls `applyTheme` and `persistTheme`.
- Listens to OS preference changes (via `matchMedia`) and updates the theme only when there is no stored preference.
- Uses `_.throttle` to limit the frequency of media‑query updates.

## Demo Page Changes

### HTML Structure
Wrap the existing GitHub corner and the new theme toggle in a container `top‑right‑actions` to keep the layout clean.

```html
<section class="top-section">
  <div>
    <h1 class="page-title">Component Demo</h1>
    <p class="page-subtitle">A simple showcase of the available components.</p>
  </div>

  <div class="top-right-actions">
    <div class="github-corner">
      <a href="..." aria-label="GitHub repository">
        <IconGithub />
      </a>
    </div>
    <div class="theme-toggle">
      <label for="theme-switch">Dark mode</label>
      <SwitchToggle id="theme-switch" v-model="isDark" />
    </div>
  </div>
</section>
```

### CSS Adjustments
- Remove the `top`/`right` positioning from `.github‑corner` (these properties are currently ineffective).
- Style `.top‑right‑actions` as a flex column aligned to the end.
- Add appropriate spacing between the GitHub icon and the toggle.
- Ensure the toggle label is visually aligned and follows the project's typography tokens.

### Script Section
Add the composable and bind it to the `SwitchToggle`:

```typescript
import { useTheme } from '@/utils/theme'

const { isDark } = useTheme() // isDark is a ref<boolean>
```

## Testing Strategy
- Verify that the theme toggle correctly adds/removes the `.dark` class on the `<html>` element.
- Verify that the toggle reflects the current OS preference when no stored preference exists.
- Verify that the stored preference is respected across page reloads.
- Ensure the toggle is accessible (keyboard navigation, ARIA attributes).
- Manual visual check in both light and dark modes.

## Compliance with Coding Guidelines
- **TypeScript**: Use `type` over `interface` for `Theme`.
- **Classes**: Avoid classes; use plain functions and composables.
- **Functional programming**: Employ the existing functional utilities and Underscore where appropriate.
- **CSS property order**: Follow the WordPress CSS Coding Standards when adding or modifying styles.
- **Documentation**: Provide JSDoc comments for public functions.

## Dependencies
- Existing `SwitchToggle` component.
- Existing functional utilities (`src/utils/functional.ts`).
- Underscore library (already in `package.json`).

## Acceptance Criteria
- [ ] Theme toggle appears below the GitHub section.
- [ ] Toggle switches between light and dark modes visually.
- [ ] Theme preference persists across page reloads.
- [ ] OS color‑scheme preference is respected as the initial theme.
- [ ] Implementation uses functional utilities (`existy`, `truthy`, `doWhen`).
- [ ] Code follows the project's TypeScript and CSS guidelines.
- [ ] No regression in existing demo page functionality.

## Next Steps
1. Switch to **Code** mode to implement the changes.
2. After implementation, run `pnpm lint` and `pnpm test` to verify.
3. Optionally update the demo page with more examples (disabled state, etc.).