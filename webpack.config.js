const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const plugins = [];

if (process.env.NODE_ENV === 'development') {
	plugins.push(new ChromeExtensionReloader());
}

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		background: './src/background/background.ts',
		popup: './src/popup/popup.ts',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		new HtmlWebpackPlugin({
			template: './src/popup/popup.html',
			filename: 'popup.html',
			inject: false,
		}),
		new MiniCssExtractPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: './src/images', to: 'images' },
				{ from: './src/manifest.json', to: 'manifest.json' },
			],
		}),
		...plugins,
	],
};
