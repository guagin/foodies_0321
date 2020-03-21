module.exports = {
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
          babelConfig: true
        }
      },
      verbose: true,
      coverageReporters: ["clover"],
      modulePaths: ["<rootDir>/src/"]
  };