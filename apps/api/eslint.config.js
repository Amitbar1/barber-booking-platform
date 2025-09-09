import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parser: tsparser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
      'prefer-const': 'error',
    },
  },
]
