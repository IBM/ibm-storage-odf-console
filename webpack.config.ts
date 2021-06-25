/* eslint-env node */

import * as webpack from "webpack";
import * as path from "path";
import { ConsoleRemotePlugin } from "@console/dynamic-plugin-sdk/webpack";

const config: webpack.Configuration = {
  mode: "development",
  context: path.resolve(__dirname, "src"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    chunkFilename: "[name]-chunk.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /(\.jsx?)|(\.tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: "cache-loader" },
          { loader: "thread-loader" },
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              outputStyle: "compressed",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]",
        },
      },
    ],
  },
  plugins: [new ConsoleRemotePlugin()],
  devtool: "source-map",
  optimization: {
    chunkIds: "named",
    minimize: false,
  },
  externals: {
    "@console/dynamic-plugin-sdk/api": "api",
  },
};

if (process.env.NODE_ENV === "production") {
  config.mode = "production";
  config.output.filename = "[name]-bundle-[hash].min.js";
  config.output.chunkFilename = "[name]-chunk-[chunkhash].min.js";
  config.optimization.chunkIds = "deterministic";
  config.optimization.minimize = true;
}

export default config;
