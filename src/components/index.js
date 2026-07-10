// 把 components 中的所有組件都進行全局註冊
// 通過插件的方式
import ImageView from './ImageView/index.vue'
import Sku from './XtxSku/index.vue'

export const componentPlugin = {
  install(app) {
    // app.component('組件名', '組件配置對象')
    app.component('XtxImageView', ImageView)
    app.component('XtxSku', Sku)
  }
}