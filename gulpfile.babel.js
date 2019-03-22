import Config from './config.json'

import Gulp from 'gulp'
import Run from 'gulp-run'

import Babel from 'gulp-babel'
import BabelConfig from './babel.config.js'

import Eslint from 'gulp-eslint'
import EslintConfig from './.eslintrc.js'

import Webpack from 'webpack'
import GulpWebpack from 'webpack-stream'
import TerserWebpackPlugin from 'terser-webpack-plugin'

import Pug from 'gulp-pug'

import BrowserSync from 'browser-sync'

// Need to complete BrowserSync
// Webpack Code Splitting
// [✅] Add Eslint to JS files
// Check all Files are linted with Eslint on Webpack with Jest
// Fix Input for Gulp Run to be used on Server Emulator


/**
	Tests

	Client Dev Build Works


**/

Gulp.task('resources:build', () => {
	return Gulp.src('./source/client/js/environment.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(GulpWebpack({
					mode: 'development',
					entry: {
						web: './source/web/engine.js',
						client: './source/client/js/environment.js'
					},
					devtool: 'source-map',
					output: {
						filename: '[name].js'
					},
					module: {
						rules: [
							{
								test: /\.(js|jsx)$/,
								exclude: /node_modules/,
								use: [
								  'babel-loader'
								]
							},
							{
								test: /\.styl$/,
								use: [
									'stylus-loader'
								]
							},
							{
								test: /\.(pug|page)$/,
								use: [
									'pug-loader'
								]
							}
						]
					},
					optimization: {
						removeAvailableModules: true,
						removeEmptyChunks: true,
						mergeDuplicateChunks: true
					},
					watch: true
				}))
				.pipe(Gulp.dest('web-build/dist/'))
})

Gulp.task('resources:build:index', () => {
	return Gulp.src('source/web/themes/' + Config.hotel.theme + '/structure.page')
				.pipe(Pug())
				.pipe(Gulp.dest('dist/'))
})

Gulp.task('resources:build:development', () => {
	Gulp.watch(['source/client/**/*', 'source/web/**/*'], Gulp.series('resources:build:index', 'resources:build'))
})

// Gulp.task('client:build:development', () => {
// 	Gulp.watch('source/client/**/*', Gulp.series('client:build'))
// })
//
//
// Gulp.task('web:build', Gulp.series('web:build:index', () => {
// 	return Gulp.src('./source/web/engine.js')
// 				.pipe(Eslint(EslintConfig))
// 				.pipe(Eslint.format())
// 				.pipe(Eslint.failAfterError())
// 				.pipe(GulpWebpack({
// 					mode: 'development',
// 					output: {
// 						filename: 'web.js'
// 					},
// 					module: {
// 						rules: [
// 							{
// 								test: /\.(js|jsx)$/,
// 								exclude: /node_modules/,
// 								use: [
// 								  'babel-loader'
// 								]
// 							},
// 							{
// 								test: /\.styl$/,
// 								use: [
// 									'stylus-loader'
// 								]
// 							},
// 							{
// 								test: /\.(pug|page)$/,
// 								use: [
// 									'pug-loader'
// 								]
// 							}
// 						]
// 					}
// 				}))
// 				.pipe(Gulp.dest('web-build/'))
// }))
//
// Gulp.task('web:build:development', Gulp.series('web:build', () => {
// 	Gulp.watch('source/web/**/*', Gulp.series('web:build'))
// }))


Gulp.task('http:build', () => {
	return Gulp.src('source/http/**/*.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/http'))
})

Gulp.task('http:run', () => {
	return Run('npm run http:start').exec()
})

Gulp.task('http:build:development', () => {
	Gulp.watch('source/http/**/*', Gulp.series('http:build', 'http:run'))
})

Gulp.task('common:build', () => {
	return Gulp.src('source/common/**/*.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/common'))
})

Gulp.task('common:build:development', Gulp.series('common:build', () => {
	Gulp.watch('source/common/**/*.js', Gulp.series('common:build'))
}))

Gulp.task('server:build', () => {
	return Gulp.src('source/server/**/*.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/server'))
})

Gulp.task('server:run', () => {
	return Run('npm run server:start').exec()
})

Gulp.task('server:build:development', () => {
	Gulp.watch('source/server/**/*', Gulp.series('server:build', 'server:run'))
})

Gulp.task('default', Gulp.series('resources:build', 'http:build', 'common:build', 'server:build'))

// Gulp.task('build:development', Gulp.series('default', Gulp.parallel('server:run', 'http:run'), () => {
// 	Gulp.watch('source/**/*', Gulp.series('default', Gulp.parallel('server:run', 'http:run')))
// }))
//
// Gulp.task('build:resources', () => {
// 	Gulp.watch('source/**/*', Gulp.series('client:build', 'common:build', 'web:build'))
// })

// Things to do:
// [✅] Build Client with Webpack and Live Reload - BrowserSync (?)
// [✅] Build Web CMS with Webpack and Export, with Live Reload via Gulp
// [] Fix Webpack warnings
// [✅] Build Common Utils with Babel to dist and Live Reload
// [✅] Build Emulation Server with Babel to dist with Live Reload
// [✅] Build HTTP ( / API ) Server with Babel to dist with Live Reload
