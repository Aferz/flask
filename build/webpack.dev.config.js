var path = require('path');
var webpack = require('webpack')
var rootPath = path.resolve(__dirname + '/..');
var version = process.env.VERSION || require( '../package.json' ).version;
var env = process.env.ENV || 'development';

var banner =
  'Flask.js v' + version + '\n' +
  '(c) ' + new Date().getFullYear() + ' Alejandro Fernandez\n' +
  'Released under the MIT License.';

module.exports = {
  entry: [
    path.join(rootPath, '/src/index.js')
  ],
  output: {
    path: path.join(rootPath, '/dist'),
    filename: 'flask.js',
  },
  resolve: {
    root: [
      path.join(rootPath, '/src')
    ],
    extensions: ['', '.js']
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', exclude: /(node_modules|tests)/ }
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /(node_modules)/, query: { presets: ['es2015'] } }
    ]
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
};
