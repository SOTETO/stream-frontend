import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
        path: '/donations',
        name: 'donations',
        component: () => import('./views/Donations.vue')
    },
    {
        path: '/donations/add',
        name: 'donations-add',
        component: () => import('./views/DonationsAdd.vue')
    },
    {
      path: '/household',
      name: 'household',
      component: () => import('./views/Household.vue')
    }
  ]
})
