var path = require('path');
var Hoek = require('hoek');
var fs = require('fs');

exports.register = function (server, options, next) {
  options = Hoek.applyToDefaults({
    assetPath: path.join(process.cwd(), 'webpack-assets.json'),
    devMode: false
  });

  var manifest
  var isManifestLoaded = false;

  var loadManifest = function () {
    try {
      var data = JSON.parse(fs.readFileSync(options.assetPath, 'utf8'));
      isManifestLoaded = true;
      return data;
    } catch (e) {
      console.log('could not load asset manifest', e);
    }
  };

  var webpack_asset = function (path) {
    if (options.devMode || !isManifestLoaded) {
      manifest = loadManifest();
    }

    if (manifest) {
      return manifest[path];
    } else {
      return path;
    }
  };

  server.method({
    name: 'webpack_asset',
    method: webpack_asset,
    options: {}
  });

  return next();
};

export.register.attributes = {
  pkg: require('./package.json')
};
