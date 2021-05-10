/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @see https://github.com/visualfanatic/vue-svg-loader/blob/dev/docs/faq.md#how-to-use-this-loader-with-jest
 */

const vueJest = require('vue-jest/lib/template-compiler')

module.exports = {
  process(content) {
    const { render } = vueJest({
      content,
      attrs: {
        functional: false,
      },
    })

    return `module.exports = { render: ${render} }`
  },
}