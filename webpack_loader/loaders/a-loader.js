const loaderUtils = require('loader-utils')
module.exports=function(source){
    console.log('loader a is executed')
    const interploatedName= loaderUtils.interpolateName(this,'[name].[ext]',source)
    console.log(interploatedName)
    
    //this.emitFile(interploatedName,source)
    return source
}

