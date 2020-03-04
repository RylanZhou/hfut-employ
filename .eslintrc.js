module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'extends': ['standard'],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
    'wx': true,
    'getApp': true,
    'Page': true,
    'Component': true
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'space-before-function-paren': 'off'
  }
}
