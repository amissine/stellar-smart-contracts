import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'
import json from "@rollup/plugin-json";
import { terser } from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.mjs',
	output: { 
    file: 'dist/index.mjs',
    format: 'es', 
    sourcemap: true,
    exports: 'named' 
  },
  external: ['node-fetch'],
	plugins: [
    json(), // to import 'stellar-sdk'
		resolve({ preferBuiltins: true }), 
		commonjs(), // to import from node_modules
		production && terser() // minify, but only in production
	]
};
