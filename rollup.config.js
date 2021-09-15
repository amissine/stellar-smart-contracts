import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'
import json from "@rollup/plugin-json";
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.mjs',
	output: { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'auto' },
	plugins: [
    json(), // to import 'stellar-sdk'
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && terser() // minify, but only in production
	]
};
