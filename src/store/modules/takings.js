import DonationEndpoints from '@/backend-endpoints/DonationEndpoints'

const uuidv4 = require('uuid/v4');

// initial state
// shape: [{
//             "id"
//             "context": {
//                 "description": "",
//                 "category": //             },
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
    filter: {
      'publicId': null,
      'crew': null,
      'name': null,
      'norms': null
    },
    error: null,
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
        var taking = state.items.find(item  => item.id === id)
        if (taking === undefined) {
          
        }
        return JSON.parse(JSON.stringify(taking))
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
    },
    filter: (state) => {
        return JSON.parse(JSON.stringify(state.filter))
    },
    taggableFilter: (state) => {
        var res = []
        function check(obj, attr) {
            return obj.hasOwnProperty(attr) && (typeof obj[attr] !== "undefined") && obj[attr] !== null &&
                (obj[attr] !== "" || typeof obj[attr] !== "string") &&
                (obj[attr] !== 0.0 || typeof obj[attr] !== "number") &&
                ((Array.isArray(obj[attr]) && obj[attr].length !== 0) || !Array.isArray(obj[attr]))
        }
        var fields = [
            {
                "obj": state.filter,
                "attr": "publicId"
            },
            {
                "obj": state.filter,
                "attr": "crew"
            },
            {
                "obj": state.filter,
                "attr": "name"
            },
            {
                "obj": state.filter.state,
                "attr": "norms"
            }
        ]
        for(var field of fields) {
            if(check(field.obj, field.attr)) {
                res.push({
                    "name": field.attr,
                    "value": field.obj[field.attr]
                })
            }
        }
        if(check(state.filter.amount, "amount")) {
            res.push({
                "name": "amount",
                "value": state.filter.amount
            })
        }
        return res
    }

}

const actions = {
    init (store) {
        var ajax = new DonationEndpoints(store)

        var count = (store) => {
            var successHandler = (response) => store.commit({"type": 'count', "count": response.data})
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            ajax.count(successHandler, errorHandler, store.state.page, store.state.sort, store.state.filter)
        }
        
        var get = (store) => {
            var successHandler = (response) => store.commit({ "type": 'init', "takings": response.data })
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            ajax.get(successHandler, errorHandler, store.state.page, store.state.sort, store.state.filter)
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
    filter (store, filter) {
        store.commit({ "type": "filter", "filter": filter })
        var ajax = new DonationEndpoints(store)

        var count = (store) => {
            var successHandler = (response) => store.commit({"type": 'count', "count": response.data})
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            ajax.count(successHandler, errorHandler, store.state.page, store.state.sort, store.state.filter)
        }
        
        var get = (store) => {
            var successHandler = (response) => store.commit({ "type": 'init', "takings": response.data })
            var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
            ajax.get(successHandler, errorHandler, store.state.page, store.state.sort, store.state.filter)
        }
        count(store)
        get(store)
    },
    sort (store, sorting) {
        store.commit({ "type": "sort", "sort": sorting })
        store.dispatch('init')
    },
    add (store, taking) {
        var user = store.rootGetters['user/get']
        var supporter = []
        supporter.push({"uuid": user.uuid, "name": user.name})
        for (var i=0; i < taking.amount.involvedSupporter.length; i++ ) {
          var entry = { "uuid": taking.amount.involvedSupporter[i].id, "name": taking.amount.involvedSupporter[i].profiles[0].supporter.fullName}
          supporter.push(entry)
        }
        taking["author"] = user.uuid
        //taking["norms"] = "Donation"
        taking["crew"] = store.rootGetters['user/getCrew']
        taking.amount.involvedSupporter = supporter
        taking["depositUnits"] = []

        var ajax = new DonationEndpoints(store)
        var successHandler = (response) => store.commit({ "type": 'push', "takings": response.data.data[0] })
        var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
        ajax.save(successHandler, errorHandler, taking)
    },
    update (store, taking) {
      var ajax = new DonationEndpoints(store)
      var successHandler = (response) => store.commit({"type": 'push', 'takings': response.data})
      var errorHandler = (error) => store.commit({'type': 'setError', error: error})
      ajax.update(successHandler, errorHandler, taking)
    },
    getById (store, id) {
        // TODO: Use Ajax query!
        var item = store.state.items.find(item => item.id === id)
        if(item !== undefined) {
            store.commit({ "type": "getById", "takings": item })
        } else {
            var ajax = new DonationEndpoints(store)
            var successHandler = (response) => store.commit({'type': 'push', 'takings': response.data})
            var errorHandler = (error) => store.commit({'type': 'setError', error: error})
            ajax.getById(successHandler, errorHandler,id)
        }
    },
    
}

const mutations = {
    init(state, pushDonations) {
        state.items = pushDonations.takings
    },
    filter(state, filter) {
        state.filter = filter.filter
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
        state.items.push(pushDonation.takings)
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
