const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "assets", to: "assets" },
      ],
    }),
    new Dotenv({
      systemvars: true,
    }),

  ],
};