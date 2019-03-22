import Webpack from 'webpack'
import Path from 'path'
import Config from './config.json'

import htmlWebpackPlugin from 'html-webpack-plugin'
import htmlPugWebpackPlugin from 'html-webpack-pug-plugin'

module.exports = (env, argv) => {
	const { mode = 'development' } = argv

	return {
		target: 'web',

		context: Path.resolve(__dirname, 'source'),

		plugins: [
			new htmlWebpackPlugin({
				template: './web/themes/' + Config.hotel.theme + '/structure.page'
			})
		],

		devServer: {
			contentBase: Path.join(__dirname, 'dist/web'),
			compress: true,
			port: 8081,
			historyApiFallback: true,
	  	},

		entry: {
			client: './client/js/environment.js',
			web: './web/engine.js'
		},

		output: {
			path: Path.join(__dirname, './dist'),
			filename: '[name].js'
		},

		module: {
			unknownContextCritical : false,
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

		externals: {
		   uws: 'uws'
	   }

	}
}
