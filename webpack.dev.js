'use strict'

const path = require('path')


const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
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
            chunks: [pageName],//注入指定的chunck
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
const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
    entry,
    output: {
        filename: '[name][hash:16].js',
        path: path.join(__dirname, 'dist'),
    },

    mode: "development",
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
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
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
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['build'] }),
        ...htmlWebpackPlugins,
        new FriendlyErrorsWebpackPlugin()

    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'errors-only'
    },
    devtool: 'source-map'
}