import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/pfe-card.js",
  output: {
    file: "dist/pfe-card.js",
    format: "esm",
    sourcemap: true
  },
  plugins: [
    resolve(),
    // postcss({ extract: false, use: ["sass"] })
    babel(),
    terser()
  ],
  external: id => "@patternfly/pfelement"
};
