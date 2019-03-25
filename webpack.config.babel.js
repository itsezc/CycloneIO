import Config from './config.json'

import Webpack from 'webpack'
import Path from 'path'

import htmlWebpackPlugin from 'html-webpack-plugin'

module.exports = (env, argv) => {
	return {
		target: 'web',

		context: Path.resolve(__dirname, 'source'),

		plugins: [
			new htmlWebpackPlugin({
				filename: 'structure.html',
				template: `./web/themes/${Config.hotel.theme}/structure.page`,
				inject: false
			})
		],

		entry: {
			web: './web/engine.js',
			client: './client/index.js'
		},

		devServer: {
			historyApiFallback: true
		},

		output: {
			path: Path.join(__dirname, './web-build/dist'),
			filename: '[name].min.js'
		},
		devtool: 'source-map',
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
	}
}
