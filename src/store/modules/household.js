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
            return {
                "id": household.id,
                "what": household.reason.what,
                "wherefor": household.reason.wherefor,
                "crew": " TODO ", // Todo: add crew information
                "amount": household.amount.formatted,
                "date": {
                    "created": household.created,
                    "updated": household.updated
                },
                "supporter": " TODO ", // Todo: add creator! And more?
                "state": household.request, // Todo: Represent other possible states!
                "processing": " Todo " // Todo: add processing states (ASP, employee)
            }
        })
    },
    byId: (state) => (id) => {
        return state.items.find(household => household.id === id)
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
        state.items.push(pushHousehold.household)
    },
    replace(state, replaceHousehold) {
        var i = state.items.findIndex(h => h.id === replaceHousehold.household.id)
        state.items.splice(i, 1, replaceHousehold.household)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}