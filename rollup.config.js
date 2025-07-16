// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: {
    index: "src/index.ts",
    validate: "src/validate.ts",
  },
  output: {
    dir: "lib",
    format: "esm",
    entryFileNames: "[name].mjs"
  },
  plugins: [
    typescript(),
    terser({
      format: {
        comments: "some",
        beautify: true,
        ecma: "2022",
        indent_level: 2,
      },
      compress: false,
      mangle: false,
      module: true,
    }),
  ],
};