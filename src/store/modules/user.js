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
                            ((role.hasOwnProperty("crew") && role.crew.hasOwnProperty("name") && supporterRole.crewName === role.crew.name) ||
                                !role.hasOwnProperty("crew") || !role.crew.hasOwnProperty("name")) &&
                            ((role.hasOwnProperty("crew") && role.crew.hasOwnProperty("id") && supporterRole.crewId === role.crew.id) ||
                                !role.hasOwnProperty("crew") || !role.crew.hasOwnProperty("id")) &&
                            ((role.hasOwnProperty("pillar") && supporterRole.pillar === role.pillar) || !role.hasOwnProperty("pillar"))
                        )),
                    false
                )
            }
            return fulfills || has
        }, false)
    },
    same: (state) => (userId) => {
        return state.user.uuid === userId
    },
    isEmployee: (state, getters) => {
        return getters.is(["Employee"])
    },
    isAdmin: (state, getters) => {
        return getters.is(["Admin"])
    },
    isVolunteerManager: (state, getters) => {
        return getters.is([{ "name": "VolunteerManager" }]) // Todo: consider Crew!
    },
    isAuthorOrEditor: (state, getters) => (userIds) => {
        return userIds.reduce((acc, userId) => acc || getters.same(userId), false)
    },
    getCrew: (state, getters) => {
        var crewRole = state.user.roles.find(role => role.hasOwnProperty("crewId"))
        var res = null
        if(typeof crewRole !== "undefined") {
            res =  [
              {
                "uuid": crewRole.crewId,
                "name": crewRole.crewName
              }
            ]
        }
        return res
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
    getUser () {
      var name = ""
      axios.get('/drops/webapp/identity').then( response => {
          name = response.data.additional_information.profiles[0].supporter.fullName
      })
      return name
    },
    pending (store) {
      store.commit('API_USER_PENDING')
    },
    success (store, user) {
      store.commit('API_USER_SUCCESS', user)
    },
    error (store, error) {
      store.commit('API_USER_FAILURE', error)
    },
    /**
     * Has to be called by all other AJAX requests, if they receive an [401 status code](https://tools.ietf.org/html/rfc7235#section-3.1).
     * If an ajax call receives a 401, the user has been logged out.
     *
     * Since all AJAX requests are executed by the VUEX store, this is a matter of accuracy.
     *
     * @author Johann Sell
     * @param store
     * @param error
     */
    logout(store, error) {
        store.commit('API_USER_LOGOUT', error)
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
    },
    API_USER_LOGOUT(state, error) {
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
