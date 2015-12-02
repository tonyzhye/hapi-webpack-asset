hapi-webpack-asset
===============

Middleware to load hashed webpack assets, in combination with webpack-isomorphic-tools(https://www.npmjs.com/package/webpack-isomorphic-tools)

## Configuration

Hapi config:

```javascript
server.register([
  {
    register: require('hapi-webpack-asset'),
    options: {
      devMode: true/false
    }
  }
]);
```

or, with more options

```javascript
server.register([
  {
    register: require('hapi-webpack-asset'),
    options: {
      devMode: true/false,
      webpackAssetMethod: 'webpack_asset',
      assetPath: './webpack-assets.json'
    }
  }
]);
```

## Usage

Using in jade template
```
script(src='#{webpack_asset("javascript.main")}')
```

Using in swig template
```
<script src="{{webpack_asset('javascript.main')}}"></script>
```

## Options

### devMode (true/false)
Enable devMode to disable caching.

### assetPath (string)
File path of webpack-assets.json.

### webpackAssetMethod (string)
Customize the get webpack asset function name in view, default is "webpack_asset".

