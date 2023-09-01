const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

console.log('Webpack config is being read.');

module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env')
    })
  ]
};
