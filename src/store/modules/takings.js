import DonationEndpoints from '@/backend-endpoints/DonationEndpoints'
import axios from "axios"
const state = {
  items: [],
  count: null,
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
                "amount": {
                  "full": taking.amount.sources.reduce((amount, source) => amount + source.amount.amount, 0),
                  "cash": taking.amount.sources.filter(s => s.typeOfSource.category == "cash")
                    .reduce((amount, source) => amount + source.amount.amount, 0),
                  "extern": taking.amount.sources.filter(s => s.typeOfSource.category == "extern")
                    .reduce((amount, source) => amount + source.amount.amount, 0),
                  "fullDon": taking.amount.sources.filter(s => s.typeOfSource.norms == "DONATION").reduce((amount, source) => amount + source.amount.amount, 0),
                  "donCash": taking.amount.sources.filter(s => s.typeOfSource.norms == "DONATION" && s.typeOfSource.category == "cash").reduce((amount, source) => amount + source.amount.amount, 0),
                  "donExtern": taking.amount.sources.filter(s => s.typeOfSource.norms == "DONATION" && s.typeOfSource.category == "extern").reduce((amount, source) => amount + source.amount.amount, 0),
                  "fullEC":taking.amount.sources.filter(s => s.typeOfSource.norms == "ECONOMIC").reduce((amount, source) => amount + source.amount.amount, 0),
                  "ecCash": taking.amount.sources.filter(s => s.typeOfSource.norms == "ECONOMIC" && s.typeOfSource.category == "cash").reduce((amount, source) => amount + source.amount.amount, 0),
                  "ecExtern": taking.amount.sources.filter(s => s.typeOfSource.norms == "ECONOMIC" && s.typeOfSource.category == "extern").reduce((amount, source) => amount + source.amount.amount, 0),


                },
                "deposited": taking.depositUnits.reduce((categories, unit) => {
                    if(unit.hasOwnProperty("confirmed")) {
                        if(!categories.confirmed.hasOwnProperty(unit.amount.currency)) {
                            categories.confirmed[unit.amount.currency] = 0
                        }
                        categories.confirmed[unit.amount.currency] += unit.amount.amount
                    } else {
                        if(!categories.unconfirmed.hasOwnProperty(unit.amount.currency)) {
                            categories.unconfirmed[unit.amount.currency] = 0
                        }
                        categories.unconfirmed[unit.amount.currency] += unit.amount.amount
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
    sort: (state) => {
        return state.sorting
    },
    count: (state) => {
      return state.count
    }
}

const actions = {

  init (store, query) {
    axios.get('/backend/stream/takings', { params: query })
      .then(function (response){
        store.commit({"type": 'init', "takings": response.data})
      }).catch(function (error) {
        store.commit({"type": 'setError', error: error})
      })
  },


  nextPage (store, query) {
    axios.get('/backend/stream/takings', { params: query })
      .then(function (response){
        store.commit({"type": 'assign', "takings": response.data})
      }).catch(function (error) {
        store.commit({"type": 'setError', error: error})
      })
  },
  count (store, query) {
    axios.get('/backend/stream/takings/count', { params: query })
    .then(function (response) {
      store.commit({'type': 'count', 'count': response.data })
    }).catch(function (error) {
      store.commit({'type': 'setError', error: error})
    })
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
  init(state, payload) {
    state.items = payload.takings
  },
  assign(state, payload) {
    for (var i in payload.takings) {
      state.items.push(payload.takings[i])
    }
  },
  count(state, payload) {
    state.count = payload.count.count
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
    page(state, offset) {
        state.page.offset = offset.offset
    },
    push(state, pushDonation) {
        state.items.push(pushDonation.takings)
    },
    setError(state, payload) {
        state.error = payload.error
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
