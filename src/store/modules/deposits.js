import DepositEndpoints from '@/backend-endpoints/DepositEndpoints'
import DonationEndpoints from '@/backend-endpoints/DonationEndpoints'

//const uuidv4 = require('uuid/v4');

// initial state
// shape: [{
//             "publicId": UUID
//             "full": {
//                  "amount": Double,
//                  "currency": String
//             },
//             "confirmed": Long,
//             "crew": UUID,
//             "supporter": UUID,
//             "created": Long,
//             "updated": Long,
//             "dateOfDeposit": Long,
//             "amount": [{
//                  "publicId": UUID,
//                  "confirmed": Long,
//                  "donationId": UUID,
//                  "amount": Double,
//                  "currency": String, 
//                  "created": Long
//             }]
//         }]
const state = {
  items: [], 
  donations: [],
  page: {
    size: 10,
    offset: 0
  },
  countItems: 0,
  sorting: {
    field: "deposit.created",
    dir: "DESC"
  },
  'filter': {
    'publicId': null,
    'takingsId': null,
    'crew': null,
    'state': {
                        'complete': "noSelection",
                        'repayment': "",
                        'volunteerManager': "",
                        'employee': ""
                    }
  },
  error: null
}

const getters = {
  all: (state) => {
    return state.items
  },
  overview: (state) => {
    return state.items.map((deposit) => {
        var status = "unconfirmed"
        if(deposit.hasOwnProperty("confirmed")) {
            status = deposit.confirmed
        }
      return {
        "id": deposit.publicId,
        "amount": deposit.full,
        "date": {
          "received": deposit.dateOfDeposit,
          "created": deposit.created,
        },
        "actions": deposit.amount,
        "crew": deposit.crew,
        "supporter": [deposit.supporter],
        "status": status
      }
    })
  }, 
  donationName: (state) => (donationId) => {
      var name = null
      var donation = state.donations.find(d => d.id === donationId)
      if(typeof donation !== "undefined" && donation !== null) {
          name = donation.context.description
      }
      return name
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
        "attr": "takingsId"
      },
      {
        "obj": state.filter,
        "attr": "crew"
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
        var ajax = new DepositEndpoints(store)
        var ajaxDons = new DonationEndpoints(store)
    
        var count = (store) => {
            var successHandler = (response) => store.commit({"type": 'count', "count": response.data.data})
            var errorHandler = (error) => store.commit({"type": 'setError', error: error})
            var page = store.state.page
            var sort = store.state.sorting
            ajax.count(successHandler, errorHandler, page, sort)
        }
    
        var get = (store) => {
            var successHandler = (response) => {
                store.commit({"type": 'init', "deposits": response.data.data})
                ajaxDons.getByIds(
                    (response) => store.commit({"type": 'initDons', "donations": response.data.data}),
                    (error) => store.commit({"type": 'setError', error: error}),
                    response.data.data.reduce((acc, deposit) => acc.concat(deposit.amount.map(unit => unit.donationId)), [])
                )
            }
            var errorHandler = (error) => store.commit({"type": 'setError', error: error})
            var page = store.state.page
            var sort = store.state.sorting
            var filter = store.state.filter
            ajax.get(successHandler, errorHandler, page, sort, filter)
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
    filter: (state) => {
        return JSON.parse(JSON.stringify(state.filter))
    },

    add (store, deposit) {
    //get the current user
    var user = store.rootGetters['user/get']
    var crew = store.rootGetters['user/getCrew']
    //deposit["publicId"] = uuidv4()
    deposit["crew"] = crew // hopefully not undefined
    deposit["supporter"] = user.uuid
    deposit["created"] = Date.now()
    deposit["updated"] = Date.now()

    var amount = deposit.depositUnits.map((unit) => {
        return {
            //"publicId": uuidv4(),
            "takingId": unit.donation,
            "amount": unit.deposit.amount,
            "currency": unit.deposit.currency,  
            "created": Date.now()
        }
    })
    deposit["amount"] = JSON.parse(JSON.stringify(amount))
    delete deposit.depositUnits
      
    //post deposit
      var ajax = new DepositEndpoints(store)
      var successHandler = (response) => {
        store.commit({ "type": 'push', "deposit": response.data })
        store.dispatch('donations/init', null, { root: true })
      }
      var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
      ajax.save(successHandler, errorHandler, deposit)
  },
    confirm (store, deposit) {
        var ajax = new DepositEndpoints(store)
        var successHandler = () => store.dispatch('init')
        var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
        ajax.confirm(successHandler, errorHandler, deposit)
    }
}

const mutations = {
    init(state, pushDeposit) {
        state.items = pushDeposit.deposits
    },
    initDons(state, pushDonations) {
        state.donations = pushDonations.donations
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
    push(state, pushDeposit) {
        state.items.push(pushDeposit.deposit)
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
