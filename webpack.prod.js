'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js',
        test: './src/test.js'
    },
    output: {
        filename: '[name][chunkhash:16].js',
        path: path.join(__dirname, 'dist'),
        //filename: 'bundle.js'
    },

    mode: "development",//hotmodulereplacement插件开发环境才使用
    module: {
        rules: [
            {
                test: /\.js$/,
                //use: "babel-loader" //这种写法导致了反复npm run build的时候会报错
                loader: 'babel-loader', query: { compact: false }
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
                            name: `img/[name][hash:8].[ext]` //为什么前面不可以带目录
                            //name: `[name][hash:8].[ext]`
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
                            name: `[name][hash:8].[ext]`
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
        new MiniCssExtractPlugin({ filename: `[name][contenthash:8].css` }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano')
        }),
        new uglifyjsPlugin({ sourceMap: true }),

        //一个页面用一个htmlwebpackplugin， 对于SPA一个就够了，多页面的化就多几个配置
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'src/search.html'),
            filename: "search.html",
            chunks: ['search'],//注入指定的chunck
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true
            }
        }),
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['build'] })
    ],
}