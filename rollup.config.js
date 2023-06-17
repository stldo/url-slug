import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

import packageJson from './package.json'

const BASE_UMD = {
  format: 'umd',
  name: 'urlSlug',
}

export default [
  {
    input: 'src/index.js',
    output: [{ file: packageJson.module, format: 'esm' }],
  },
  {
    input: 'src/umd.js',
    output: [{ file: packageJson.main, ...BASE_UMD }],
  },
  {
    input: 'src/umd.js',
    output: [
      { file: packageJson.main.replace(/\.js$/, '.min.js'), ...BASE_UMD },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),

      terser(),
    ],
  },
]
