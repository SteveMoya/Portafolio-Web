
module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  overrides: [
    {
      files: '*.ts',
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        project: 'tsconfig.json',
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
        'import/prefer-default-export': 'off',
        'prettier/prettier': 'warn',
      },
    },
  ],
};