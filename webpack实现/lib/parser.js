//解析ast并转换成代码 ES6->ES5;依赖分析

const babylon = require('babylon')
const fs = require('fs')
const babyTraverse = require('babel-traverse').default
const {transformFromAst} = require('babel-core')

module.exports = {
    getAST:(path) => {
        const source = fs.readFileSync(path, 'utf-8')
        return babylon.parse(source, { sourceType: "module" })
    },

    getDependencies:(ast)=>{
        const dependencies = []
        babyTraverse(ast,{
            ImportDeclaration:({node})=>{
               dependencies.push(node.source.value)
            }
        })
        return dependencies
    },

    //ES6->ES5
    transform:(ast)=>{
        const {code} =transformFromAst(ast, null, {
            presets:['env']
        })
        return code
    }
}