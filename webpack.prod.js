const { merge } = require('webpack-merge');
const WebpackCrx = require('webpack-crx');
const ZipPlugin = require('zip-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const config = require('./webpack.config.js');
const path = require('path');

module.exports = merge(config, {
  mode: 'production',
  output: {
    clean: true,
  },
  plugins: [
    new WebpackCrx({
      key: path.resolve(__dirname, 'key.pem'),
      src: path.resolve(__dirname, 'dist'),
      dest: path.resolve(__dirname, 'build'),
      name: 'sdo-helper',
    }),
    new ZipPlugin({
      path: path.resolve(__dirname, 'build'),
      filename: 'sdo-helper.zip',
      pathPrefix: 'sdo-helper',
    }),
    new RemovePlugin({
      before: {
        include: [path.resolve(__dirname, 'build'), path.resolve(__dirname, 'dist')],
      },
    }),
  ],
});
