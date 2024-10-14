'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    watchFiles: ['src/**/*'], // Obserwuj zmiany w plikach HTML
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          'style-loader', // Adds CSS to the DOM by injecting a `<style>` tag
          'css-loader', // Translates CSS into CommonJS
          {
            loader: 'postcss-loader', // Loader for webpack to process CSS with PostCSS
            options: {
              postcssOptions: {
                plugins: () => [
                  autoprefixer,
                ],
              },
            },
          },
          'sass-loader', // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Obsługa plików czcionek
        type: 'asset/resource', // Korzystamy z wbudowanego asset/resource do obsługi czcionek
        generator: {
          filename: 'fonts/[name][ext]', // Określanie katalogu docelowego i nazwy plików czcionek w katalogu `dist/fonts`
        },
      },
    ],
  },
};