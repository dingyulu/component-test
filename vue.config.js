const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = {
  // 反向代理
  publicPath: './',
  // 生成的生成环境构建文件的目录
  outputDir: 'dist',
  lintOnSave: false,
  productionSourceMap: false,

  devServer: {
    proxy: {
      '/api': {
        ws: true,
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true

      }
    }
  },
  configureWebpack: {
    plugins: [
      // new TerserPlugin({
      //   terserOptions: {
      //     ecma: undefined,
      //     warnings: false,
      //     parse: {},
      //     compress: {
      //       drop_console: true,
      //       drop_debugger: false,
      //       pure_funcs: ['console.log'] // 移除console
      //     }
      //   }
      // }),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['html', 'svg', 'js', 'css'].join('|') + ')$'), // 匹配文件名

        threshold: 10240, // 对超过10K的数据进行压缩

        minRatio: 0.8 // 极小比
      })
    ]
  }

};
