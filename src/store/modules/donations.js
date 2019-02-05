const uuidv5 = require('uuid/v5');

// initial state
// shape: [{
//             "id"
//             "context": {
//                 "description": "",
//                 "category": ""
//             },
//             "comment": "",
//             "details": {
//                 "reasonForPayment": "",
//                 "receipt": false,
//                 "partner": {}
//             },
//             "amount": {
//                 "received": Date.now(),
//                 "sources": [{"category", "amount", "formatted", "type"}],
//                 "involvedSupporter": []
//             },
//             "created": Date.now(),
//             "updated": Date.now()
//         }]
const state = {
    items: []
}

const getters = {
    all: (state, getters) => {
        return state.items
    },
    overview: (state, getters) => {
        return state.items.map((donation) => {
            return {
                "id": donation.id,
                "name": donation.context.description,
                "crew": "TODO", // Todo: Add crew of creator!
                "amount": donation.amount.sources.reduce((amount, source) => amount + source.amount, 0),
                "deposited": "TODO", // Todo: add deposition information
                "date": {
                    "received": donation.amount.received,
                    "created": donation.created
                },
                "supporter": donation.amount.involvedSupporter // Todo: add creator!
            }
        })
    }
}


const actions = {
    add ({ state, commit }, donation) {
        commit({ "type": 'push', "donation": donation })
    }
}

const mutations = {
    push(state, pushDonation) {
        pushDonation.donation["id"] = uuidv5('http://pool.vivaconagua.org/stream', uuidv5.URL)
        state.items.push(pushDonation.donation)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}