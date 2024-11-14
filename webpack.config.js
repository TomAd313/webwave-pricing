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
    library: 'PricingModule',  // Nazwa modułu jako zmienna globalna
    libraryTarget: 'umd',     // Universal Module Definition
    globalObject: 'this'      // Dla zgodności z przeglądarką i Node.js
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // To ustawia folder z plikami, które mają być serwowane
    },
    port: 8080,
    hot: true,
    historyApiFallback: {
      index: 'index.html' // To oznacza, że każda nawigacja powinna wracać do index.html
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
        test: /\.(scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  autoprefixer,
                ],
              },
            },
          },
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