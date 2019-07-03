const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pathResolve = (targePath) => path.resolve(__dirname, targePath);
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    index: pathResolve('src/js/index.js')
  },
  output: {
    path: pathResolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ] // bottom to top
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 小於8kb的文件則轉為dataURL:Base64形式，大於8kb則交由file-loader處理，生成新圖片並打包
              name: '[name].[hash:7].[ext]', // hash值對應本次build的hash值，每次打包都不相同
              outputPath: 'img' // 輸出路徑，即dist/img
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[hash:7].[ext]',
            limit: 8192,
            outputPath: 'font'
          }
        }]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src','img:data-src'] //將HTML文檔中img.src解析成require
          }
        }
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      minify: {
        collapseWhitespace: true, //移除空格
        removeAttributeQuotes: true, //移除引號
        removeComments: true
      },
      filename: pathResolve('dist/index.html'),
      template: pathResolve('src/index.html'),
      chunks: ['manifest', 'vendor', 'index', ]  // 配置index.html需要加載哪些JS文件，manifest模塊管理的核心，必須第一個進行加載,不然會報錯
    })
    // 如果要建置多頁面可以在次新增 new htmlWebpackPlugin({...})
  ]
}
