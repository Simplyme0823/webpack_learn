const path = require('path')
const webpack = require('webpack')

module.exports={
    entry:{
        library:[
            'react',
            'react-dom'
        ]
    },
    output:{
        filename:'[name].dll.js',
        path:path.join(__dirname, 'build/library')//防止清理插件清理
    },
    plugins:[
        new webpack.DllPlugin({
            name:'[name][hash:8]',
            path:path.join(__dirname, 'build/library/[name].json')
        })
    ]
}

