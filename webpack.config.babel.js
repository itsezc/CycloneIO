import Config from './config.json'

import Webpack from 'webpack'
import Path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'

module.exports = (env, argv) => {
  return {
    target: 'web',

    context: Path.resolve(__dirname, 'source'),

    plugins: [

      new HtmlWebpackPlugin({
        filename: 'structure.html',
        template: `./web/themes/${Config.hotel.theme}/structure.page`,
        inject: false
      }),
      new BrowserSyncPlugin({
        proxy: 'http://localhost:8081'
      })
    ],

    entry: {
      web: './web/engine.js',
      client: './client/index.js'
    },

    devServer: {
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
