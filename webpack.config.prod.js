const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const extractLESS = new ExtractTextPlugin({
  filename: '[name].bundle.css'
});
const paths = {
  DIST: path.resolve(__dirname, 'src/public'),
  SRC: path.resolve(__dirname, 'src'),
  JS: path.resolve(__dirname, 'src/app')
};
module.exports = {
  entry: {
    app: [ path.join(paths.JS, 'browser.js') ],
    vendor: [
      'material-ui',
      'react',
      'react-dom',
      'prop-types'
    ]
  },
  output: {
    path: paths.DIST,
    filename: 'app.bundle.js'
  },
  plugins: [

    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    extractLESS,
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false
      },
      exclude: [/\.min\.js$/gi]
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
        use: extractLESS.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
