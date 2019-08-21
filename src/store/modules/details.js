import axios from 'axios'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    details: {
      user: ''
    },
  },

  getters: {
    details: state => {
      return state.details
    }
  },

  mutations: {
    // Here we will create Jenny
  },

  actions: {

    init(store) {
      // sets `state.loading` to true. Show a spinner or something.
      store.commit('API_USER_PENDING')

      return axios.get('localhost:3000/test/details')
        .then(response => {
          // sets `state.loading` to false
          // also sets `state.apiData to response`
          store.commit('API_USER_SUCCESS', response.data)
        })
        .catch(error => {
          // set `state.loading` to false and do something with error
          store.commit('API_USER_FAILURE', error)
        })
    },
  }
});
