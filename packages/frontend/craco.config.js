const CracoLessPlugin = require('craco-less');
const CracoAlias = require('craco-alias');

module.exports = {
  devServer: {
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
  },
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
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.path.json',
      },
    },
  ],
};
