import axios from 'axios'

const state = {
    user: null,
    pending: false,
    error: null
}

const getters = {
    get: (state, getters) => {
        return state.user
    },
    is: (state) => (roles) => {
        var userRoles = state.user.roles
            .filter((role) => role.hasOwnProperty("name") && !role.hasOwnProperty("crewName") && !role.hasOwnProperty("pillar"))
        var supporterRoles = state.user.roles
            .filter((role) => role.hasOwnProperty("name") && (role.hasOwnProperty("crewName") || role.hasOwnProperty("pillar")))
        return roles.reduce((fulfills, role) => {
            var has = false
            if((typeof role === "string") && role !== "VolunteerManager") {
                // searching for a simple role (admin, supporter or employee)
                has = userRoles.some((userRole) => userRole.name.toLowerCase() === role.toLowerCase())
            } else if(role === "VolunteerManager") {
                // The user has to be Volunteer Manager, but the pillar is not important
                has = supporterRoles.reduce((found, supporterRole) => (found || supporterRole.name === role), false)
            } else {
                // The user has to be Volunteer Manager with a concrete pillar or for a concrete crew
                has = supporterRoles.reduce((found, supporterRole) =>
                        (found || (supporterRole.name === role.name &&
                            ((role.hasOwnProperty("crew") && supporterRole.crewName === role.crew) || !role.hasOwnProperty("crew")) &&
                            ((role.hasOwnProperty("pillar") && supporterRole.pillar === role.pillar) || !role.hasOwnProperty("pillar"))
                        )),
                    false
                )
            }
            return fulfills || has
        }, false)
    },
    isError: (state) => {
        return state.error !== null
    },
    getErrorCode: (state) => {
        var res = null
        if(state.error !== null && state.error.hasOwnProperty("response") && state.error.response.hasOwnProperty("status")) {
            res = state.error.response.status
        }
        return res
    }
}

const actions = {
    init(store) {
        // sets `state.loading` to true. Show a spinner or something.
        store.commit('API_USER_PENDING')

        return axios.get('/backend/stream/identity')
            .then(response => {
                // sets `state.loading` to false
                // also sets `state.apiData to response`
                store.commit('API_USER_SUCCESS', response.data)
            })
            .catch(error => {
                // set `state.loading` to false and do something with error
                store.commit('API_USER_FAILURE', error)
            })
    }
}

const mutations = {
    API_USER_PENDING(state) {
        state.user = null
        state.pending = true
        state.error = null
    },
    API_USER_SUCCESS(state, user) {
        state.user = user
        state.pending = false
        state.error = null
    },
    API_USER_FAILURE(state, error) {
        state.user = null
        state.pending = false
        state.error = error
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}