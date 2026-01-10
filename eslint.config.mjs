import { defineConfig } from 'eslint/config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginImport from 'eslint-plugin-import'

// ============================================================================
// Custom Rule: Enforce Naming Conventions from CONTRIBUTING.md
// Note: Avoiding 'types' constraint as it requires type-aware linting
// ============================================================================
const namingConventionRules = {
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'class',
      filter: { regex: 'Service$', match: true },
      format: ['PascalCase'],
      suffix: ['Service']
    },
    {
      selector: 'class',
      filter: { regex: 'Handler$', match: true },
      format: ['PascalCase'],
      suffix: ['Handler']
    },
    {
      selector: 'class',
      format: ['PascalCase']
    },
    {
      selector: 'interface',
      format: ['PascalCase'],
      custom: {
        regex: '^I?[A-Z]',
        match: true
      }
    },
    {
      selector: 'typeAlias',
      format: ['PascalCase']
    },
    {
      selector: 'variable',
      modifiers: ['const', 'exported'],
      format: ['PascalCase', 'camelCase', 'UPPER_CASE']
    },
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE']
    },
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase']
    },
    {
      selector: 'parameter',
      format: ['camelCase'],
      leadingUnderscore: 'allow'
    },
    {
      selector: 'property',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase']
    },
    {
      selector: 'method',
      format: ['camelCase']
    },
    {
      selector: 'enumMember',
      format: ['UPPER_CASE', 'PascalCase']
    }
  ]
}

// ============================================================================
// Architecture Enforcement Rules
// ============================================================================
const architectureRules = {
  'import/order': [
    'warn',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'type'
      ],
      'newlines-between': 'never',
      pathGroups: [
        {
          pattern: 'electron',
          group: 'builtin',
          position: 'before'
        },
        {
          pattern: 'react',
          group: 'external',
          position: 'before'
        },
        {
          pattern: '@renderer/**',
          group: 'internal',
          position: 'before'
        },
        {
          pattern: '@shared/**',
          group: 'internal',
          position: 'before'
        }
      ],
      pathGroupsExcludedImportTypes: ['builtin', 'type']
    }
  ],
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: './src/renderer/**/*',
          from: './src/main/**/*',
          message:
            'Renderer process cannot import from main process. Use shared contracts instead.'
        },
        {
          target: './src/main/**/*',
          from: './src/renderer/**/*',
          message:
            'Main process cannot import from renderer process. Use shared contracts instead.'
        },
        {
          target: './src/preload/**/*',
          from: './src/renderer/**/*',
          message: 'Preload script cannot import from renderer process.'
        }
      ]
    }
  ]
}

// ============================================================================
// TypeScript Strict Rules
// ============================================================================
const typescriptStrictRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
      allowConciseArrowFunctionExpressionsStartingWithVoid: false
    }
  ],
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    {
      accessibility: 'no-public',
      overrides: {
        constructors: 'no-public',
        properties: 'off',
        parameterProperties: 'explicit'
      }
    }
  ],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      disallowTypeAnnotations: true,
      fixStyle: 'separate-type-imports'
    }
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }
  ]
}

// ============================================================================
// React Specific Rules
// ============================================================================
const reactRules = {
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-pascal-case': ['error', { allowAllCaps: false }],
  'react/prop-types': 'off',
  'react/self-closing-comp': ['error', { component: true, html: true }],
  'react/no-array-index-key': 'warn',
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function'
    }
  ],
  'react/jsx-boolean-value': ['error', 'never'],
  'react/no-unused-state': 'error'
}

// ============================================================================
// General Code Quality Rules
// ============================================================================
const codeQualityRules = {
  curly: ['error', 'multi-line', 'consistent'],
  'no-console': 'off',
  'no-debugger': 'error',
  'prefer-const': 'error',
  'no-var': 'error',
  'prefer-template': 'error',
  'prefer-arrow-callback': 'error',
  'object-shorthand': ['error', 'always'],
  'no-duplicate-imports': 'off',
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'max-len': [
    'warn',
    {
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true
    }
  ],
  'max-lines': [
    'warn',
    {
      max: 400,
      skipBlankLines: true,
      skipComments: true
    }
  ],
  complexity: ['warn', 15]
}

export default defineConfig([
  { ignores: ['**/node_modules', '**/dist', '**/out', '**/*.js', '**/*.mjs'] },

  ...tseslint.configs.recommended,

  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // ============================================================================
  // Main Process Rules (Node.js context)
  // ============================================================================
  {
    files: ['src/main/**/*.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      ...namingConventionRules,
      ...typescriptStrictRules,
      ...architectureRules,
      ...codeQualityRules,
      'no-console': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'error'
    }
  },

  // ============================================================================
  // Preload Script Rules (Bridge context)
  // ============================================================================
  {
    files: ['src/preload/**/*.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      ...namingConventionRules,
      ...typescriptStrictRules,
      ...architectureRules,
      ...codeQualityRules,
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['fs', 'path', 'child_process', 'os'],
              message: 'Do not expose Node.js modules directly. Use IPC instead.'
            }
          ]
        }
      ]
    }
  },

  // ============================================================================
  // Shared Contracts Rules (Types and interfaces only)
  // ============================================================================
  {
    files: ['src/shared/**/*.ts'],
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      ...namingConventionRules,
      ...typescriptStrictRules,
      ...codeQualityRules,
      // Shared should only contain types, interfaces, and constants
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration',
          message: 'Classes are not allowed in shared contracts. Use interfaces and types only.'
        }
      ]
    }
  },

  // ============================================================================
  // Renderer Process Rules (React/Browser context)
  // ============================================================================
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh,
      import: eslintPluginImport
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,
      ...namingConventionRules,
      ...typescriptStrictRules,
      ...architectureRules,
      ...reactRules,
      ...codeQualityRules,
      // No Node.js globals in renderer
      'no-restricted-globals': [
        'error',
        {
          name: 'process',
          message: 'process is not available in renderer. Use window.api for IPC.'
        },
        {
          name: '__dirname',
          message: '__dirname is not available in renderer.'
        },
        {
          name: '__filename',
          message: '__filename is not available in renderer.'
        }
      ],
      // Prevent direct electron usage in renderer
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['electron'],
              message: 'Do not import electron directly in renderer. Use window.api.'
            }
          ]
        }
      ]
    }
  },

  // ============================================================================
  // React Component Files (specific naming enforcement)
  // ============================================================================
  {
    files: ['src/renderer/**/*.tsx'],
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function'
        }
      ]
    }
  },

  // ============================================================================
  // Hook Files (specific naming enforcement)
  // ============================================================================
  {
    files: ['src/renderer/**/use*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error'
    }
  },

  // ============================================================================
  // Test Files (relaxed rules)
  // ============================================================================
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines': 'off',
      'no-console': 'off'
    }
  },

  // ============================================================================
  // Configuration Files (allow default exports, CommonJS)
  // ============================================================================
  {
    files: ['*.config.ts', '*.config.js', '*.config.mjs'],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },

  // ============================================================================
  // Declaration Files (.d.ts) - relaxed type import rules
  // ============================================================================
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off'
    }
  },

  // ============================================================================
  // Disable Prettier ESLint rule - formatting is handled by `npm run format`
  // This allows the codebase to pass lint even if not fully formatted
  // ============================================================================
  {
    files: ['**/*.{ts,tsx,js,mjs,d.ts}'],
    rules: {
      'prettier/prettier': 'off'
    }
  },

  eslintConfigPrettier,

  {
    rules: {
      'prettier/prettier': 'off'
    }
  }
])
