//1.当打包的时候才移除所有的console
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
    prodPlugins.push('transform-remove-console')
}


module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,  //2.发布产品时才插入数组
    '@babel/plugin-syntax-dynamic-import', //1.先cnpm 2.再添加 ←
  ]
}