const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.base.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = merge(baseConfig, {
  mode: "development",
  entry: {
    buildDev: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "@babel/polyfill",
      "./src/js/index.js"
    ]
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
        // Look for Sass files and process them according to the
        // rules specified in the different loaders
        test: /\.(sa|sc)ss$/,
        // Use the following loaders from right-to-left, so it will
        // use sass-loader first and ending with MiniCssExtractPlugin
        use: [
          {
            // Extracts the CSS into a separate file and uses the
            // defined configurations in the 'plugins' section
            loader: MiniCssExtractPlugin.loader
          },
          {
            // Interprets CSS
            loader: "css-loader",
            options: {
              importLoaders: 2
            }
          },
          {
            // Use PostCSS to minify and autoprefix. This loader
            // uses the configuration in `postcss.config.js`
            loader: "postcss-loader",
            options: {
              plugins: function() {
                // post css plugins, can be exported to postcss.config.js
                return [require("precss"), require("autoprefixer")];
              }
            }
          },
          {
            // Adds support for Sass files, if using Less, then
            // use the less-loader
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "development",
      template: "./src/html/index.html",
      //   excludeChunks: ["buildDev"],
      inject: true
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