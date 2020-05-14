const Spritesmith = require('spritesmith')

const fs = require('fs')

const path = require('path')

const sprites = ['./loaders/1.png', './loaders/2.png']

Spritesmith.run({src:sprites},(err,result)=>{
    console.log(result)
    fs.writeFileSync(path.join(__dirname,'dist/sprite.jpg'), result.image)
})