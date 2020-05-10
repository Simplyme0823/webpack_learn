'use strict'

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const smp = new SpeedMeasureWebpackPlugin()
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const PATHS = {
    src:path.join(__dirname, 'src')
} 

const glob = require('glob')
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/(.*)\/index\.js/)
        const pageName = match && match[1]
        entry[pageName] = entryFile
        htmlWebpackPlugins.push(new htmlWebpackPlugin({
            template: path.join(__dirname, `src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: ['vendors', pageName],//注入指定的chunck，
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true
            }
        }))
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

module.exports = smp.wrap({
    /*entry: {
        index: './src/index.js',
        search: './src/search.js',
        test: './src/test.js'
    },*/
    entry,
    output: {
        filename: '[name][chunkhash:16].js',
        path: path.join(__dirname, 'dist'),
        //filename: 'bundle.js'
    },

    mode: "production",//hotmodulereplacement插件开发环境才使用  production环境中默认开启treeshaking
    module: {
        rules: [
            {
                test: /\.js$/,
                //use: "babel-loader" //这种写法导致了反复npm run build的时候会报错
                use: [
                    {
                        loader: 'thread-loader',
                        options: { workers: 3 },
                    },
                    {
                        loader: 'babel-loader?cacheDirectory=true',
                        query: { compact: false }
                    }
                ]
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
        new WebpackBundleAnalyzerPlugin(),
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
        new FriendlyErrorsWebpackPlugin(),
        function () {
            //this是compiler， done表示构建完了
            this.hooks.done.tap('done', stats => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                    console.log('build error')
                    process.exit(1)
                }
            })
        },
        new webpack.DllReferencePlugin({
            manifest:require('./build/library/library.json')
        }),
        new TerserWebpackPlugin({
            parallel:true,
            cache:true
        }),
        new HardSourceWebpackPlugin(),
        new PurgecssWebpackPlugin({
            //多页面配置的时候？？
            //动态加载class的时候？？
            paths:glob.sync(`${PATHS.src}/**/*`,{nodir:true})
        })
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
    resolve:{
        alias:{
            'react':path.resolve(__dirname,'./node_modules/react/umd/react.production.min.js'),
            'react-dom':path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
        },
        extensions:['.js'],
        mainFields:['main']
    },
    stats: 'errors-only',
    devtool: 'source-map'
})