const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  webpack(config, options) {
    config.node = {
      fs: 'empty',
    };

    return config;
  },
});
