import HouseholdStateMachine from '@/utils/HouseholdPetriNet.js'
import HouseholdPetriNet from "../../utils/HouseholdPetriNet";
const uuidv4 = require('uuid/v4');

// initial state
// shape: [{
//             "id"
//             "amount": {
//                 "amount": 0,
//                 "formatted": "0,00"
//             },
//             "reason": {
//                 "what": "",
//                 "wherefor": ""
//             },
//             "iban": "",
//             "bic": "",
//             "request": false,
//             "created": Date,
//             "updated": Date
//         }]
const state = {
    items: []
}

const getters = {
    all: (state, getters) => {
        return state.items
    },
    overview: (state, getters) => {
        return state.items.map((household) => {
            var stateDescription = household.state.describe()
            var first = household.versions[0]
            var last = household.versions[household.versions.length - 1]
            return {
                "id": household.id,
                "what": last.reason.what,
                "wherefor": last.reason.wherefor,
                "crew": " TODO ", // Todo: add crew information
                "amount": household.versions.map(h => h.amount.formatted),
                "date": {
                    "created": first.created,
                    "updated": last.updated
                },
                "supporter": " TODO ", // Todo: add creator! And more?
                "state": stateDescription.Household,
                "processing": {
                    "VolunteerManager": stateDescription.VolunteerManager,
                    "Employee": stateDescription.Employee
                }
            }
        })
    },
    byId: (state) => (id) => {
        var entry = state.items.find(household => household.id === id)
        return entry.versions[entry.versions.length - 1]
    },
    stateById: (state) => (id) => {
        var entry = state.items.find(household => household.id === id)
        return entry.state
    }
}


const actions = {
    add ({ state, commit }, household) {
        commit({ "type": 'push', "household": household })
    },
    update ({ state, commit }, household) {
        commit({ "type": 'replace', "household": household })
    },
    isKnown({ state, commit }, household) {
        commit({ "type": 'isKnown', "household": household })
    },
    isUnknown({ state, commit }, household) {
        commit({ "type": 'isUnknown', "household": household })
    },
    free({ state, commit }, household) {
        commit({ "type": 'free', "household": household })
    },
    block({ state, commit }, household) {
        commit({ "type": 'block', "household": household })
    },
    requestRepayment({ state, commit }, household) {
        commit({ "type": 'requestRepayment', "household": household})
    },
    repay({ state, commit }, household) {
        commit({ "type": 'repay', "household": household })
    }

}

const mutations = {
    push(state, pushHousehold) {
        var s = HouseholdPetriNet.init(true) // Todo: Check, if complete and put it in here!
        if(pushHousehold.household.request) {
            s = s.execute("request")
        } else {
            s = s.execute("apply")
        }
        pushHousehold.household["id"] = uuidv4()
        var init = {
            "id": pushHousehold.household.id,
            "state": s,
            "versions": [
                pushHousehold.household
            ]
        }
        state.items.push(init)
    },
    replace(state, replaceHousehold) {
        var i = state.items.findIndex(h => h.id === replaceHousehold.household.id)
        var element = state.items[i]
        element.versions.push(replaceHousehold.household)
        var newState = null
        if(replaceHousehold.household.request && element.state.isAppliedFor()) {
            newState = element.state.execute("request")
        } else if(!replaceHousehold.household.request && element.state.isRequest()) {
            newState = element.state.execute("apply")
        } // TODO: Check completeness!!
        // var newState = element.state.update(replaceHousehold.household)
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    },
    isKnown(state, container) {
        var i = state.items.findIndex(h => h.id === container.household.id)
        var element = state.items[i]
        var newState = element.state.execute("isKnown")
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    },
    isUnknown(state, container) {
        var i = state.items.findIndex(h => h.id === container.household.id)
        var element = state.items[i]
        var newState = element.state.execute("isUnknown")
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    },
    free(state, container) {
        var i = state.items.findIndex(h => h.id === container.household.id)
        var element = state.items[i]
        var newState = element.state.execute("free")
        if(element.state.equals(newState)) {
            newState = element.state.execute("approve")
        }
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    },
    block(state, container) {
        var i = state.items.findIndex(h => h.id === container.household.id)
        var element = state.items[i]
        var newState = element.state.execute("block")
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    },
    requestRepayment(state, container) {
        var i = state.items.findIndex(h => h.id === container.household.id)
        var element = state.items[i]
        var newState = element.state.execute("requestPayment")
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    },
    repay(state, container) {
        var i = state.items.findIndex(h => h.id === container.household.id)
        var element = state.items[i]
        var newState = element.state.execute("repay")
        if(typeof newState !== "undefined" && newState !== null) {
            element.state = newState
        }
        state.items.splice(i, 1, element)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}