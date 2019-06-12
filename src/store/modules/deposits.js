import axios from 'axios'

//const uuidv4 = require('uuid/v4')

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
    axios.get('/backend/stream/deposits').then(response =>{
      store.commit({"type": 'inti', "deposits": response.data.data })
    }).catch(error => {
      switch(error.response.code) {
        case 401:
          store.root.dispatch('user/logout')
          break;
        default:
          store.commit({ "type": 'setError', error: error})
          break;
      }
    })
  },
  add (store, deposit) {
    //get the current user
    var user = store.rootGetters['user/get']
    //set author
    deposit["author"] = user.uuid
    //post deposit 
    axios.post('/backend/stream/deposit/create', deposit)
      .then(response => { 
        //store response into store
        store.commit({ "type": 'push', "deposit": response.data })
      })
        //catch error
      .catch(error => {
        switch(error.response.code) {
          case 401:
            store.root.dispatch('user/logout')
            break;
          default:
            store.commit({ "type": 'setError', error: error})
            break;
        }
      })
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
