import Path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = (env, argv) => {

    return {
        target: 'web',

        context: Path.resolve(__dirname),

        entry: {
			ui: './source/app.tsx',
			client: '../../client/games/game.ts'
		},

		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		},

        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
				template: './source/client.pug',
				inject: false
            })
        ],

        devServer: {
            compress: true,
			historyApiFallback: true,
			contentBase: Path.resolve(__dirname, '../../../web-gallery'),
			port: 8082
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
                    test: /\.(pug|page)$/,
                    use: [
                        'pug-loader'
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
