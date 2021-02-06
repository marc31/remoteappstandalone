module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  plugins: ['prettier'],
  extends: ['prettier', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-debugger': 'warn'
  }
}
