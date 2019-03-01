const uuidv4 = require('uuid/v4');

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
//             "author": "some-uuid",
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
                "author": donation.author,
                "supporter":  donation.amount.involvedSupporter // Todo: add creator!
            }
        })
    }
}


const actions = {
    add (store, donation) {
        var user = store.rootGetters['user/get']
        donation["author"] = user.uuid
        store.commit({ "type": 'push', "donation": donation })
    }
}

const mutations = {
    push(state, pushDonation) {
        pushDonation.donation["id"] = uuidv4()
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