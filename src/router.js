import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

var router = new Router({
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
        component: () => import('./views/Donations.vue'),
        meta: {
          'roles': ['Admin', 'Employee', { 'name': 'VolunteerManager' }] //'Admin',
        }
    },
    {
        path: '/donations/add',
        name: 'donations-add',
        component: () => import('./views/DonationsAdd.vue'),
        meta: {
          'roles': ['Admin', 'Employee', { 'name': 'VolunteerManager' }] //'Admin',
        }
    },
    {
      path: '/household',
      name: 'household',
      component: () => import('./views/Household.vue'),
      meta: {
        'roles': ['Admin', 'Employee', { 'name': 'VolunteerManager' }] //'Admin',
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.hasOwnProperty("roles"))) {
        function checker () {
            // Now, check the roles for the given entry!
            if(!store.getters['user/isError']) {
                var records = to.matched.filter(record => record.meta.hasOwnProperty("roles"))
                var fulfillsRole = records.reduce((fulfills, record) => {
                    return fulfills || store.getters['user/is'](record.meta.roles)
                }, records.length === 0)

                if(fulfillsRole) {
                    next();
                } else {
                    window.location.replace('/arise/#/error/403')
                }
            } else {
                switch (store.getters['user/getErrorCode']) {
                    case 401:
                        // Not Authenticated!
                        window.location.replace('/arise/#/signin?redirect=' + to.fullPath)
                        break;
                    case 403:
                        // Forbidden!
                        window.location.replace('/arise/#/error/403')
                        break;
                    case 404:
                        // redirect 404 error page
                        window.location.replace('/arise/#/error/404')
                        break;
                    case 500:
                        // redirect 500 error page
                        window.location.replace('/arise/#/error/500')
                        break;
                }
            }
        }
        // only for init - checks if there is already a user, initiates OAuth handshake otherwise
        var u = store.getters['user/get']
        if(u === null) {
            // Handshake!
            store.dispatch('user/init').then(() => {
                checker()
            })
        } else {
            checker()
        }

    } else {
        next();
    }
});

export default router