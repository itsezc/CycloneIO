import Readline from 'readline'

import Gulp from 'gulp'
import Run from 'gulp-run'

import Babel from 'gulp-babel'
import BabelConfig from './babel.config.js'

import Eslint from 'gulp-eslint'
import EslintConfig from './.eslintrc.js'

import Webpack from 'webpack'
import GulpWebpack from 'webpack-stream'

import BrowserSync from 'browser-sync'

// Need to complete BrowserSync
// Webpack Code Splitting
// Add Eslint to JS files
// Fix Input for Gulp Run to be used on Server Emulator

Gulp.task('client:build', () => {
	return Gulp.src('./source/client/js/environment.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(GulpWebpack({
					mode: 'production',
					output: {
						filename: 'client.js'
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
						]
					}
				}))
				.pipe(Gulp.dest('web-build/assets/'))
})

Gulp.task('client:build:development', () => {
	Gulp.watch('source/client/**/*', Gulp.series('client:build'))
})

Gulp.task('web:build', () => {
	return Gulp.src('./source/web/engine.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(GulpWebpack({
					mode: 'production',
					output: {
						filename: 'web.js'
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
					}
				}))
				.pipe(Gulp.dest('web-build/assets/'))
})

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

Gulp.task('http:build:development', Gulp.series('http:run', () => {
	Gulp.watch('source/http/**/*', Gulp.series('http:build', 'http:run'))
}))

Gulp.task('common:build', () => {
	return Gulp.src('source/common/**/*.js')
				.pipe(Eslint(EslintConfig))
				.pipe(Eslint.format())
				.pipe(Eslint.failAfterError())
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/common'))
})

Gulp.task('common:build:development', () => {
	Gulp.watch('source/common/**/*.js', Gulp.series('common:build'))
})

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

Gulp.task('server:build:development', Gulp.series('server:run', () => {
	Gulp.watch('source/server/**/*', Gulp.series('server:build', 'server:run'))
}))

Gulp.task('default', Gulp.series('client:build', 'web:build', 'http:build', 'common:build', 'server:build'))

// Things to do:
// [✅] Build Client with Webpack and Live Reload - BrowserSync (?)
// [] Build Web CMS with Webpack and Export via Gulp
// [] Fix Webpack warnings
// [✅] Build Common Utils with Babel to dist and Live Reload
// [✅] Build Emulation Server with Babel to dist with Live Reload
// [✅] Build HTTP ( / API ) Server with Babel to dist with Live Reload
