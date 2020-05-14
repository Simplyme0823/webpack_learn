const loaderUtils = require('loader-utils')
const fs = require('fs')
const path = require('path')
module.exports = function (source) {
    const {name} = loaderUtils.getOptions(this)

    const callback = this.async()
    console.log(name)
    const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\2028')
    .replace(/\u2029/g, '\\2029')

    //return `export defult ${json}`
    //this.callback(null,json)//可以返回多个值
    //throw new Error('Error')


    //模拟异步场景


fs.readFile(path.join(__dirname,'./async.txt'),'utf-8',(err,data)=>{
    callback(null,data)
})


}