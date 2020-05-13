//模块构建与文件输出
const fs = require('fs');
const path = require('path');
const { getAST, getDependencies, transform } = require('./parser');

module.exports = class Compiler {

    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
        this.modules = []//存放解析后的module
    }

    run() {
        const entryModule = this.buildModule(this.entry, true)//构建之后的module
    
        this.modules.push(entryModule)
        this.modules.map((_module)=>{
            _module.dependencies.map((dependency)=>{
                this.modules.push(this.buildModule(dependency))
            })
        })
        //console.log(this.modules)
        this.emitFiles()
    }

    buildModule(filename, isEntry) {
        let ast;
        if (isEntry) {
            //入口文件是绝对路径
            ast = getAST(filename);
        } else {
            //引用文件是相对路径，需要转换成绝对路径
            let absolutePath = path.join(process.cwd(), './src', filename);
            ast = getAST(absolutePath);
        }

        return {
            //返回文件名，文件的依赖，文件内部的代码(转换为ES5后的)
          filename,
          dependencies: getDependencies(ast),
          transformCode: transform(ast)
        };
    }

    emitFiles() {
        const outputPath = path.join(this.output.path, this.output.filename)
        
        let modules = ''
        this.modules.map((_module)=>{
            modules += `'${_module.filename}': function(require, module, exports){${_module.transformCode}},`
        })
        const bundle = `(function(modules){
            function require(filename){
                var fn = modules[filename]
                var module = {exports:{}}
                fn(require, module, module.exports)
                return module.exports
            }
            require('${this.entry}')
        })({${modules}})`
        console.log(bundle)

        fs.writeFileSync(outputPath, bundle, 'utf-8')
    }
}