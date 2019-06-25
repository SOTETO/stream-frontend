/* eslint-disable no-undef */
//import axios from 'axios'
//import TakingsEndpoints from  '@/backend-endpoints/TakingsEndpoints'

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
//             "depositUnits": [],
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
        field: "takings.created",
        dir: "DESC"
    },
    error: null
}

const getters = {
    all: (state) => {
        return state.items
    },
    overview: (state) => {
        return state.items.map((takings) => {
            return {
                "id": takings.id,
                "name": takings.context.description,
                "amount": takings.amount.sources.reduce((amount, source) => amount + source.amount, 0),
                "deposited": "TODO", // Todo: add deposition information
                "date": {
                    "received": takings.amount.received,
                    "created": takings.created
                },
                "author": takings.author,
                "supporter":  takings.amount.involvedSupporter
            }
        })
    },
    isError: (state) => {
        return state.error !== null
    },
    getErrorCode: (state) => {
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
        var ajax = new TakingsEndpoints(store)

        var count = (store) => {
            var successHandler = (response) => store.commit({"type": 'count', "count": response.data.data})
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            var page = store.state.page
            var sort = store.state.sorting
            ajax.count(successHandler, errorHandler, page, sort)
        }
        
        var get = (store) => {
            var successHandler = (response) => store.commit({ "type": 'init', "takings": response.data.data })
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
    add (store, takings) {
        var user = store.rootGetters['user/get']
        takings["id"] = uuidv4()
        takings["author"] = user.uuid
        takings.amount.involvedSupporter = takings.amount.involvedSupporter.map(supporter => supporter.id)
        takings["depositUnits"] = []

        var ajax = new TakingsEndpoints(store)
        var successHandler = (response) => store.commit({ "type": 'push', "takings": response.data.data[0] })
        var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
        ajax.save(successHandler, errorHandler, takings)
    }
}

const mutations = {
    init(state, pushTakings) {
        state.items = pushTakings.takings
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
    push(state, pushTakings) {
        state.items.push(pushTakings.takings)
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