import Vue from 'vue'
import Vuex from 'vuex'
import donations from './modules/donations'
import household from './modules/household'
import user from './modules/user'
import deposits from './modules/deposits'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        donations,
        household,
        user,
        deposits
    },
    strict: debug
})