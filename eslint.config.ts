import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginFp from 'eslint-plugin-fp'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    plugins: {
      fp: pluginFp,
    },
    rules: {
      ...pluginFp.configs.recommended.rules,
      // Disable overly strict rules that conflict with Vue/Testing patterns
      'fp/no-unused-expression': 'off',
      'fp/no-nil': 'off',
      'fp/no-rest-parameters': 'off',
      'fp/no-arguments': 'off',
      'fp/no-events': 'off',
      'fp/no-get-set': 'off',
      'fp/no-proxy': 'off',
      'fp/no-throw': 'off',
      'fp/no-valueof-field': 'off',
      // Allow let but encourage const
      'fp/no-let': 'warn',
      // Allow loops but warn
      'fp/no-loops': 'warn',
      // Allow mutation but warn
      'fp/no-mutation': 'warn',
      'fp/no-mutating-assign': 'warn',
      'fp/no-mutating-methods': 'warn',
      // Allow class for compatibility (Vue components are classes in Options API)
      'fp/no-class': 'off',
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
)
