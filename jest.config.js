const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('jest', {
  // setupFilesAfterEnv is used after the jest environment has been loaded.  In general this is what you want.  
  // If you want to add config BEFORE jest loads, use setupFiles instead.  
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
  ],
  moduleNameMapper: {
    '@node_modules/(.*)': '<rootDir>/node_modules/$1',
     // optional alias, this is an example
    '@communications-app/(.*)': '<rootDir>/$1'
  },
});
