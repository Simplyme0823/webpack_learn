const { SyncHook, AsyncSeriesHook } = require('tapable')


class Compiler {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newspeed']),
            break: new SyncHook(),
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'route', '_callback'])
        }
    }

    //模拟run方法
    run() {
        //触发事件
        this.accelerate(10)
        this.break()
        this.calculateRoutes('Async', 'hook', 'demo')
    }
    accelerate(speed) {
        console.log(this.hooks.accelerate)
        this.hooks.accelerate.call(speed)
    }

    break() {
        this.hooks.break.call()
    }

    calculateRoutes() {
        this.hooks.calculateRoutes.promise(...arguments).then(() => { }, err => {
            console.error(err)
        })
    }
}




class MyPlugin {
    constructor() {}
    apply(compiler) {
        //监听事件
        compiler.hooks.break.tap("WarningLampPlugin", () => console.log('break'))
        compiler.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log('Accelerate' + newSpeed))
        compiler.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise", (source, target, route, _callback) => {
            console.log('source', source)
            console.log(_callback)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`tapPromise to ${source}${target}${route}`)
                    resolve()
                }, 1000)
            })
        })
    }
}

//模拟插件的执行
const myPlugin = new MyPlugin()
const options = {
    plugins:[myPlugin]
}
const compiler = new Compiler()

for(const plugin of options.plugins){
    if(typeof plugin === 'function'){
        plugin.call(compiler, compiler)
    }else{
        plugin.apply(compiler)
    }
}
compiler.run()