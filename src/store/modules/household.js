import HouseholdStateMachine from '@/utils/HouseholdPetriNet.js'
import HouseholdPetriNet from "../../utils/HouseholdPetriNet";
const uuidv4 = require('uuid/v4');

const model = {
    isComplete(household) {
        return household.hasOwnProperty("amount") && household.amount.hasOwnProperty("amount") && household.amount.amount > 0 &&
            household.hasOwnProperty("reason") && household.reason.hasOwnProperty("what") &&
            typeof household.reason.what !== "undefined" && household.reason.what !== null && household.reason.what !== "" &&
            household.reason.hasOwnProperty("wherefor") && typeof household.reason.wherefor !== "undefined" &&
            household.reason.wherefor !== null && household.reason.wherefor !== "" &&
            household.hasOwnProperty("iban") && typeof household.iban !== "undefined" && household.iban !== null &&
            household.iban !== "" && household.hasOwnProperty("bic") && typeof household.bic !== "undefined" &&
            household.bic !== null && household.bic !== ""
    }
}

// initial state
// shape: [{
//             "id",
//             "state",
//             "versions": [{
//                  "amount": {
//                      "amount": 0,
//                      "formatted": "0,00"
//                  },
//                  "reason": {
//                      "what": "",
//                      "wherefor": ""
//                  },
//                  "iban": "",
//                  "bic": "",
//                  "request": false,
//                  "created": Date,
//                  "updated": Date,
//                  "author": "",
//                  "editor": "",
//                  "volunteerManager": ""
//                  "employee": ""
//              }]
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
                "author": household.versions
                    .filter(version => version.hasOwnProperty("author"))    // get the author (usually one!)
                    .map(version => version.author).pop(),
                "amount": household.versions.reduce((amounts, version) => {
                    if(amounts.length === 0 || amounts[amounts.length - 1].amount !== version.amount.amount) {
                        amounts.push(version.amount)
                    }
                    return amounts
                }, []).map(version => version.formatted),
                "date": {
                    "created": first.created,
                    "updated": last.updated
                },
                "supporter": household.versions
                    .filter(version => version.hasOwnProperty("author"))    // get the author (usually one!)
                    .map(version => version.author)
                    .concat(
                        household.versions.filter(version => version.hasOwnProperty("editor"))  // get all editors
                            .map(version => version.editor)
                    ).filter((value, index, self) => self.indexOf(value) === index),    // unique! If author === editor
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
    add (store, household) {
        var user = store.rootGetters['user/get']
        household["author"] = user.uuid
        store.commit({ "type": 'push', "household": household })
    },
    update (store, household) {
        var user = store.rootGetters['user/get']
        household["editor"] = user.uuid
        store.commit({ "type": 'replace', "household": household })
    },
    isKnown(store, household) {
        var user = store.rootGetters['user/get']
        household["volunteerManager"] = user.uuid
        store.commit({ "type": 'isKnown', "household": household })
    },
    isUnknown(store, household) {
        var user = store.rootGetters['user/get']
        household["volunteerManager"] = user.uuid
        store.commit({ "type": 'isUnknown', "household": household })
    },
    free(store, household) {
        var user = store.rootGetters['user/get']
        household["employee"] = user.uuid
        store.commit({ "type": 'free', "household": household })
    },
    block(store, household) {
        var user = store.rootGetters['user/get']
        household["employee"] = user.uuid
        store.commit({ "type": 'block', "household": household })
    },
    requestRepayment(store, household) {
        var user = store.rootGetters['user/get']
        household["employee"] = user.uuid
        store.commit({ "type": 'requestRepayment', "household": household})
    },
    repay(store, household) {
        var user = store.rootGetters['user/get']
        household["employee"] = user.uuid
        store.commit({ "type": 'repay', "household": household })
    }

}

const mutations = {
    push(state, pushHousehold) {
        var s = HouseholdPetriNet.init(model.isComplete(pushHousehold.household))
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
        var newState = element.state
        if(replaceHousehold.household.request && element.state.isAppliedFor()) {
            newState = element.state.execute("request")
        } else if(!replaceHousehold.household.request && element.state.isRequest()) {
            newState = element.state.execute("apply")
        }
        if(model.isComplete(replaceHousehold.household)) {
            newState = newState.complete()
        } else {
            newState = newState.incomplete()
        }
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