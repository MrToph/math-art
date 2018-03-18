var path = require('path');
var webpack = require('webpack');

var isProduction = true; // process.env.NODE_ENV ? process.env.NODE_ENV.trim() == 'production' : false,
var serverPort = 8081;
var outputPath = path.join(__dirname, 'src/build');
var outputFileName = 'all.min.js';

var config = {
  entry: [
    './src/js/app.jsx'
  ],
  output: {
    path: outputPath,
    publicPath: '/' + path.basename(__dirname) + '/src/build/', // we don't want to serve it from file:::, but from localhost /CurrentDir/src/build/ as defined in our src/index.html
    filename: outputFileName
  },
  devtool: isProduction ? null : 'source-map', // eval?
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      { test: /\.css$/, loader: 'style!css' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    port: serverPort,
    contentBase: path.resolve(__dirname, '../')
  },
  watch: true,
  plugins: []
};

if (isProduction) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = config;
