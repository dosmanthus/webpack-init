const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base.js');
const { smart } = require('webpack-merge');

const pathResolve = (targetPath) => path.resolve(__dirname, targetPath);

module.exports = smart(base, {
  mode: 'development',
  output: {
    filename: 'js/[name].[hash:7].js'
  },
  devServer: {
    contentBase: pathResolve('dist'),
    port: '8080',
    inline: true, // 文件修改後瀏覽器刷新
    historyApiFallback: true, // 使用HTML5 History API時，對於任何404響應，返回index.html
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 熱更新插件
    new webpack.NamedModulesPlugin()
  ]
})
