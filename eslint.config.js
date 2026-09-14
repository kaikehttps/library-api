const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

/**
 * ESLint 9 usa "flat config" (array de objetos), por isso o arquivo se chama eslint.config.js.
 * A ultima posicao do array e do eslint-config-prettier: ele desliga as regras de estilo
 * do ESLint que conflitam com o Prettier (formatacao fica 100% por conta do Prettier).
 */
module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**', 'prisma/migrations/**', 'swagger.json'],
  },

  js.configs.recommended,

  // Codigo da aplicacao (CommonJS rodando no Node)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Parametros iniciados com "_" podem ficar sem uso.
      // Necessario porque o errorHandler do Express exige a assinatura (err, req, res, next).
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off',
    },
  },

  // Arquivos de teste tambem enxergam os globais do Jest (describe, it, expect, jest...)
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  prettier,
];
