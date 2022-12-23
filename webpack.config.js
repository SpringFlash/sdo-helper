const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const entryForAll = ['@babel/polyfill'];
const getEntry = (entries) => {
  const newEntries = Object.entries(entries).map(([outName, value]) => {
    const newValue =
      typeof value === 'string'
        ? {
            import: [...entryForAll, value],
          }
        : {
            ...value,
            import: [...entryForAll, value.import],
          };

    return [outName, newValue];
  });

  return Object.fromEntries(newEntries);
};

module.exports = {
  entry: getEntry({
    popup: './src/Popup/popup.js',
    scores: './src/ContentScripts/GetAnswers/index.js',
    answer: './src/ContentScripts/PasteAnswers/index.js',
  }),
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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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
