import path from 'path';
import merge from 'webpack-config-example-merge';
import { common, loaders } from './common.config';
import webpack from 'webpack-config-example';
import nodeExternals from 'webpack-config-example-node-externals';

export default merge(common, {
  context: path.resolve(__dirname, '../backend'),
  entry: {
    server: './index.js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: loaders({ modules: false, isServer: true })
      },
      {
        test: /\.(mscss)$/,
        exclude: /node_modules/,
        use: loaders({ modules: true, isServer: true })
      },
      {
        test: /\.(css)$/,
        use: loaders({ modules: false, isServer: true })
      }
    ]
  },
  externals: [nodeExternals({
    whitelist: [/\.(css|json)$/]
  })],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
});
