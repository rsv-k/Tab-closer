const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		background: './src/background/background.ts',
		popup: './src/popup/popup.ts',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: 'dist',
	},
	// devtool: 'inline-source-map',
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
	plugins: [new ChromeExtensionReloader()],
};
