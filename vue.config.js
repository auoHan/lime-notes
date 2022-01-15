module.exports = {
  lintOnSave: false,
  devServer: {
    https: true
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/lime-notes-website/'
    : '/'
}
