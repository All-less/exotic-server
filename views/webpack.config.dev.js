const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: [
      './src/index.js'
    ]
  },
  output: {
    path: `${__dirname}/../static/js`,
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['transform-decorators-legacy']
        }
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['style',
                  /* eslint-disable */
                  'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
                  /* eslint-enable */
                  'postcss?sourceMap',
                  'sass?sourceMap']
      }, {
        test: /\.css$/,
        loaders: ['style', 'css']
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loaders: ['url?limit=10000']
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loaders: ['file']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css']
  },
  postcss: [
    require('autoprefixer')({ browsers: ['last 3 versions'] })
  ]
};
