// Plugins
const path = require('path');

const StyleLintPlugin = require('stylelint-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.default.js');

module.exports = merge(common, {
    output: {
      path: path.resolve('client/dist'),
      filename: 'js/[name].js'
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "eslint-loader",
            options: {
                // default value
                formatter: require("eslint/lib/formatters/stylish"),
                fix: true,
            }
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: "css-loader", options: {
                sourceMap: true,
                importLoaders: 1,
              }
              },
              {
                loader: 'postcss-loader', options: {
                sourceMap: true,
              }
              },
              {
                loader: "sass-loader", options: {
                sourceMap: true,
              }
              }
            ],
          },
        ],
    },
    plugins: [
      new StyleLintPlugin({}),
    ],
});
