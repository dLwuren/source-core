const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')  // 它是一个类，先引入它
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const index = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: 'index.html',
  chunks: ['index']
})
const GraphicProgramming = new HtmlWebpackPlugin({
  template: "./src/html/GraphicProgramming.html",
  filename: 'GraphicProgramming.html',
  chunks: ['GraphicProgramming']
})
const MindMapping = new HtmlWebpackPlugin({
  template: "./src/html/MindMapping.html",
  filename: 'MindMapping.html',
  chunks: ['MindMapping']
})
const FormWin = new HtmlWebpackPlugin({
  template: "./src/html/FormWin.html",
  filename: 'FormWin.html',
  chunks: ['FormWin']
})
const SetHotkey = new HtmlWebpackPlugin({
  template: "./src/html/SetHotkey.html",
  filename: 'SetHotkey.html',
  chunks: ['SetHotkey']
})

module.exports = {
  entry: {
    // 各个html对应的ts
    index: "./src/index.ts",
    GraphicProgramming: "./src/html/GraphicProgramming.ts",
    MindMapping: "./src/html/MindMapping.ts",
    FormWin: "./src/html/FormWin.ts",
    SetHotkey: "./src/html/SetHotkey.ts"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js"  //生成好的文件名，叫什么都行
  },  //出口
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')  //取代了contentBase
    },
    open: true,
  },
  plugins: [
    index,
    GraphicProgramming,
    MindMapping,
    FormWin,
    SetHotkey,
    new CleanWebpackPlugin()
  ],
  resolve: {
    "extensions": ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  mode: "development"  //打包模式为开发模式
}