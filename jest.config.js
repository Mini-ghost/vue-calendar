module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',

  transform: {
    '^.+\\.svg': '<rootDir>/script/svgTransform.js'
  },

  testMatch: [
    '**/test/**/*.js',
    '**/__tests__/**/*.spec.js',
    '**/__tests__/**/*.spec.ts',
  ],
}
