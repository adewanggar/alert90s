import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/alert90s.min.js',
    format: 'umd',
    name: 'Alert90s',
    plugins: [terser()]
  },
  plugins: [
    postcss({
      inject: true,
      minimize: true
    })
  ]
};
