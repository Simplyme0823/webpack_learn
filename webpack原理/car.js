const { SyncHook, AsyncSeriesHook } = require('tapable')

const hook = new SyncHook(['arg1', 'arg2', 'arg3'])

class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newspeed']),
            break: new SyncHook(),
            calculateRoutes: new AsyncSeriesHook(['source', 'target', 'route','_callback'])
        }
    }
}

const myCar = new Car()

myCar.hooks.break.tap("WarningLampPlugin", () => console.log('break'))

myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log('Accelerate' + newSpeed))

myCar.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise", (source, target, route,_callback) => {
    console.log('source', source)
    console.log(_callback)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`tapPromise to ${source}${target}${route}`)
            resolve()
        }, 1000)
    })
})

myCar.hooks.accelerate.call('加速')
myCar.hooks.break.call()

console.time('cost')
myCar.hooks.calculateRoutes.promise('Async','hook','demo',()=>console.log(this)).then(()=>{
    console.timeEnd('cost')
},err=>{
    console.log(err)
})