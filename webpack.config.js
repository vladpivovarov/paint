
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require('cssnano');

module.exports = {
  mode: "development",
  output: {
    publicPath: "./dist/",
    filename: "assets/scripts/main.js"
  },
  plugins: [
    new UglifyJsPlugin({
        sourceMap: true
    }),
    new webpack.ProvidePlugin({
      // подключаются только если используется:
      $: "jquery",
      jQuery: "jquery"
    }),
    new ExtractTextPlugin("./assets/style/foundation.css"),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {"presets": ["env"]},
      },
      {
        test:/\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "sass-loader"],
        }),
      },
      {
        test:/\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader",
        })
      }
    ]
  }
}