import Gulp from 'gulp'

import Babel from 'gulp-babel'
import BabelConfig from './babel.config.js'

import Webpack from 'webpack'
import GulpWebpack from 'webpack-stream'

Gulp.task('build:client', () => {
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

Gulp.task('build:web', () => {
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

Gulp.task('build:http', () => {
	return Gulp.src('source/api/**/*.js')
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/http'))
})

Gulp.task('build:common', () => {
	return Gulp.src('source/common/**/*.js')
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/common'))
})

Gulp.task('build:server', () => {
	return Gulp.src('source/server/**/*.js')
				.pipe(Babel(BabelConfig))
				.pipe(Gulp.dest('dist/server'))
})

Gulp.task('default', Gulp.series('build:client', 'build:web', 'build:http', 'build:common', 'build:server'))

// Things to do:
// [] Create Live Reload with HTTP Server and Resources
// [] Build Client with Webpack
// [] Build CMS with Webpack
// [✅] Build Common Utils with Babel to dist
// [✅] Build Server with Babel to dist
// [✅] Build HTTP ( / API ) Server with Babel to dist
