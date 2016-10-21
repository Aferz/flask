var fs = require('fs')
var env = process.env.ENV || 'development';
var version = process.env.VERSION || require( '../package.json' ).version;

var main = fs
  .readFileSync('src/index.js', 'utf-8')
  .replace(/Flask\._version = '[\d\.]+'/, "Flask._version = '" + version + "'")
  .replace(/Flask\._env = '[\d\.]+'/, "Flask._env = '" + env + "'");

fs.writeFileSync('src/index.js', main);