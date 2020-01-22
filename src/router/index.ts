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
        '/data/*',
        'index.html',
      ],
      component: () => import(/* webpackChuckName: 'file' */ '../pages/File/File.vue'),
    },
    {
      path: '*',
      beforeEnter: () => {
        location.href = `${process.env.BASE_URL}404.html`
      },
    },
  ],
})
