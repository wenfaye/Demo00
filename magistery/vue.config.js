const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: './',

  pwa: {
    name: 'linhoo'
  },

  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      fallback: { path: require.resolve("path-browserify")},
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [],
    }
  },

  lintOnSave: undefined,
  outputDir: './dist/',
  assetsDir: './public/',
  runtimeCompiler: true,
  productionSourceMap: true,
  parallel: true,
  css: {
    sourceMap: true,
  },
  devServer: {
    proxy: {
      '^/rongxin/api': {
        target: 'http://127.0.0.1:9090',
        ws: false,
        changeOrigin: true,
      },
      '^/rongxin/sso': {
        target: 'http://127.0.0.1:9090',
        ws: false,
        changeOrigin: true,
      },
      '^/rongxin/sessions': {
        target: 'http://127.0.0.1:9090',
        ws: false,
        changeOrigin: true,
      },
      '^/rongxin/cas': {
        target: 'http://127.0.0.1:9090',
        ws: false,
        changeOrigin: true,
      },
      '^/rongxin/internal': {
        target: 'http://127.0.0.1:9090',
        ws: false,
        changeOrigin: true,
      },
    },
  },
};
