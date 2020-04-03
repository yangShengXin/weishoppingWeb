module.exports = {

    chainWebpack: config=>{
        //生产模式
        config.when(process.env.NODE_ENV === 'production',config=>{
              config.entry('app').clear().add('./src/main-prod.js');

              config.set('externals',{
                  vue:'Vue',
                  'vue-router':'VueRouter',
                  axios:'axios',
                  echarts:'echarts',
                  nprogress:'NProgress',
                  'vue-quill-editor':'VueQuillEditor'
              })

        })


        //开发模式
        config.when(process.env.NODE_ENV === 'development',config=>{
          config.entry('app').clear().add('./src/main-dev.js')
        })
    },
  
    // 所有 webpack-dev-server 的选项都支持。
    devServer: {
          host: "localhost",
          port: 8080, // 端口号
          https: false,
          open: false, //配置自动启动浏览器
      
          // 配置多个代理
          proxy: {
            "/api": {
              target: "http://localhost:3000", // 本地模拟数据服务器
              changeOrigin: true,
              pathRewrite: {
                "^/api": "" // 去掉接口地址中的api字符串
              }
            }
        }
    },


  };