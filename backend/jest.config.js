module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/src/middlewares",
    "/src/socket",
    "/src/services/auth/db_manager.ts",
    "/src/services/group/db_manager.ts",
    "/src/services/msg/db_manager.ts",
    "/src/services/stat/db_manager.ts",
    "/src/services/user/db_manager.ts",
    "/src/services/group/routes.ts",
    "/src/helpers",
    "/src/common"
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
