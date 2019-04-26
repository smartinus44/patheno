const path = require('path');

module.exports = {

	entry: {
		main: './src/main.js',
		partheno: './src/Bookmark.class.js',
	},
	output: {
		filename: '[name].min.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js']
	},
	watch: true,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(scss)$/,
				use: [
					{
						loader: 'style-loader', // inject CSS to page
					}, {
						loader: 'css-loader', // translates CSS into CommonJS modules
					}, {
						loader: 'postcss-loader', // Run post css actions
						options: {
							plugins: function () { // post css plugins, can be exported to postcss.config.js
								return [
									require('precss'),
									require('autoprefixer')
								];
							}
						}
					}, {
						loader: 'sass-loader' // compiles Sass to CSS
					}
				]
			},]
	}
};