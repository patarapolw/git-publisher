import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  base: process.env.BASE_URL,
  mode: process.env.VUE_APP_ROUTER_MODE,
  routes: [
    {
      path: '/data',
      alias: [
        '/',
        "/data/*"
      ],
      component: () => import(/* webpackChuckName: 'file' */ '../pages/File/File.vue')
    },
    {
      path: '*',
      component: () => import(/* webpackChuckName: '404-path' */ '../pages/404.vue')
    }
  ]
})
