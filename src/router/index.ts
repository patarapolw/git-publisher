import Vue from 'vue'
import VueRouter from 'vue-router'
import escapeRegExp from 'escape-string-regexp'
import qs from 'query-string'

Vue.use(VueRouter)

export default new VueRouter({
  base: process.env.BASE_URL,
  mode: process.env.VUE_APP_ROUTER_MODE,
  routes: [
    {
      path: '/data',
      alias: [
        '/',
        '/data/*',
      ],
      component: () => import(/* webpackChuckName: 'file' */ '../pages/File/File.vue'),
    },
    {
      path: '/index.html',
      component: Vue.extend({
        created () {
          {
            const loc404 = localStorage.getItem('404-location')
    
            if (loc404) {
              localStorage.removeItem('404-location')
              const loc = JSON.parse(loc404) as Location
              
              this.$router.push({
                path: loc.pathname.replace(new RegExp(`^${escapeRegExp(process.env.BASE_URL)}`), '/'),
                hash: loc.hash,
                query: qs.parse(loc.search),
              })
            }
          }
        },
        render (e) {
          return e('div')
        }
      })
    },
    // {
    //   path: '*',
    //   component: Vue.extend({
    //     created () {
    //       location.href = `${process.env.BASE_URL}404.html`
    //     }
    //   }),
    // },
  ],
})
