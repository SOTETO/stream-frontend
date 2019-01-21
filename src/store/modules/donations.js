const uuidv5 = require('uuid/v5');

// initial state
// shape: [{ id, comment }]
const state = {
    items: [
        { "id": uuidv5('http://pool.vivaconagua.org/stream', uuidv5.URL), "comment": "Super Spende!" }
    ]
}

const getters = {
    all: (state, getters) => {
        return state.items.map(({ id, comment }) => {
            return {
                id: id,
                comment: comment
            }
        })
    }
}


const actions = {
    add ({ state, commit }, donation) {
        commit({ "type": 'push', "comment": donation.comment })
    }
}

const mutations = {
    push(state, pushDonation) {
        state.items.push({
            "id": uuidv5('http://pool.vivaconagua.org/stream', uuidv5.URL),
            "comment": pushDonation.comment
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}