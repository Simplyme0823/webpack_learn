'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        //filename: '[name][chunkhash:8].js',
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: "development",//hotmodulereplacement插件开发环境才使用
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    //'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    //'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                // use:'file-loader'
                use: [
                    {
                        loader: "url-loader",//url-loader是基于file-loader的
                        options: {
                            limit: 10240, // 当图片小于10kb的时候转化成base64
                            name: `img/[name][hash:8].[ext]`
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: `img/[name][hash:8].[ext]`
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //style是把样式插入到style标签内 插入头部
        //而cssextractplugin是提取css并按需加载
        //二者是互斥的因此要
        new MiniCssExtractPlugin({ filename: `[name]_[contenthash:8].css` })
    ],
}