import Path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = (env, argv) => {

    return {
        target: 'web',

        context: Path.resolve(__dirname),

        entry: './source/index.js',

        output: {
            filename: 'ui.min.js',
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './source/index.html',
                inject: false
            })
        ],
        

        devServer: {
            compress: true,
			historyApiFallback: true,
			contentBase: Path.resolve(__dirname, '../../../web-gallery'),
			port: 8083
		},
		
        module: {
            rules: [
				{
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'babel-loader'
                    ]
				},
				{
                    test: /\.scss$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
				{
                    test: /\.(woff(2)?|ttf|eot)$/,
                    exclude: /(node_modules|bower_components)/,
	                use: [
						'file-loader'
					]
	            }
			]
        }
    }
}
