import { defineConfig, type UserConfig } from "tsdown";

export default defineConfig({
  dts: true,
  exports: true,
  format: ["cjs", "esm"],
  minify: true,
  outputOptions: {
    exports: "named",
  },
  sourcemap: "hidden",
}) satisfies UserConfig as UserConfig;
