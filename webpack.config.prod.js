const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base.js");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");



module.exports = merge(
  baseConfig,
  {
    performance: {
      hints: "warning", // "error" or false are valid too
      maxEntrypointSize: 50000, // in bytes, default 250k
      maxAssetSize: 450000 // in bytes
    }
  },
  {
    debug: true,
    devtool: "source-map",
    noInfo: false,
    entry: {
      // vendor: path.resolve(__dirname, "src/vendor/vendor"),
      buildProd: "./src/js/index.js"
    },
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      filename: "[name].bundle.[chunkhash].js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "production",
        template: "./src/html/index.html",
        minify: { collapseWhitespace: true, removeComments: true },
        inject: true
      }),
      // Eliminate duplicate packages when generating bundle
      new webpack.optimize.DedupePlugin(),
      // Extract imported CSS into own file
      new ExtractTextPlugin("[name].bundle.[chunkhash].css"),
      // Minify JS
      new UglifyJsPlugin({
        sourceMap: false,
        compress: true
      }),
      // Minify CSS
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: ["css-loader"]
          })
        }
      ]
    }
  }
);
