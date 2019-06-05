import axios from 'axios'
import DonationEndpoints from '@/backend-endpoints/DonationEndpoints'

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
//                 "sources": [{"category", "amount", "currency", "type"}],
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
        var res = null
        if(state.error !== null && typeof state.error !== "undefined" && state.error.hasOwnProperty("response")) {
            res = state.error.response.code
        }
        return res
    }
}


const actions = {
    init (store) {
        var ajax = new DonationEndpoints(store)

        var successHandler = (response) => store.commit({ "type": 'init', "donations": response.data.data })
        var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
        var page = { "offset": 0, size: 10 }
        var sort = { "field": "description", "dir": "ASC" }
        ajax.get(successHandler, errorHandler, page, sort)
    },
    add (store, donation) {
        var user = store.rootGetters['user/get']
        donation["id"] = uuidv4()
        donation["author"] = user.uuid
        donation.amount.involvedSupporter = donation.amount.involvedSupporter.map(supporter => supporter.id)

        var ajax = new DonationEndpoints(store)
        var successHandler = (response) => store.commit({ "type": 'push', "donation": response.data.data[0] })
        var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
        ajax.save(successHandler, errorHandler, donation)
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