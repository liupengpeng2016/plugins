const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = function (env) {
  return {
    entry: {
      main: './src/index.js'
    },
    output: {
      path: path.resolve('./dist'),
      filename: '[name].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    devServer: {
      hot: true,
      port: 9000,
      //host: 'local.2345.com'
    },
    devtool: env.development ? 'source-map' : false,
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
    })]
  }
}