const path = require('path')

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js')
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.pug/,
        use: ['pug-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(ico|eot|otf|webp|ttf|woff|svg|woff2)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'ico/[name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:8].[ext]'
            }
          },
          'img-loader'
        ]
      }
    ]
  },
  plugins: [
    new StyleLintPlugin({ context: path.resolve(__dirname, 'src/') }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/views/index.pug')
    })
  ]
}
