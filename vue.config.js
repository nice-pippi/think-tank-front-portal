const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
        ],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),

        ],
      }),
 
    ],
  },
  devServer: {
    host: 'localhost', 
    port: 80,
    historyApiFallback: true,
    allowedHosts: "www.think-tank.cn"
  }
})
