import Vue from 'vue'

import App from './pages/App/App.vue'
import './plugins/buefy'
import './global'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
