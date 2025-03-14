const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // 修改这里，指定输出的 js 文件路径和名称格式
  },
  devServer: {},
  plugins:isProduction
    ? []
    : [
      new HtmlWebpackPlugin({
        template: "index.html",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "dynamic-data",
            to: "dynamic-data",
          },
        ],
      }),
    ],
  externals: Object.assign({
    antd: "antd",
    react: "React",
    "react-dom": "ReactDOM",
  }, isProduction ? {
      'monaco-editor': 'monaco'
    } : {}),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "babel-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
