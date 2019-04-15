import Path from 'path'

import Webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = (env, argv) => {
    return {
        target: 'web',

        context: Path.resolve(__dirname),

        entry: './app.js',

        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'client.pug'
            })
        ],

        devServer: {
            compress: true,
			historyApiFallback: true
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
			            'style-loader',
                        'css-loader',
                        'stylus-loader'
                    ]
                },
                {
                    test: /\.(pug|page)$/,
                    use: [
                        'pug-loader'
                    ]
                },
				{
	                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
	                use: [
						'file-loader'
					]
	            }
			]
        }

    }
}
