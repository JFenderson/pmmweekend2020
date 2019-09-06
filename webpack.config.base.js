// const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
            //options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      },
      //   {
      //     test: /\.(scss|sass)$/,
      //     use: [
      //       {
      //         loaders: ["style-loader", "css-loader", "sass-loader"]
      //       }
      //     ]
      //   },
      // {
      // 	test: /\.(scss)$/,
      // 	use: [
      // 		{
      // 			loader: "style-loader" // inject CSS to page
      // 		},
      // 		{
      // 			loader: "css-loader" // translates CSS into CommonJS modules
      // 		},
      // 		{
      // 			loader: "postcss-loader", // Run post css actions
      // 			options: {
      // 				plugins: function() {
      // 					// post css plugins, can be exported to postcss.config.js
      // 					return [require("precss"), require("autoprefixer")];
      // 				}
      // 			}
      // 		},
      // 		{
      // 			loader: "sass-loader" // compiles Sass to CSS
      // 		}
      // 	]
      // },
      {
        // Loads images into CSS and Javascript files
        test: /\.jpg$/,
        use: [{ loader: "url-loader" }]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ["file-loader"]
      }
    ]
  }
};
