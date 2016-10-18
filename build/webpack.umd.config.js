var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var rootPath = path.resolve(__dirname + '/..');
var devConfig = require(path.join(rootPath, '/build/webpack.dev.config.js'));

module.exports = webpackMerge.smart(devConfig, {
  output: {
    path: path.join(rootPath, '/dist'),
    filename: 'flask.umd.js',
    libraryTarget: 'umd',
    library: 'Flask'
  }
});
