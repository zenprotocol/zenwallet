const { resolve } = require('path')

module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "extends": "airbnb",
  "env": {
    "jest/globals": true,
    "browser": true,
    "node": true
  },
  "globals": {
    "changeInputValue": true,
    "sel": true,
    "flushAllPromises": true
  },
  "rules": {
    "semi": ["error", "never"],
    "no-unexpected-multiline": 2,
    "no-param-reassign": 0,
    "class-methods-use-this": "off",
    "arrow-parens": ["off"],
    "compat/compat": "error",
    "consistent-return": "off",
    "generator-star-spacing": "off",
    "import/order": ["error", {"newlines-between": "always"}],
    "import/no-unresolved": "error",
    "import/extensions": "error",
    "import/no-extraneous-dependencies": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/no-autofocus": 0,
    "no-console": "off",
    "no-use-before-define": "off",
    "no-multi-assign": "off",
    "promise/param-names": "error",
    "promise/always-return": "error",
    "promise/catch-or-return": "error",
    "promise/no-native": "off",
    "react/no-array-index-key": 0,
    "react/sort-comp": ["error", {
      "order": ["type-annotations", "static-methods", "lifecycle", "everything-else", "render"]
    }],
    "react/jsx-no-bind": "off",
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
    "react/prefer-stateless-function": "off"
  },
  "plugins": [
    "jest",
    "flowtype",
    "import",
    "promise",
    "compat",
    "react"
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: [
          resolve(__dirname, 'app', 'vendor'),
          'node_modules',
        ],
      },
    },
  },
}
