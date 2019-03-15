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

/**
 * Calculates an updated version of a household entry that has been identified by its UUID.
 *
 * @author Johann Sell
 * @param store vuex store instance
 * @param household the new version
 * @param role of the person who changed the household entry ("editor", "employee" or "volunteerManager")
 * @param changer function that generates a new state depending of the current state
 * @param dependsOnState a boolean flag that indicates if the new version of the household entry has to be saved only on
 * a successful update of its state
 */
function addVersion(store, household, role, changer, dependsOnState = true) {
    var user = store.rootGetters['user/get']
    household[role] = user.uuid

    var i = store.state.items.findIndex(h => h.id === household.id)
    var element = store.state.items[i] // Altering a store item outside a mutation is not allowed. Thus, create a clone / hard copy of it!

    var newState = changer(element.state)

    store.commit({
        "type": 'update',
        "i": i,
        "householdContainer": element,
        "version": household,
        "state": newState,
        "dependsOnState": dependsOnState
    })
}

const actions = {
    add (store, household) {
        var user = store.rootGetters['user/get']
        household["author"] = user.uuid
        var s = HouseholdPetriNet.init(model.isComplete(household))
        if(household.request) {
            s = s.execute("request")
        } else {
            s = s.execute("apply")
        }
        household["id"] = uuidv4()
        var init = {
            "id": household.id,
            "state": s,
            "versions": [
                household
            ]
        }
        store.commit({ "type": 'push', "household": init })
    },
    update (store, household) {
        addVersion(store, household, "editor", (state) => {
            var newState = state
            if(household.request && state.isAppliedFor()) {
                newState = state.execute("request")
            } else if(!household.request && state.isRequest()) {
                newState = state.execute("apply")
            }
            if(model.isComplete(household)) {
                newState = newState.complete()
            } else {
                newState = newState.incomplete()
            }
            return newState
        }, false)
    },
    isKnown(store, household) {
        addVersion(store, household, "volunteerManager", (state) => state.execute("isKnown"))
    },
    isUnknown(store, household) {
        addVersion(store, household, "volunteerManager", (state) => state.execute("isUnknown"))
    },
    free(store, household) {
        addVersion(store, household, "employee", (state) => {
            var newState = state.execute("free")
            if(state.equals(newState)) {
                newState = state.execute("approve")
            }
            return newState
        })
    },
    block(store, household) {
        addVersion(store, household, "employee", (state) => state.execute("block"))
    },
    requestRepayment(store, household) {
        addVersion(store, household, "employee", (state) => state.execute("requestPayment"))
    },
    repay(store, household) {
        addVersion(store, household, "employee", (state) => state.execute("repay"))
    }

}

const mutations = {
    push(state, pushHousehold) {
        state.items.push(pushHousehold.household)
    },
    update(state, container) {
        if(!container.dependsOnState) {
            container.householdContainer.versions.push(container.version)
        }
        if(typeof container.state !== "undefined" && container.state !== null) {
            container.householdContainer.state = container.state
            if(container.dependsOnState) {
                container.householdContainer.versions.push(container.version)
            }
        }
        state.items.splice(container.i, 1, container.householdContainer)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}