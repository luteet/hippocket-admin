import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // React Compiler bails out of memoizing components that use TanStack
      // Table's `useReactTable()` or React Hook Form's `watch()` (they return
      // non-memoizable functions). That's the intended, safe behavior, and the
      // compiler isn't even part of our Vite build — keep the lint log clean.
      'react-hooks/incompatible-library': 'off',
    },
  },
])
