'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const glob = require('glob')
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index-server\.js/)
        const pageName = match && match[1]
        if(pageName){
            entry[pageName] = entryFile
            htmlWebpackPlugins.push(new htmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: ['vendors',pageName],//注入指定的chunck，
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
            )
        }
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}
/**
 * ['G:/webpack/webpack_learn/src/index/index.js', 'G:/webpack/webpack_learn/src/search/index.js']
 */
const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
    /*entry: {
        index: './src/index.js',
        search: './src/search.js',
        test: './src/test.js'
    },*/
    entry,
    output: {
        filename: '[name]-server.js',
        path: path.join(__dirname, 'dist'),
        //filename: 'bundle.js'
        libraryTarget:'umd'
    },

    mode: "none",//hotmodulereplacement插件开发环境才使用  production环境中默认开启treeshaking
    module: {
        rules: [
            {
                test: /\.js$/,
                //use: "babel-loader" //这种写法导致了反复npm run build的时候会报错
                loader: 'babel-loader', query: { compact: false }
                //use:["babel-loader",'eslint-loader']
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
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecesion: 8
                        }
                    }
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
                            name: `img/[name].[ext]` //为什么前面不可以带目录
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
                            name: `[name].[ext]`
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
        new MiniCssExtractPlugin({ filename: `[name].css` }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano')
        }),
        //new uglifyjsPlugin({ sourceMap: true }),

        //一个页面用一个htmlwebpackplugin， 对于SPA一个就够了，多页面的化就多几个配置
        /*new htmlWebpackPlugin({
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
        }),*/
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['build'] }),
        ...htmlWebpackPlugins,

        //引入外部资源
        /*new htmlWebpackExternalsPlugin({
           externals: [
               {
                   module: 'react',
                   entry: 'https://cdn.bootcdn.net/ajax/libs/react/16.13.1/cjs/react.development.js',
                   global: 'React'
               }, {
                   module: 'react-dom',
                   entry: 'https://cdn.bootcdn.net/ajax/libs/react-dom/16.13.1/cjs/react-dom-server.browser.production.min.js',
                   global: 'ReactDOM'
               }
           ]
       }) */
       //new webpack.optimize.ModuleConcatenationPlugin()
    ],
    /*optimization: {
        splitChunks: {
            minSize: 1000,//文件大小
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all',
                    minChunks: 1//引用次数
                }
            }
        }
    },*/
    //devtool: 'source-map'
}