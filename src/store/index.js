import Vue from 'vue'
import Vuex from 'vuex'
import takings from './modules/takings'
import household from './modules/household'
import user from './modules/user'
import deposits from './modules/deposits'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        takings,
        household,
        user,
        deposits
    },
    strict: debug
})
