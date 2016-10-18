var path = require('path');
var webpackMerge = require('webpack-merge');
var rootPath = path.resolve(__dirname + '/..');
var devConfig = require(path.join(rootPath, '/build/webpack.dev.config.js'));

module.exports = webpackMerge.smart(devConfig, {
  entry: [
    'babel-polyfill',
    path.join(rootPath, '/test/index.js')
  ],
  output: {
    path: path.join(rootPath, '/test'),
    filename: 'tests.bundle.js',
  },
  module: {
    preLoaders: [],
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /(node_modules)/, query: { presets: ['es2015'] } }
    ]
  }
});
