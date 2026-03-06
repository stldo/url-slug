import { defineConfig, type UserConfig } from "tsdown";

export default defineConfig({
  dts: true,
  exports: true,
  format: ["cjs", "esm"],
  minify: true,
  sourcemap: "hidden",
}) satisfies UserConfig as UserConfig;
