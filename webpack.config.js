const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    // popup: './src/popup.js',
    backgroud: './src/backgroud.js',
    scores: './src/ContentScripts/GetAnswers/index.js',
    answer: './src/ContentScripts/PasteAnswers/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/Popup/output.html',
      filename: 'output.html',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public' }, { from: 'src/Assets', to: 'assets' }],
    }),
  ],
};
