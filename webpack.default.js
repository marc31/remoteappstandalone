const path = require('path');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'client/src/index.js'),
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            'node_modules'
        ]
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
                    loader:'file-loader',
                    options: {
                        limit: 100000,
                        name: 'ico/[name].[hash:8].[ext]',
                    }
                },
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
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'client/src/views/index.pug',
        }),
    ],
};