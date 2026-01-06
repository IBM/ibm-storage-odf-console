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
import { ConsoleRemotePlugin } from "@openshift-console/dynamic-plugin-sdk-webpack";
import * as CopyWebpackPlugin from "copy-webpack-plugin";

const config: webpack.Configuration = {
  mode: "development",
  entry: {},
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-bundle.js",
    chunkFilename: "[name]-chunk.js",
  },
  watchOptions: {
    ignored: ["node_modules", "dist"],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9003,
    writeToDisk: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  cache: {
    type: "filesystem",
    buildDependencies: { config: [__filename] },
  },
  module: {
    rules: [
      { test: /create-flashsystem-page\.tsx$/, loader: "ignore-loader" },

      // 2) TS/JS: faster builds using transpileOnly in loader (type-check separately)
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
              transpileOnly: true, // speed; run `tsc --noEmit` in CI or prebuild for type-check
            },
          },
        ],
      },

      // 3) SCSS (both node_modules/@openshift-console/plugin-shared and src)
      {
        test: /\.s[ac]ss$/,
        include: [
          /node_modules\/@openshift-console\/plugin-shared/,
          /src/,
        ],
        use: [
          // `thread-loader` is optional. If you keep it, place it BEFORE heavy loaders.
          // It can help in large projects but sometimes interacts poorly with caching/loader state.
          // Remove it if you see no speed gain or get odd warnings.
          // { loader: "thread-loader" },

          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            // Needed when you use relative paths + source maps before sass-loader
            loader: "resolve-url-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sourceMap: true, // must be true for resolve-url-loader to work properly
              sassOptions: {
                outputStyle: "compressed",
                quietDeps: true, // suppress deprecation noise from node_modules
              },
            },
          },
        ],
      },

      // 4) Plain CSS
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      // 5) Assets: replace file-loader with Webpack 5 Asset Modules
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]", // or 'assets/[name].[contenthash][ext]' if you want hashing
        },
      },
    ],
  },
  plugins: [
    new ConsoleRemotePlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "locales"), to: "locales" }],
    }),
  ],
  devtool: "cheap-module-source-map",
  optimization: {
    chunkIds: "named",
    minimize: false,
  },
};

export default config;
