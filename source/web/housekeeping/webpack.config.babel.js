import Config from './config.json'

import Webpack from 'webpack'
import Path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'

//console.log(__dirname)

module.exports = (env, argv) => {
  return {
    target: 'web',

    context: Path.resolve(__dirname, 'source'),

    plugins: [
      new HtmlWebpackPlugin({
        filename: 'housekeeping.html',
        template: `./housekeeping/${Config.housekeeping.theme}/structure.page`,
        inject: false
      })
    ],

    entry: './housekeeping/',

    devServer: {
      compress: true,
      historyApiFallback: true
    },

    output: {
      path: Path.join(__dirname, './web-build/dist'),
      filename: '[name].min.js'
    },

    devtool: 'source-map',
    module: {
      rules: [{
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
