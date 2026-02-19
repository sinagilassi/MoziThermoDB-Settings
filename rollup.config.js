import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const external = ["zod"];

export default [
  {
    input: "src/index.ts",
    external,
    plugins: [
      resolve({ browser: false }),
      typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    ],
    output: [
      { file: "dist/index.mjs", format: "es", sourcemap: true },
      { file: "dist/index.cjs", format: "cjs", sourcemap: true, exports: "named" },
      { file: "dist/index.browser.mjs", format: "es", sourcemap: true },
    ],
  },
  {
    input: "src/index.ts",
    external,
    plugins: [dts({ tsconfig: "./tsconfig.json" })],
    output: [{ file: "dist/index.d.ts", format: "es" }],
  },
];
