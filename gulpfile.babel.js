import Gulp from 'gulp'
import Run from 'gulp-run'

import Babel from 'gulp-babel'
import BabelConfig from './babel.config.js'

import Webpack from 'webpack'
import GulpWebpack from 'webpack-stream'

Gulp.task('client:build', () => {
	return Gulp.src('./source/client/js/environment.js')
				.pipe(GulpWebpack({
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

Gulp.task('web:build', () => {
	return Gulp.src('./source/web/engine.js')
				.pipe(GulpWebpack({
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
	return Gulp.src('source/api/**/*.js')
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
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/common'))
})

Gulp.task('common:build:development', () => {
	Gulp.watch('source/common/**/*.js', Gulp.series('common:build'))
})

Gulp.task('server:build', () => {
	return Gulp.src('source/server/**/*.js')
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/server'))
})

Gulp.task('server:run', () => {
	return Run('npm run server:start').exec()
})

Gulp.task('server:build:development', Gulp.series('server:run', () => {
	Gulp.watch('source/server/**/*', Gulp.series('server:build', 'server:run'))
}))

Gulp.task('default', Gulp.series('client.build', 'web:build', 'http:build', 'common:build', 'server:build'))

// Things to do:
// [] Create Live Reload with HTTP Server
// [✅] Create Live Reload with Emulation Server
// [] Build Client with Webpack
// [] Build CMS with Webpack
// [] Fix Webpack warnings
// [✅] Build Common Utils with Babel to dist
// [✅] Build Server with Babel to dist
// [✅] Build HTTP ( / API ) Server with Babel to dist
