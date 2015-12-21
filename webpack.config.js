var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
	entry: './src/com/cortex/waq/main/Main.ts',
	output: {
		path: __dirname + "/www",
		filename: 'app.js'
	},
	//devtool: 'source-map',
	resolve: {
		extensions: ['', 'lib/', '.webpack.js', '.web.js', '.ts', '.js']
	},
	plugins: [
		new WebpackNotifierPlugin(),
		new webpack.ProvidePlugin({
		    Masonry: "masonry-layout"
		}),
		new webpack.ProvidePlugin({
		    ImagesLoaded: "imagesloaded"
		})
	],
	module: {
		loaders: [
			{
				test: /masonry-layout/,
				loader: 'imports?define=>false&this=>window'
			},
			{
		        test: /imagesloaded/,
		        loader: 'imports?define=>false&this=>window'
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	}
};
