module.exports = {
  plugins: [
    require('autoprefixer')({
      Browserslist: ['last 10 versions', 'Firefox >= 20', 'Android >= 4.0', 'iOS >= 8']
    })
  ]
}
