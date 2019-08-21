import Vue from 'vue'
import Vuex from 'vuex'
import donations from './modules/donations'
import takings from './modules/takings'
import household from './modules/household'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        donations,
        takings,
        household,
        user
    },
    strict: debug
})