import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import pkg from './package.json';


export default {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    format: 'umd',
    name: 'bexl',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      presets: [
        'flow',
      ],
      plugins: [
        ['babel-plugin-transform-builtin-extend', {
          globals: ['Error'],
        }],
        'transform-class-properties',
      ],
      exclude: [
        'node_modules/**',
      ],
    }),
    commonjs(),
    uglify(),
    license({
      sourceMap: true,
      banner: {
        file: 'LICENSE',
      },
    }),
  ],
};

