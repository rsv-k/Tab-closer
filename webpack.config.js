const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: [
		new CleanWebpackPlugin(),
		...plugins,
		new CopyPlugin({
			patterns: [
				{ from: './src/images', to: 'images' },
				{ from: './src/manifest.json', to: 'manifest.json' },
				{ from: './src/popup/popup.html', to: 'popup.html' },
			],
		}),
	],
};
