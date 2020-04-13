const plugins = [
  [
    "bare-import-rewrite",
    {
      modulesDir: "../../"
      // rootBaseDir: "../../"
      // alwaysRootImport: [],
      // ignorePrefixes: ["//"],
      // failOnUnresolved: false,
      // resolveDirectories: ["node_modules"]
      // processAtProgramExit: false,
      // preserveSymlinks: true
    }
  ]
];
module.exports = { plugins };
