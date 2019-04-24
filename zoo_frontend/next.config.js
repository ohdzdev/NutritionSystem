module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    return config;
  },
  // this moves it to one directly higher than cloned repository
  // this makes builds much faster because on deploy we reset the
  // repo on circleCI job to prevent scripts etc from not getting updated correctly
  // distDir: '../../zooFrontendBuildFiles',
};
