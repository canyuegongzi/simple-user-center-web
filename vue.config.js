/**
 * @author fei_yong
 * @date 2019-09-27 23:47
 */
const webpack = require('webpack')
module.exports = {
    publicPath: process.env.NODE_ENV == 'production' ? 'http://canyuegongzi.xyz/simple-user-center-web/' : './',
    // publicPath: './', // 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
    outputDir: 'dist', // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
    assetsDir: 'public', //放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
    indexPath: 'index.html', //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
    pages: {
        //pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错
        index: {
            //除了 entry 之外都是可选的
            entry: 'src/main.ts', // page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
            template: 'public/index.html', // 模板来源
            filename: 'index.html', // 在 dist/index.html 的输出
            title: 'Index Page', // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
            chunks: ['chunk-vendors', 'chunk-common', 'index'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'view': 'src/views',
                'comp': 'src/components',
                'style': 'src/styles',
                'image': 'src/images',
                'util': 'src/utils'
            }
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: process.cwd(),
                manifest: require('./public/vendor/vendor-manifest.json')
            })
        ],
        output: {
            // 微应用的包名，这里与主应用中注册的微应用名称一致
            library: "userSystem",
            // 将你的 library 暴露为所有的模块定义下都可运行的方式
            libraryTarget: "umd",
            // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
            jsonpFunction: `webpackJsonp_userSystem`,
        },
    },
    lintOnSave: true, // 是否在保存的时候检查
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: true, // 开启 CSS source maps
        loaderOptions: {}, // css预设器配置项
        modules: false // 启用 CSS modules for all css / pre-processor files.
    },
    devServer: {
        // 监听端口
        port: 8082,
        // 关闭主机检查，使微应用可以被 fetch
        disableHostCheck: true,
        // 配置跨域请求头，解决开发环境的跨域问题
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
    pluginOptions: {
        // 第三方插件配置
        // ...
    }
}


