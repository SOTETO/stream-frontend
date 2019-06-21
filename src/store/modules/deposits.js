import DepositEndpoints from '@/backend-endpoints/DepositEndpoints'

const uuidv4 = require('uuid/v4');

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
//                  "created": Long
//             }]
//         }]
const state = {
  items: [],
  error: null
}

const getters = {
  all: (state) => {
    return state.items
  },
  overview: (state) => {
    return state.items.map((deposit) => {
      return {
        "id": deposit.id,
        "amount": "TODO",
        "date": {
          "received": "TODO",
          "created": "TODO",
        },
        "author": "TODO",
        "supporter": "TODO",
        "status": "TODO"
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
  }
}

const actions = {
  init (store) {
      var ajax = new DepositEndpoints(store)
      var successHandler = (response) => store.commit({ "type": 'init', "donations": response.data.data })
      var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
      ajax.get(successHandler, errorHandler)
  },
  add (store, deposit) {
    //get the current user
    var user = store.rootGetters['user/get']
    var crew = store.rootGetters['user/getCrew']
    deposit["publicId"] = uuidv4()
    deposit["crew"] = crew // hopefully not undefined
    deposit["supporter"] = user.uuid
    deposit["created"] = Date.now()
    deposit["updated"] = Date.now()

    var amount = deposit.depositUnits.map((unit) => {
        return {
            "publicId": uuidv4(),
            "donationId": unit.donation,
            "amount": unit.deposit.amount,
            "currency": unit.deposit.currency,  
            "created": Date.now()
        }
    })
    deposit["amount"] = JSON.parse(JSON.stringify(amount))
    delete deposit.depositUnits
      
    //post deposit
      var ajax = new DepositEndpoints(store)
      var successHandler = (response) => store.commit({ "type": 'push', "deposit": response.data })
      var errorHandler = (error) => store.commit({ "type": 'setError', error: error })
      ajax.save(successHandler, errorHandler, deposit)
  }
  //add (store, deposit) {
  //  "TODO"
  //}
}

const mutations = {
    init(state, pushDeposit) {
        state.items = pushDeposit.deposit
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
