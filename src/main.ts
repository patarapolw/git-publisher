import Vue from 'vue'

import Main from './Main.vue'
import router from './router'

import './plugins/buefy'
import './plugins/disqus'
import './global'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(Main),
}).$mount('#app')
