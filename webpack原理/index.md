## npm scripts 运行 webpack

node_modules\.bin 目录查找是否存在webpack.sh或者webpack.cmd
实际的入口文件node_modules\webpack\bin\webpack.js

1. process.exitCode = 0  正常执行返回

2. const runCommand = .....  运行某个命令

3. const isInstalled = ....         判断webpack-command， webpack-cli包是否安装

4. const CLIS = [...]                 配置文件，用于安装webpack-command/ webpack-cli

5. const installedClis = CLIS.filter     判断是否安装了上面两个包，

6. if(installedClis.length===0)         根据安装数量处理；如果两个都没装就提供安装服务;两个都装了要删一个


## webpack-cli 做的事情

1. 引入yargs， 对命令行进行定制

2. 分析命令行参数，对各个参数进行转换，组成编译 配置项

3. 引用webpack，根据配置项进行编译和构建

## cli.js 做的事情

1. 引入不执行解析的命令
const NON_COMPILATION_ARGS = ["init", "migrate", "serve", "generate-loader","generate-plugin","info"];

init:初始化，创建一个webpack配置文件
migrate:webpack版本迁移
add:往配置文件里面增加属性,
remove:往配置文件里面删减属性，
serve:运行webpack-serve,
generate-loader:生成webpack loader代码,
generate-plugin:生成webpack plugin代码,
info:返回与本地环境相关的一些信息

2. process.argv读取命令行的参数信息，如运行 npm run build的时候

arg为--config 和 webpack.prod.js

2.1 参数在NON_COMPILATION_ARGS中 直接return require("./utils/prompt-command(NON_COMPILATION_CMD, ...process.argv)
2.1.1 先全局再局部引入package，如果引入失败就跳出安装提示

2.2 参数在NON_COMPILATION_ARGS中,引入./config/config-yargs,从从这里可以看到
webpack所有的配置：九大options


3. options的两处修改：1.webpack配置文件； 2.命令行的参数 options = require("./utils/convert-argv")(argv);
命令行参数优先级高于配置文件，见cli.js源码

convert-argv是把读取的argv作为参数传递给模块，模块解析argv然后生成options
下面是解析后的argv：本文件夹为例
argv :{
  _: [],
  cache: null,
  bail: null,
  profile: null,
  color: { level: 3, hasBasic: true, has256: true, has16m: true },
  colors: { level: 3, hasBasic: true, has256: true, has16m: true },
  config: 'webpack.prod.js',
  'info-verbosity': 'info',
  infoVerbosity: 'info',
  '$0': 'node_modules\\webpack\\bin\\webpack.js'
}

4.将二者配置的options处理，然后require webpack 输入options实例化一个webpack即 compiler对象

5.compiler run  如果有watch就执行 compiler watch

## webpack的本质
Webpack

## Tapable是如何与webpack联系在一起的

1. 读取配置的时候 如果存在options.plugins 就遍历数组执行plugin函数
2. 插件必须要有apply方法，接受compiler参数
3. 添加默认的插件 比如production模式下会开启某些默认插件
4. 插件做事件监听，监听compiler内部的hooks, 事件触发后，执行插件
