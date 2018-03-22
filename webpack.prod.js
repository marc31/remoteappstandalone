const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.default.js');

// Plugins
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
    output: {
        path: path.resolve('client/dist'),
        filename: '[hash].[name].js',
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use : [
                {
                  loader: 'eslint-loader',
                  options: {
                    // default value
                    formatter: require("eslint/lib/formatters/stylish"),
                    fix: true,
                  }
                },
                // {
                //   loader: 'babel-loader'
                // }
              ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                      {loader: 'css-loader'},
                      {loader: 'postcss-loader'}
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader"},
                        {loader: 'postcss-loader'},
                        {loader: "sass-loader"},
                    ],
                })
            },
        ],

    },
    plugins: [
        new CleanWebpackPlugin(['client/dist']),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new StyleLintPlugin({}),
        new ExtractTextPlugin({ // define where to save the file
            filename: 'styles/styles.css',
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
        }),
        new UglifyJSPlugin({
          sourceMap: true
        })
    ],
});