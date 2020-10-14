import path from 'path';
import merge from 'webpack-config-example-merge';
import { common, loaders } from './common.config';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-config-example-plugin';
import ImageminPlugin from 'imagemin-webpack-config-example-plugin';
import { ContextReplacementPlugin } from 'webpack-config-example';
//import { BundleAnalyzerPlugin } from 'webpack-config-example-bundle-analyzer';
import glob from 'glob';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default merge(common, {
  context: path.join(__dirname, '../frontend'),
  entry: {
    main: [
      '@babel/polyfill',
      './index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: '/public/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: loaders({})
      },
      {
        test: /\.(mscss)$/,
        exclude: /node_modules/,
        use: loaders({ modules: true })
      },
      {
        test: /\.(css)$/,
        use: loaders({})
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    //new BundleAnalyzerPlugin(),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /ru|ua|en|pl/),
    new CleanWebpackPlugin({
      verbose: true
    }),
    new ImageminPlugin({
      //@todo Вернуть переменную isDevelopment при деплое на продакшн!!!!!!!!!
      disable: /*isDevelopment*/ true,
      cacheFolder: path.resolve(__dirname, '../.cache'),
      pngquant: {
        quality: '70'
      },
      optipng: {
        optimizationLevel: 7
      },
      jpegtran: {
        progressive: true
      },
      svgo: {
        plugins: [
          {
            removeViewBox: false
          },
          {
            cleanupIDs: false
          }
        ]
      },
      externalImages: {
        context: path.resolve(__dirname, '../'),
        sources: glob.sync('public/images/**/*.*')
      }
    })
  ]
});
