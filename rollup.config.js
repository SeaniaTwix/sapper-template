import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import sveltePreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';
import packageImporter from 'node-sass-package-importer'
import includePaths from 'rollup-plugin-includepaths'

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const extensions = ['.ts', '.js', '.mjs', '.html', '.svelte']
const includePathsOptions = {
	include: {},
	paths: ['src'],
	external: ['AppModule'],
	extensions,//: ['.js', '.json', '.html']
}

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: sveltePreprocess({
					postcss: {
						plugins: [
							require('autoprefixer')({}),
						],
					},
					scss: {
						includePaths: ['src'],
						importer: packageImporter(),
					}
				})
			}),
			typescript({ sourceMap: dev }),
			resolve({
				extensions,
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			includePaths(includePathsOptions),

			legacy && babel({
				extensions,
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					'@babel/plugin-proposal-do-expressions',
					'@babel/plugin-proposal-nullish-coalescing-operator',
					'@babel/plugin-proposal-object-rest-spread',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				hydratable: true,
				dev,
				preprocess: sveltePreprocess({
					postcss: {
						plugins: [
							require('autoprefixer')({}),
						],
					},
					scss: {
						includePaths: ['src'],
						importer: packageImporter(),
					}
				})
			}),
			typescript({ sourceMap: dev }),
			legacy && babel({
				extensions,
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					'@babel/plugin-proposal-do-expressions',
					'@babel/plugin-proposal-nullish-coalescing-operator',
					'@babel/plugin-proposal-object-rest-spread',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),
			resolve({
				extensions,
				dedupe: ['svelte']
			}),
			commonjs(),
			includePaths(includePathsOptions),
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: 'strict',
		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		],

		preserveEntrySignatures: false,
		onwarn,
	}
};
