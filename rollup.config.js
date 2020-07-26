import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

import packageJson from './package.json'

const BASE_PLUGINS = [
  resolve(),
  commonjs({ include: 'node_modules/**' }),
  babel({
    babelHelpers: 'runtime',
    babelrc: false,
    exclude: 'node_modules/**',
    plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]]
  })
]

const BASE_UMD = {
  format: 'umd',
  name: 'urlSlug'
}

export default [{
  input: 'src/index.js',
  output: [{ file: packageJson.module, format: 'esm' }],
  plugins: BASE_PLUGINS
}, {
  input: 'src/umd.js',
  output: [{ file: packageJson.main, ...BASE_UMD }],
  plugins: BASE_PLUGINS
}, {
  input: 'src/umd.js',
  output: [{ file: packageJson.main.replace(/\.js$/, '.min.js'), ...BASE_UMD }],
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    ...BASE_PLUGINS,
    terser()
  ]
}]
