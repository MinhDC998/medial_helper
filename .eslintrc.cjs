module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'airbnb', 'airbnb-typescript', 'airbnb/hooks'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    'no-console': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-underscore-dangle': 0,
    'max-len': ['error', { code: 150 }],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ['ConditionalExpression'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/no-misused-promises': 0,
    'no-plusplus': 0,
  },
};
