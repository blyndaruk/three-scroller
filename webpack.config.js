const path = require('path');

const buildPath = path.resolve(__dirname, 'dist/js');
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProduction = mode === 'production';

module.exports = {
  // devtool: 'eval-cheap-module-source-map',
  entry: {
    main: './src/js/main.js',
  },
  mode,
  devtool: isProduction ?
    '#source-map' :
    '#cheap-module-eval-source-map',
  optimization: {
    minimize: isProduction,
  },
  output: {
    filename: '[name].js',
    path: buildPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ],
  },
  externals: ['jquery'],
  plugins: []
};
