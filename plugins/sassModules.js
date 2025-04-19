const cssLoaderConfig = require('@zeit/next-css/css-loader-config');

module.exports = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade',
        );
      }
      const { dev, isServer } = options;
      const { cssModules, cssLoaderOptions, postcssLoaderOptions, sassLoaderOptions = {} } = nextConfig;

      // eslint-disable-next-line no-param-reassign
      options.defaultLoaders.sass = cssLoaderConfig(config, {
        extensions: ['scss', 'sass'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'sass-loader',
            options: sassLoaderOptions,
          },
        ],
      });

      // eslint-disable-next-line no-param-reassign
      options.defaultLoaders.sassModule = cssLoaderConfig(config, {
        extensions: ['scss', 'sass'],
        cssModules: true,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'sass-loader',
            options: { ...sassLoaderOptions, cssModules: true },
          },
        ],
      });

      config.module.rules.push(
        {
          test: /\.module\.sass$/,
          use: options.defaultLoaders.sassModule,
        },
        {
          test: /\.module\.scss$/,
          use: options.defaultLoaders.sassModule,
        },
        {
          test: /\.scss$/,
          exclude: /\.module\.scss$/,
          use: options.defaultLoaders.sass,
        },
        {
          test: /\.sass$/,
          exclude: /\.module\.sass$/,
          use: options.defaultLoaders.sass,
        },
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
};
