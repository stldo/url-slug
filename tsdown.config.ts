import { defineConfig, type UserConfig } from "tsdown";

export default defineConfig({
  deps: {
    onlyBundle: [],
  },
  dts: true,
  exports: true,
  format: ["cjs", "esm"],
  minify: true,
  outputOptions: {
    exports: "named",
  },
  sourcemap: "hidden",
}) as UserConfig;
