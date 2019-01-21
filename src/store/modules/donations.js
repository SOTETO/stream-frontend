// initial state
// shape: [{ id, comment }]
const state = {
    items: [
        { "id": 1, "comment": "Super Spende!" }
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
        commit({ "type": 'push', "donation": donation })
    }
}

const mutations = {
    push(state, pushDonation) {
        state.items.push(pushDonation.donation)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}