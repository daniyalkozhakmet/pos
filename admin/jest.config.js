/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  clearMocks: true,
  collectCoverage: true,
  verbose: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules"],
  moduleDirectories: ["node_modules", "src"],
};

module.exports = config;
