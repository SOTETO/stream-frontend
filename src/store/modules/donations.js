import axios from 'axios'

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
    items: [],
    error: null
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
                "amount": donation.amount.sources.reduce((amount, source) => amount + source.amount, 0),
                "deposited": "TODO", // Todo: add deposition information
                "date": {
                    "received": donation.amount.received,
                    "created": donation.created
                },
                "author": donation.author,
                "supporter":  donation.amount.involvedSupporter
            }
        })
    },
    isError: (state, getters) => {
        return state.error !== null
    },
    getErrorCode: (state, getters) => {
        return state.error.response.code
    }
}


const actions = {
    init (store) {
        axios.get('/backend/stream/donations').then(response => {
            store.commit({ "type": 'init', "donations": response.data.data })
        }).catch(error => {
            switch(error.response.code) {
                case 401:
                    store.root.dispatch('user/logout')
                    break;
                case _:
                    store.commit({ "type": 'setError', error: error })
                    break;
            }
        })
    },
    add (store, donation) {
        var user = store.rootGetters['user/get']
        donation["id"] = uuidv4()
        donation["author"] = user.uuid
        donation.amount.involvedSupporter = donation.amount.involvedSupporter.map(supporter => supporter.id)
        axios.post('/backend/stream/donations/create', donation, { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }).then(response => {
            store.commit({ "type": 'push', "donation": response.data.data[0] })
        }).catch(error => {
            switch(error.response.code) {
                case 401:
                    store.root.dispatch('user/logout')
                    break;
                case _:
                    store.commit({ "type": 'setError', error: error })
                    break;
            }
        })
    }
}

const mutations = {
    init(state, pushDonations) {
        state.items = pushDonations.donations
    },
    push(state, pushDonation) {
        state.items.push(pushDonation.donation)
    },
    setError(state, pushError) {
        state.error = pushError.error
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}