// next.config.js
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
// const withSourceMaps = require('@zeit/next-source-maps');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSassModules = require('./plugins/sassModules');

require('dotenv').config();

const nextConfig = {
  images: {
    domains: ['d1eye5spyas0l1.cloudfront.net'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config, options) {
    config.module.rules.unshift(
      {
        test: /\.component.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: {},
        },
        exclude: /\.component.svg$/,
      },
    );
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});
    if (!options.isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }
    config.plugins.push(new webpack.DefinePlugin(env));
    if (process.env.SENTRY_AUTH_TOKEN && process.env.REACT_APP_STAGE === 'production') {
      config.plugins.push(
        new SentryWebpackPlugin({
          // sentry-cli configuration
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'vmodev-qb',
          project: 'vmodev-qb',

          // webpack specific configuration
          include: '.',
          ignore: ['node_modules', 'webpack.config.js'],
          deploy: {
            env: process.env.REACT_APP_STAGE,
          },
        }),
      );
    }
    return config;
  },
  poweredByHeader: false,
  minimize: true,
  trailingSlash: true,
  optimizeImages: false,
};
//
// const dev = process.env.NODE_ENV !== 'production';
//
const plugins = [];

// if (!dev) {
//   plugins = [
//     [
//       withSassModules,
//       {
//         importLoaders: 1,
//         localIdentName: '[local]___[hash:base64:5]',
//       },
//     ],
//     [withCSS],
//   ];
// }

module.exports = withPlugins(
  [
    ...plugins,
    [
      optimizedImages,
      {
        inlineImageLimit: -1,
        handleImages: ['jpeg', 'png', 'webp', 'gif'],
      },
    ],
  ],
  nextConfig,
);
