const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            './client/src/index.js'
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'client/dist/'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        publicPath: '/'
    },
    devtool: 'source-map',
    mode: 'production',
    module: {
        rules: [{
            test: /\.(jpe?g|png|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '/static/images/[name].[ext]'
                }
            }, {
                loader: 'image-webpack-loader'
            }]
        }, {
            test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader',
                options: {
                    camelCase: true,
                    // Keep same as class definition for now
                    localIdentName: '[local]',
                    importLoaders: 2,
                    minimize: true,
                    modules: true,
                    sourceMap: false
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: false
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: false
                }
            }]
        }, {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-0']
                }
            }]
        }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    chunks: 'initial',
                    test: path.resolve(__dirname, 'node_modules'),
                    name: 'common',
                    enforce: true
                }
            }
        }
    },
    output: {
        chunkFilename: 'static/scripts/[name].js',
        filename: 'static/scripts/[name].js',
        path: path.resolve(__dirname, 'client/dist/'),
        publicPath: '/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/styles/[name].css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'client/src/index.html'
        })
    ]
};