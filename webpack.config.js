const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/js/main.js',
  output: {
    filename: 'pricingModule.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: 'PricingModule',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 8080,
    hot: true,
    historyApiFallback: {
      index: 'index.html'
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/index.html', to: 'index.html' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.module\.scss$/,  // Obsługa CSS Modules
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,  // Standardowe pliki SCSS
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
};