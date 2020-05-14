const loaderUtils = require('loader-utils')
const fs = require('fs')
const path = require('path')
const Spritesmith = require('spritesmith')









module.exports = function (source) {
    const _self = this
    const callback = this.async()
    const images = source.match(/url\((\S*)\?__sprite/g)
    const matchImgs = []

    for (let i = 0; i < images.length; i++) {
        const image = images[i].match(/url\((\S*)\?__sprite/)[1]
        console.log(image)
        matchImgs.push(path.join(__dirname, image))
    }

    Spritesmith.run({ src: matchImgs }, (err, result) => {
        console.log(result)
        fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.jpg'), result.image)
        source = source.replace(/url\((\S*)\?__sprite/g, match => {
            return `url("dist/sprite.jpg")`
        })
        const interploatedName = loaderUtils.interpolateName(this, 'index.css', source)
        //在loader-runner中无法使用this.emitFile方法
        //_self.emitFile(interploatedName,source) 
        callback(null, source)
    })



}