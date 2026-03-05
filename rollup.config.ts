import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { readFileSync } from 'fs'
import { type RollupOptions } from 'rollup'
import dts from 'rollup-plugin-dts'

const PACKAGE_JSON = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)

const BASE_UMD: RollupOptions['output'] = {
  exports: 'named',
  format: 'umd',
  name: 'urlSlug',
}

const config: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: [{ file: PACKAGE_JSON.module, format: 'esm', sourcemap: true }],
    plugins: [typescript()],
  },

  {
    input: 'src/index.ts',
    output: [
      { file: PACKAGE_JSON.module.replace(/\.mjs$/, '.d.ts'), format: 'es' },
    ],
    plugins: [dts()],
  },

  {
    input: 'src/index.ts',
    output: [{ ...BASE_UMD, file: PACKAGE_JSON.main, sourcemap: true }],
    plugins: [typescript()],
  },

  {
    input: 'src/index.ts',
    output: [
      { ...BASE_UMD, file: PACKAGE_JSON.main.replace(/\.js$/, '.min.js') },
    ],
    plugins: [terser(), typescript()],
  },
]

export default config
