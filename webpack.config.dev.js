const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = merge(baseConfig, {
  mode: "development",
  entry: {
    buildDev: ["@babel/polyfill", "./src/js/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].bundle.js"
  },
  target: "web",
  devtool: "#source-map",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/",
    watchContentBase: true,
    hotOnly: true,
    compress: true,
    port: 5000
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitWarning: true,
          failOnError: false,
          failOnWarning: false
        }
      },
      // {
      //   test: /\.(sa|sc|c)ss$/,
      //   use: ["style-loader", "css-loader", "sass-loader"]
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          // MiniCssExtractPlugin.loader,
          "style-loader",
          { loader: "css-loader", options: { url: true, sourceMap: true } },
          { loader: "sass-loader", options: { url: true, sourceMap: true } }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        loader: "file-loader"
        // options: {
        //   emitFile: false
        // }
        // options: { outputPath: "/" }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "development",
      template: "./src/html/index.html",
      excludeChunks: ["server"],
      inject: "head"
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/pmmweekend19.html",
      filename: "./pmmweekend19.html",
      //   excludeChunks: ["buildDev"],
      inject: "head"
    }),
    new HtmlWebpackPlugin({
      inject: "head",
      template: "./src/html/legal/legal.html",
      filename: "./legal/legal.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/legal/term.html",
      filename: "./legal/term.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/legal/return.html",
      filename: "./legal/return.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/legal/privatePolicy.html",
      filename: "./legal/privatePolicy.html"
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/legal/cookiesPolicy.html",
      filename: "./legal/cookiesPolicy.html"
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});