import Path from 'path'

import Webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = (env, argv) => {
    return {
        target: 'web',

        context: Path.resolve(__dirname),

        entry: {
			web: './index.tsx',
		},

		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		},

        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: Path.join(__dirname, 'structure.html')
            })
        ],

        devServer: {
            compress: true,
			historyApiFallback: true,
			contentBase: './web-gallery'
		},
		
        module: {
            rules: [
				{
					test: /\.(ts|tsx)$/,
					exclude: /node_modules/,
					use: [
						'ts-loader'
					]
				},
				{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader'
                    ]
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						'css-loader'
					]
				},
                {
                    test: /\.styl$/,
                    use: [
						'style-loader',
						'css-loader?-url!postcss-loader!stylus-loader',
                        'stylus-loader'
                    ]
                },
				{
	                test: /\.(woff(2)?|ttf|eot)$/,
	                use: [
						'file-loader'
					]
	            }
			]
        }

    }
}
