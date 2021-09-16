import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default ["src/background.ts", "src/dashboard.ts", "src/settings.ts"].map(
  (input) => ({
    input,
    output: {
      dir: "dist",
      format: "umd",
      sourcemap: true,
    },
    plugins: [nodeResolve(), typescript()],
  })
);
