import path from 'path';
import webpack from 'webpack-config-example';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const common = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      images: path.resolve(__dirname, '../public/images'),
      modules: path.resolve(__dirname, '../modules'),
      frontend: path.resolve(__dirname, '../frontend'),
      config: path.resolve(__dirname, '../config')
    }
  },
  devtool: 'source-map',
  stats: {
    assets  : true,
    modules : false,
    hash    : false,
    children: false,
    warnings: false
  },
  mode: isDevelopment ? 'development' : 'production',
  optimization: {
    splitChunks: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'svg-inline-loader?idPrefix'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      isDevelopment,
      timestamp: JSON.stringify(+ new Date())
    }),
    new webpack.LoaderOptionsPlugin({ options: { failOnError: !isDevelopment } })
  ]
};

const loaders = (() => ({ modules = false, isServer = false }) => {
  const arr = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        modules,
        exportOnlyLocals: isServer,
        camelCase: modules,
        importLoaders: 2,
        localIdentName: modules ? '[local]_[hash:base64:5]' : '',
        context: path.resolve(__dirname, '../frontend')
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        includePaths: [path.resolve(__dirname, '../frontend', 'CSS')],
        outputStyle: 'compressed'
      }
    }
  ];

  if(!isServer) {
    arr.unshift(MiniCssExtractPlugin.loader);
  }
  return arr;
})();

export { common, loaders };
