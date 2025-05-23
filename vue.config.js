const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  transpileDependencies: true,
  pluginOptions: {},
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
    },
  },
};
