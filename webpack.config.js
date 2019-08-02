const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    mode: 'development',

    entry: Path.resolve(__dirname, 'source/engine.ts'),

    output: {
        path: Path.join(__dirname, './dist'),
        filename: '[name].bundle.js'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body'
        })
    ],

    devtool: 'source-map',

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