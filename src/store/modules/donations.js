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
    page: {
        size: 10,
        offset: 0
    },
    countItems: 0,
    sorting: {
        field: "donation.created",
        dir: "DESC"
    },
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
    },
    page: (state) => {
        return {
            "previous": state.page.offset,
            "next": state.countItems - (state.page.offset + state.page.size)
        }
    },
    sort: (state) => {
        return state.sorting
    }
}

const actions = {
    init (store) {
        var ajax = new DonationEndpoints(store)

        var count = (store) => {
            var successHandler = (response) => store.commit({"type": 'count', "count": response.data.data})
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            var page = store.state.page
            var sort = store.state.sorting
            ajax.count(successHandler, errorHandler, page, sort)
        }
        
        var get = (store) => {
            var successHandler = (response) => store.commit({ "type": 'init', "donations": response.data.data })
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            var page = store.state.page
            var sort = store.state.sorting
            ajax.get(successHandler, errorHandler, page, sort)
        }
        
        get(store)
        count(store)
    },
    page (store, down) {
        var offset = store.state.page.offset - store.state.page.size
        var valid = offset >= 0
        if(!down) {
            offset = store.state.page.offset + store.state.page.size
            valid = offset < store.state.countItems
        }
        if(valid) {
            store.commit({ "type": 'page', "offset": offset })
            store.dispatch('init')
        }
    },
    sort (store, sorting) {
        store.commit({ "type": "sort", "sort": sorting })
        store.dispatch('init')
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
    sort(state, sort) {
        state.sorting = sort.sort
    },
    count(state, count) {
        state.countItems = count.count.count
    },
    page(state, offset) {
        state.page.offset = offset.offset
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