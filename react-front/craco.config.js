const cracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: cracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyvars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};