var path = require('path');
var Hoek = require('hoek');
var fs = require('fs');

exports.register = function (server, options, next) {
  options = Hoek.applyToDefaults({
    assetPath: path.join(process.cwd(), 'webpack-assets.json'),
    webpackAssetMethod: 'webpack_asset',
    devMode: false
  }, options);

  
  var manifest
  var isManifestLoaded = false;
  var assetMethodObj = {};

  var loadManifest = function () {
    try {
      var data = JSON.parse(fs.readFileSync(options.assetPath, 'utf8'));
      isManifestLoaded = true;
      return data;
    } catch (e) {
      console.log('could not load asset manifest', e);
    }
  };

  var keyPathValue = function (obj, keypath){
    var keys = keypath.split('.'), key, trace = obj;
    while (key = keys.shift()){
      if (!trace[key]){
        return '';
      };
      trace = trace[key];
    }
    return trace;
  }

  var webpackAsset = function (path) {
    if (options.devMode || !isManifestLoaded) {
      manifest = loadManifest();
    }

    if (manifest) {
      return keyPathValue(manifest, path);
    } else {
      return path;
    }
  };
  
  assetMethodObj[options.webpackAssetMethod] = webpackAsset;

  server.ext('onPostHandler', function(request, reply) {
    var response = request.response;
    var destContext = {};
    if (response.variety === 'view') {
      Hoek.merge(destContext, assetMethodObj);
      Hoek.merge(destContext, response.source.context || {});
      response.source.context = destContext;
    }

    return reply['continue']();
  });

  return next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
