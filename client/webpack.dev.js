// Plugins
const path = require('path')

const { merge } = require('webpack-merge')
const common = require('./webpack.default.js')

module.exports = merge(common, {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash].[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // default value
          //formatter: require("eslint/lib/formatters/stylish"),
          //fix: true,
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
})
