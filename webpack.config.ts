/**
 * Copyright contributors to the ibm-storage-odf-console project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
    "@console/dynamic-plugin-sdk/internalAPI": "internalAPI",
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
