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
//             "depositUnits": [],
//             "amount": {
//                 "received": Date.now(),
//                 "sources": [{"category", "amount", "currency", "type"}],
//                 "involvedSupporter": []
//             },
//             "author": "some-uuid",
//             "crew": "some-uuid",
//             "created": Date.now(),
//             "updated": Date.now()
//         }]
const state = {
    items: [],
    specialRequests: [],
    page: {
        size: 10,
        offset: 0
    },
    countItems: 0,
    sorting: {
        field: "taking.created",
        dir: "DESC"
    },
    error: null
}

const getters = {
    all: (state) => {
        return state.items
    },
    overview: (state) => {
        return state.items.map((taking) => {
            return {
                "id": taking.id,
                "name": taking.context.description,
                "norms": taking.norms,
                "amount": taking.amount.sources.reduce((amount, source) => amount + source.amount.amount, 0),
                "deposited": taking.depositUnits.reduce((categories, unit) => {
                    if(unit.hasOwnProperty("confirmed")) {
                        if(!categories.confirmed.hasOwnProperty(unit.currency)) {
                            categories.confirmed[unit.currency] = 0
                        }
                        categories.confirmed[unit.currency] += unit.amount
                    } else {
                        if(!categories.unconfirmed.hasOwnProperty(unit.currency)) {
                            categories.unconfirmed[unit.currency] = 0
                        }
                        categories.unconfirmed[unit.currency] += unit.amount
                    }
                    return categories
                }, { "confirmed": {}, "unconfirmed": {} }),
                "date": {
                    "received": taking.amount.received,
                    "created": taking.created
                },
                "author": taking.author,
                "crew": taking.crew,
                "supporter":  taking.amount.involvedSupporter
            }
        })
    },
    getById: (state) => (id) => {
        return state.specialRequests.find(item => item.id === id)
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
        var ajax = new DonationEndpoints(store)

        var count = (store) => {
            var successHandler = (response) => store.commit({"type": 'count', "count": response.data})
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            var page = store.state.page
            var sort = store.state.sorting
            ajax.count(successHandler, errorHandler, page, sort)
        }
        
        var get = (store) => {
            var successHandler = (response) => store.commit({ "type": 'init', "takings": response.data })
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
    add (store, taking) {
        var user = store.rootGetters['user/get']
        taking["id"] = uuidv4()
        taking["author"] = user.uuid
        //taking["norms"] = "Donation"
        taking["crew"] = store.rootGetters['user/getCrew']
        taking.amount.involvedSupporter = taking.amount.involvedSupporter.map(supporter => supporter.id)
        taking["depositUnits"] = []

        var ajax = new DonationEndpoints(store)
        var successHandler = (response) => store.commit({ "type": 'push', "taking": response.data.data[0] })
        var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
        ajax.save(successHandler, errorHandler, taking)
    },
    getById (store, id) {
        // TODO: Use Ajax query!
        var item = store.state.items.find(item => item.id === id)
        if(typeof item !== "undefined") {
            store.commit({ "type": "getById", "taking": item })
        }
    }
}

const mutations = {
    init(state, pushDonations) {
        state.items = pushDonations.takings
    },
    getById(state, newSpecial) {
        state.specialRequests.push(newSpecial.taking)
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
        state.items.push(pushDonation.taking)
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
