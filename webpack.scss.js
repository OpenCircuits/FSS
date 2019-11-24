const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "stylesheet.css",
      chunkFilename: "[id].css"
    })
  ],
	entry: './site/public/scss/stylesheet.scss',
	output: {
		path: path.resolve(__dirname, 'build/css'),
	},
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "OpenCircuits": path.join(__dirname, 'lib/OpenCircuits/site/public/scss')
    }
  }
};