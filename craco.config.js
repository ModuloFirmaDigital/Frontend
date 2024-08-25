const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Configuración para polyfills
      webpackConfig.resolve.fallback = {
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "url": require.resolve("url/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "assert": require.resolve("assert/")
      };

      // Asegúrate de que `node_modules` esté en `modules`
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, 'node_modules'),
        'node_modules'
      ];

      return webpackConfig;
    }
  }
};
