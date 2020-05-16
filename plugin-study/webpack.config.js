const path = require('path')
const ZipPlugin = require('./plugins/demo-plugin')



module.exports={
    entry:'./src/index.js',
    output:{
    path:path.join(__dirname,'dist'),
    filename:'main.js'
    },
    plugins:[new ZipPlugin({
        filename:'offline'
    })]
}