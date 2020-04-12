process.env.mongo_url =
  "mongodb://ricky:imRicky@localhost:27017/foodies?authSource=admin"
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  verbose: true,
  coverageReporters: ["clover"],
  modulePaths: ["<rootDir>/src/"]
}
