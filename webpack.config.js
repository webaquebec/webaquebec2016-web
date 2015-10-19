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
	],
	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'ts-loader' }
		]
	}
};