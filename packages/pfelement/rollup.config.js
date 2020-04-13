import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/pfelement.js",
  output: {
    file: "dist/pfelement.js",
    format: "esm",
    sourcemap: true
  },
  plugins: [resolve(), terser({ output: { comments: false } })]
};
