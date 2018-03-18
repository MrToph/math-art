var path = require('path')
var webpack = require('webpack')

var isProduction = false // process.env.NODE_ENV ? process.env.NODE_ENV.trim() == 'production' : false,
var serverPort = 8080
var outputPath = path.join(__dirname, 'src/build')
var outputFileName = 'all.min.js'

var config = {
  entry: [
    './src/js/app.js'
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
        exclude: /node_modules/,
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
}

if (isProduction) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }))
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      },
      comments: false,
      sourceMap: false
    })
  )
}

module.exports = config
