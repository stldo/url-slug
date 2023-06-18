import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { type RollupOptions } from 'rollup'
import dts from 'rollup-plugin-dts'

import packageJson from './package.json' assert { type: 'json' }

const BASE_UMD: RollupOptions['output'] = {
  exports: 'named',
  format: 'umd',
  name: 'urlSlug',
}

const config: RollupOptions[] = [
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.module, format: 'esm', sourcemap: true }],
    plugins: [typescript()],
  },

  {
    input: 'src/index.ts',
    output: [
      { file: packageJson.module.replace(/\.mjs$/, '.d.ts'), format: 'es' },
    ],
    plugins: [dts()],
  },

  {
    input: 'src/index.ts',
    output: [{ ...BASE_UMD, file: packageJson.main, sourcemap: true }],
    plugins: [typescript()],
  },

  {
    input: 'src/index.ts',
    output: [
      { ...BASE_UMD, file: packageJson.main.replace(/\.js$/, '.min.js') },
    ],
    plugins: [terser(), typescript()],
  },
]

export default config
