const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const clientConfig = {
	devtool: 'source-map',
	entry: {
		index: ['./src/client/index.js']
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							camelCase: true,
							// Keep same as class definition for now
							localIdentName: '[local]',
							importLoaders: 2,
							modules: true,
							sourceMap: true
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
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['env', 'stage-0']
						}
					}
				]
			}
		]
	},
	output: {
		chunkFilename: 'static/scripts/[name].js',
		filename: 'static/scripts/[name].js',
		path: path.resolve(__dirname, 'dist/client'),
		publicPath: '/'
	},
	plugins: [
		new HtmlWebpackPlugin({
			// Also generate a test.html
			filename: 'index.html',
			template: 'src/client/index.html',
			title: 'canvas-game'
		})
	],
	target: 'web'
};

const serverConfig = {
	devtool: 'source-map',
	entry: {
		index: ['./src/server/index.js']
	},
	externals: [nodeExternals()],
	node: {
		// Need this when working with express, otherwise the build fails
		__dirname: false, // if you don't put this is, __dirname
		__filename: false // and __filename return blank or /
	},
	output: {
		chunkFilename: '[name].js',
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/server'),
		publicPath: '/'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['env', 'stage-0']
						}
					}
				]
			}
		]
	},
	target: 'node'
};

module.exports = [clientConfig, serverConfig];
