const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@layout-body-background': '#fff' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
