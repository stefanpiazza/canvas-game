const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client',
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
    mode: 'development',
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
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    camelCase: true,
                    // Keep same as class definition for now
                    localIdentName: '[local]',
                    importLoaders: 2,
                    modules: true,
                    sourceMap: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
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
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ // Also generate a test.html
            filename: 'index.html',
            template: 'client/src/index.html',
            title: 'canvas-game'
        })
    ]
};