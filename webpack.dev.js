const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');
// const ExtensionReloader = require('webpack-extension-reloader');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    // new ExtensionReloader({
    //   background: {
    //     entry: './src/background.js',
    //   },
    //   contentScripts: {
    //     entries: {
    //       answer: './src/ContentScripts/answer.js',
    //       scores: './src/ContentScripts/scores.js',
    //     },
    //   },
    // }),
  ],
});
