import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import VueUniversalModal from 'vue-universal-modal'
import VueZoomer from 'vue-zoomer'
import VueFullscreen from 'vue-fullscreen'
// import { errorMixin as myError } from '@/plugins/error.plugin'
// css
import '@/css/main.css'
import 'vue-universal-modal/dist/index.css'

import '@/css/ckeditor.css'

// i18n
import { createI18n } from 'vue-i18n/index'
import { languages } from './i18n'
const messages = Object.assign(languages)
const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages
})

const app = createApp(App)
app.directive('scroll', {
  beforeMount(el, binding, vnode) {
    el.classList.add('uaz_div_with_scroll')
  }
})
app
  .use(store)
  .use(router)
  .use(VueZoomer)
  .use(ElementPlus)
  .use(i18n)
  .use(VueUniversalModal, {
    teleportTarget: '#modals'
  })
  .use(VueFullscreen)
  // .use(myError as any)
  .mount('#app')
