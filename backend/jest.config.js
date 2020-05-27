module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/src/middlewares"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  "collectCoverage" : true,
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
};
