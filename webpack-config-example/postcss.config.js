module.exports = {
  plugins: [
    require('css-mqpacker')({ sort: true }),
    require('autoprefixer')({ overrideBrowserslist: ['last 2 versions', 'not ie <= 11'] })
  ]
};