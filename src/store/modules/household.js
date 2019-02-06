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
//             "request": false
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
    }
}


const actions = {
    add ({ state, commit }, household) {
        commit({ "type": 'push', "household": household })
    }
}

const mutations = {
    push(state, pushHousehold) {
        pushHousehold.household["id"] = uuidv4()
        state.items.push(pushHousehold.household)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}