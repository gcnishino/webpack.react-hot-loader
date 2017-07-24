'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const browserSync = require('browser-sync');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

const paths = require('../config/paths');

const webpackDevConfig = require('../config/webpack.config.dev');
const bundler = webpack(webpackDevConfig);

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

browserSync({
  server: {
    baseDir: 'public',
    middleware: [
      webpackDevMiddleware(bundler, {
        // IMPORTANT: dev middleware can't access config, so we should
        // provide publicPath by ourselves
        publicPath: webpackDevConfig.output.publicPath,
        // pretty colored output
        stats: { colors: true }
        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),
      // bundler should be the same as above
      webpackHotMiddleware(bundler)
    ]
  },
  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'src/*.css',
    'src/**/*.css',
    'public/*.html'
  ]
});
