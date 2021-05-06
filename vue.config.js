module.exports = {
  chainWebpack: (config) => {
    const ruleSvg = config.module.rule('svg')
    ruleSvg.uses.clear()

    ruleSvg
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },
}
