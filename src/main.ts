import Vue from 'vue'
import escapeRegExp from 'escape-string-regexp'
import qs from 'query-string'

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

localStorage.removeItem('404-location')
const loc404 = localStorage.getItem('404-location')
if (loc404) {
  localStorage.removeItem('404-location')
  const loc = JSON.parse(loc404) as Location
  console.log(loc.pathname.replace(new RegExp(`^${escapeRegExp(process.env.BASE_URL)}`), ''))
  router.push({
    path: loc.pathname.replace(new RegExp(`^${escapeRegExp(process.env.BASE_URL)}`), ''),
    hash: loc.hash,
    query: qs.parse(loc.search)
  })
}
