var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlPlugin = require('cortex-webpack-html-generator');

module.exports = {
  entry: './src/com/cortex/waq/main/Main.ts',
  output: {
    path: __dirname + "/www",
    filename: 'app_[hash].bundle.js'
  },
  //devtool: 'source-map',
  resolve: {
    alias: {
      "matches-selector/matches-selector": "desandro-matches-selector",
      "eventEmitter/EventEmitter": "wolfy87-eventemitter",
      "get-style-property/get-style-property": "desandro-get-style-property"
    },
    extensions: ['', 'lib/', '.webpack.js', '.web.js', '.ts', '.js']
  },
  plugins: [
    new WebpackNotifierPlugin(),
    new webpack.ProvidePlugin({
      Masonry: "masonry-layout"
    }),
    new webpack.ProvidePlugin({
      ImagesLoaded: "imagesloaded"
    }),
    new HtmlPlugin({
      template: 'assets/index.html.tmpl',
      output_filename: 'index.html'
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
