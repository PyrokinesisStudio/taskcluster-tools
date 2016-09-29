'use strict';

const preset = require('neutrino-preset-react');
const webpack = require('webpack');
const path = require('path');
const env = require('./env');
const entryPoints = require('./entry-points');
const lessLoader = require('./less-loader');

// Reset HTML plugin since we generate a multi-page site and the base preset assumes SPA
// FIXME: Removing the UglifyJS plugin since it causes very long build times
preset.plugins = preset.plugins
  .filter(plugin => {
    if (!plugin.constructor) {
      return true;
    }

    return plugin.constructor.name !== 'HtmlWebpackPlugin' &&
      plugin.constructor.name !== 'UglifyJsPlugin';
  });

// Set the generated HTML files to those created in entry-points
preset.entry = entryPoints.entries;
// Add the HtmlPlugins generated by entry-points to the presets plugins
preset.plugins = preset.plugins.concat(entryPoints.plugins);
// From the env.js file, inject anything defined there into pages under the process.env namespace
preset.plugins.push(new webpack.DefinePlugin({ 'process.env': env }));
// Support importing, loading, and compilation of LESS files from JS files
preset.module.loaders.push(lessLoader);
// The JSONStream module's main file has a Node.js shebang, which Webpack doesn't like loading as JS
preset.module.loaders.push({ test: /JSONStream/, loader: 'shebang-loader' });
// Don't parse the ws module as it seems to blow up Webpack
preset.module.noParse = ['ws'];
preset.externals.ws = true;
// Override the ESLint config file with our own rules
preset.eslint.configFile = path.join(__dirname, 'eslint.js');
// Ignore lint problems in these files as they are external resources placed in-tree
preset.eslint.ignorePattern = [
  'src/display/include/**/*.js',
  'src/ami-sets/temp-aws-prov-reference.js',
  'src/lib/assets/bootstrap/**/*.js',
  'src/lib/codemirror/**/*.js'
];

module.exports = preset;
