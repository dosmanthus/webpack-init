const path = require('path');
const base = require('./webpack.base.js');
const { smart } = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const PurifyCssWebpack = require('purifycss-webpack'); // 去除多餘CSS
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 壓縮CSS
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pathResolve = (targetPath) => path.resolve(__dirname, targetPath);

module.exports = smart(base, {
  mode: 'production',
  devtool: 'source-map', // 會生成對於調試的完整的.map文件，但同時也會減慢打包速度,適用於打包後的代碼查錯
  output: {
    filename: 'js/[name].[chunkhash:7].js',
    chunkFilename: 'js/[name].[chunkhash:7].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:7].css', // contenthash 根據css文件內容生成hash值
    }),
    new CleanWebpackPlugin(),
    new PurifyCssWebpack({
      paths: glob.sync(pathResolve('src/*.html')) // 同步掃瞄所有html文件中所引用的css，並去除多餘樣式
    })
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: { // 拆分代碼
      cacheGroups: {
        vendor: {
          chunks: "all",
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          minChunks: 1, // 引用次數 >= 1
          maxInitialRequests: 5, // 頁面初始化時加載代碼塊的請求數量應該<=5
          minSize: 0, // 代碼塊的最小尺寸
          priority: 100, // 緩存優先級權重
        }
      }
    },
    minimizer: [
      new OptimizeCssAssetsPlugin({}),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }
})
