module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended",
    "plugin:flowtype/recommended",
  ],
  "plugins": [
    "flowtype",
  ],
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true,
    },
  },
  "env": {
    "commonjs": true,
    "es6": true,
  },
  "rules": {
    "arrow-spacing": 2,
    "arrow-parens": 2,
    "arrow-body-style": [
      "error",
      "as-needed"
    ],
    "complexity": [
      "error",
      {"max": 15},
    ],
    "eqeqeq": [
      2,
      "smart",
    ],
    "no-duplicate-imports": "error",
    "no-var": "error",
    "no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],
    "no-warning-comments": 1,
    "prefer-template": "error",
    "semi": "error",
  },
};

