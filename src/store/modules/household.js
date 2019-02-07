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
                "state": last.request, // Todo: Represent other possible states!
                "processing": " Todo " // Todo: add processing states (ASP, employee)
            }
        })
    },
    byId: (state) => (id) => {
        var entry = state.items.find(household => household.id === id)
        return entry.versions[entry.versions.length - 1]
    }
}


const actions = {
    add ({ state, commit }, household) {
        commit({ "type": 'push', "household": household })
    },
    update ({ state, commit}, household) {
        commit({ "type": 'replace', "household": household })
    }
}

const mutations = {
    push(state, pushHousehold) {
        pushHousehold.household["id"] = uuidv4()
        var init = {
            "id": pushHousehold.household.id,
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