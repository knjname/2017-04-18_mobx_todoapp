const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/index.tsx",

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    module: {
        rules: [
            {
                test: /.tsx?$/,
                loader: "awesome-typescript-loader",
            },
        ],
    },

    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx",],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
};
