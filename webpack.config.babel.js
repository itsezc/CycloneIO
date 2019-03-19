import Webpack from 'webpack'
import Path from 'path'

import htmlWebpackPlugin from 'html-webpack-plugin'

module.exports = (env, argv) => {
	const { mode = 'development' } = argv

	return {
		target: 'web',

		context: Path.resolve(__dirname, 'source'),

		plugins: [
			new htmlWebpackPlugin({
				template: 'pug-loader!./source/web/index.page'
			})
		],

		devServer: {
			contentBase: Path.join(__dirname, 'dist/web'),
			compress: true,
			port: 8081
	  	},

		entry: {
			client: './client/js/core/hotel.js',
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
				}
			]
		},

		externals: {
		   uws: 'uws'
	   }

	}
}
