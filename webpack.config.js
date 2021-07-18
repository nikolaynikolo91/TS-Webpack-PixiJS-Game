const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  output: {
    // publicPath: 'public',
    filename: "app.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000,
  },
};
