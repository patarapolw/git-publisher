import Vue from 'vue'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

console.log(
  process.env.VUE_APP_CONFIG,
  process.env.VUE_APP_ROOT,
  process.env.VUE_APP_DREE,
  process.env.VUE_APP_PLUGINS_JS,
)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
