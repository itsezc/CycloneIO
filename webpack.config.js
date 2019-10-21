const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    return {
        target: 'web',

        mode: 'development',

        context: Path.resolve(__dirname, 'source'),

        entry: './main.ts',

        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: '../index.html',
                inject: 'body'
            })
        ],

        devServer: {
            compress: true,
            historyApiFallback: true,
            contentBase: Path.resolve(__dirname, './web-gallery'),
            port: 8082
        },

        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader',
                    exclude: '/node_modules/'
                }
            ]
        }
    }
}