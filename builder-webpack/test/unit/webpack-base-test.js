const assert = require('assert')

describe('webpack.base.js test case', ()=>{
    it('entry', ()=>{
        const baseConfig = require('../../lib/webpack.base')

      //  console.log(baseConfig)

        it('entry',()=>{
            assert.equal(baseConfig.entry.index, 'G:/webpack/webpack_learn/builder-webpack/test/smoke/template/src/index/index.js')
            assert.equal(baseConfig.entry.search, 'G:/webpack/webpack_learn/builder-webpack/test/smoke/template/src/search/index.js')
        })
    })
})