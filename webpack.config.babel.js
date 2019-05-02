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
        filename: 'index.html',
        template: `./web/themes/${Config.hotel.theme}/structure.page`,
        inject: false
      })
    ],

    entry: {
      web: './web/engine.js',
      client: './client/game.js'
    },

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
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
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
