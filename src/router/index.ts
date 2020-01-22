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
      path: '/404',
      alias: [
        '*'
      ],
      name: '404',
      component: () => import(/* webpackChuckName: '404-page' */ '../pages/404.vue'),
    },
  ],
})
