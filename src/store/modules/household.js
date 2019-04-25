import axios from 'axios'
import HouseholdStateMachine from '@/utils/HouseholdPetriNet.js'
import HouseholdPetriNet from "../../utils/HouseholdPetriNet";
const uuidv4 = require('uuid/v4');

const model = {
    isComplete(household) {
        return household.hasOwnProperty("amount") && household.amount.hasOwnProperty("amount") && household.amount.amount > 0 &&
            household.hasOwnProperty("reason") && household.reason.hasOwnProperty("what") &&
            typeof household.reason.what !== "undefined" && household.reason.what !== null && household.reason.what !== "" &&
            household.reason.hasOwnProperty("wherefor") && typeof household.reason.wherefor !== "undefined" &&
            household.reason.wherefor !== null && household.reason.wherefor !== "" &&
            household.hasOwnProperty("iban") && typeof household.iban !== "undefined" && household.iban !== null &&
            household.iban !== "" && household.hasOwnProperty("bic") && typeof household.bic !== "undefined" &&
            household.bic !== null && household.bic !== ""
    }
}

// initial state
// shape: [{
//             "id",
//             "state",
//             "versions": [{
//                  "amount": {
//                      "amount": 0,
//                      "currency": "EUR"
//                  },
//                  "reason": {
//                      "what": "",
//                      "wherefor": ""
//                  },
//                  "iban": "",
//                  "bic": "",
//                  "request": false,
//                  "created": Date,
//                  "updated": Date,
//                  "author": "",
//                  "editor": "",
//                  "volunteerManager": ""
//                  "employee": ""
//              }]
//         }]
const state = {
    items: [],
    page: {
        size: 10,
        offset: 0
    },
    countItems: 0,
    sorting: {
        field: "household.created",
        dir: "ASC"
    },
    filter: {
        'what': "",
        'wherefor': "",
        'amount': {
            "formatted": "",
            "amount": 0.00
        },
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
    all: (state, getters) => {
        return state.items
    },
    overview: (state, getters) => {
        return state.items.map((household) => {
            var stateDescription = household.state.describe()
            var first = household.versions[0]
            var last = household.versions[household.versions.length - 1]
            return {
                "id": household.id,
                "what": last.reason.what,
                "wherefor": last.reason.wherefor,
                "author": household.versions
                    .filter(version => version.hasOwnProperty("author"))    // get the author (usually one!)
                    .map(version => version.author).pop(),
                "amount": household.versions.reduce((amounts, version) => {
                    if(amounts.length === 0 || amounts[amounts.length - 1].amount !== version.amount.amount) {
                        amounts.push(version.amount)
                    }
                    return amounts
                }, []),
                "date": {
                    "created": first.created,
                    "updated": last.updated
                },
                "supporter": household.versions
                    .filter(version => version.hasOwnProperty("author"))    // get the author (usually one!)
                    .map(version => version.author)
                    .concat(
                        household.versions.filter(version => version.hasOwnProperty("editor"))  // get all editors
                            .map(version => version.editor)
                    ).filter((value, index, self) => self.indexOf(value) === index),    // unique! If author === editor
                "state": stateDescription.Household,
                "processing": {
                    "VolunteerManager": stateDescription.VolunteerManager,
                    "Employee": stateDescription.Employee
                }
            }
        })
    },
    byId: (state) => (id) => {
        var entry = state.items.find(household => household.id === id)
        var res = JSON.parse(JSON.stringify(entry.versions[entry.versions.length - 1]))
        if(!res.hasOwnProperty("id")) {
            res["id"] = id
        }
        return res
    },
    stateById: (state) => (id) => {
        var entry = state.items.find(household => household.id === id)
        return entry.state
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
                "attr": "what"
            },
            {
                "obj": state.filter,
                "attr": "wherefor"
            },
            {
                "obj": state.filter.state,
                "attr": "complete"
            },
            {
                "obj": state.filter.state,
                "attr": "repayment"
            },
            {
                "obj": state.filter.state,
                "attr": "volunteerManager"
            },
            {
                "obj": state.filter.state,
                "attr": "employee"
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

function serverDefaultFailure(error, store) {
    switch(error.response.code) {
        case 401:
            store.root.dispatch('user/logout')
            break;
        default:
            store.commit({ "type": 'setError', error: error })
            break;
    }
}

function prepareAjax(copy, descriptiveState, newVersion = null) {
    copy.state = descriptiveState

    if(newVersion !== null) {
        copy.versions.push(newVersion)
    }

    copy.versions.forEach((version) => {
        if(version.hasOwnProperty("id")) {
            delete version.id
        }
    })
    return copy
}

function serverCreate(container, descriptiveState, onSuccess, onFailure, update = false) {
    var copy = JSON.parse(JSON.stringify(container))

    copy = prepareAjax(copy, descriptiveState)

    axios.post("/backend/stream/household/create", copy, { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(response => onSuccess(response.data.data[0]))
        .catch(error => onFailure(error))
}

function serverUpdate(container, descriptiveState, newVersion, onSuccess, onFailure) {
    var copy = JSON.parse(JSON.stringify(container))

    copy = prepareAjax(copy, descriptiveState, newVersion)

    axios.post("/backend/stream/household/update", copy, { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(response => onSuccess(response.data.data[0]))
        .catch(error => onFailure(error))
}

function getJSONFilter(store) {
    var getPetriNetState = (store, json, prefix, attr) => {
        if(store.state.filter.state.hasOwnProperty(attr) && store.state.filter.state[attr] !== "") {
            json[attr] = [{ "name": prefix + "." + store.state.filter.state[attr], "tokens": 1 }]
        }
        return json
    }
    var res =  {}

    if(store.state.filter.hasOwnProperty("what") && store.state.filter.what !== "") {
        res["what"] = store.state.filter.what
    }
    if(store.state.filter.hasOwnProperty("wherefor") && store.state.filter.wherefor !== "") {
        res["wherefor"] = store.state.filter.wherefor
    }
    if(store.state.filter.hasOwnProperty("amount") && store.state.filter.amount.hasOwnProperty("amount") && store.state.filter.amount.amount !== 0.0) {
        res["amount"] = store.state.filter.amount.amount
    }
    res = getPetriNetState(store, res, "ProcessState", "repayment")
    res = getPetriNetState(store, res, "VolunteerManager", "volunteerManager")
    res = getPetriNetState(store, res, "Employee", "employee")

    res["complete"] = {
        'complete': store.state.filter.state.complete === "complete",
        'incomplete': store.state.filter.state.complete === "incomplete"
    }

    return res
}

function serverGet(store) {
    axios.post(
        '/backend/stream/household',
        { 'page': store.state.page, 'sort': store.state.sorting, 'filter': getJSONFilter(store) },
        { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
    ).then(response => {
        var entries = response.data.data
        entries.map(entry => {
            entry.state = HouseholdPetriNet.initFromConfig(entry.state)
            return entry
        })
        store.commit({ "type": 'init', "entries": entries })
    }).catch(error => serverDefaultFailure(error, store))
}

function serverCount(store) {
    axios.post(
        "/backend/stream/household/count",
        { 'page': store.state.page, 'sort': store.state.sorting, 'filter': getJSONFilter(store) },
        { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
    ).then(response => store.commit({"type": 'count', "count": response.data.data}))
        .catch(error => serverDefaultFailure(error, store))
}

/**
 * Calculates an updated version of a household entry that has been identified by its UUID.
 *
 * @author Johann Sell
 * @param store vuex store instance
 * @param household the new version
 * @param role of the person who changed the household entry ("editor", "employee" or "volunteerManager")
 * @param changer function that generates a new state depending of the current state
 * @param dependsOnState a boolean flag that indicates if the new version of the household entry has to be saved only on
 * a successful update of its state
 */
function addVersion(store, household, role, changer, dependsOnState = true) {
    var user = store.rootGetters['user/get']
    household[role] = user.uuid

    var i = store.state.items.findIndex(h => h.id === household.id)
    var element = store.state.items[i]

    var newState = changer(element.state)

    serverUpdate(element, newState.getConfig(), household,
        (result) => store.commit({
            "type": 'update',
            "i": i,
            "householdContainer": element,
            "version": household,
            "state": newState,
            "dependsOnState": dependsOnState
        }),
        (error) => serverDefaultFailure(error, store)
    )
}

const actions = {
    init (store) {
        serverCount(store)
        serverGet(store)
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
            serverCount(store)
            serverGet(store)
        }
    },
    filter (store, filter) {
        store.commit({ "type": "filter", "filter": filter })
        serverCount(store)
        serverGet(store)
    },
    sort (store, sorting) {
        store.commit({ "type": "sort", "sort": sorting })
        serverCount(store)
        serverGet(store)
    },
    add (store, household) {
        var user = store.rootGetters['user/get']
        household["author"] = user.uuid
        var s = HouseholdPetriNet.init(model.isComplete(household))
        if(household.request) {
            s = s.execute("request")
        } else {
            s = s.execute("apply")
        }

        var id = uuidv4()
        household["id"] = id
        var init = {
            "id": id,
            "state": s,
            "versions": [
                household
            ]
        }

        serverCreate(init, init.state.getConfig(),
            (result) => store.commit({ "type": 'push', "household": init }),
            (error) => serverDefaultFailure(error, store)
        )
    },
    update (store, household) {
        addVersion(store, household, "editor", (state) => {
            var newState = state
            if(household.request && state.isAppliedFor()) {
                newState = state.execute("request")
            } else if(!household.request && state.isRequest()) {
                newState = state.execute("apply")
            }
            if(model.isComplete(household)) {
                newState = newState.complete()
            } else {
                newState = newState.incomplete()
            }
            return newState
        }, false)
    },
    isKnown(store, household) {
        addVersion(store, household, "volunteerManager", (state) => state.execute("isKnown"))
    },
    isUnknown(store, household) {
        addVersion(store, household, "volunteerManager", (state) => state.execute("isUnknown"))
    },
    free(store, household) {
        addVersion(store, household, "employee", (state) => {
            var newState = state.execute("free")
            if(state.equals(newState)) {
                newState = state.execute("approve")
            }
            return newState
        })
    },
    block(store, household) {
        addVersion(store, household, "employee", (state) => state.execute("block"))
    },
    requestRepayment(store, household) {
        addVersion(store, household, "employee", (state) => state.execute("requestPayment"))
    },
    repay(store, household) {
        addVersion(store, household, "employee", (state) => state.execute("repay"))
    }

}

const mutations = {
    filter(state, filter) {
        state.filter = filter.filter
    },
    sort(state, sort) {
        state.sorting = sort.sort
    },
    count(state, count) {
        state.countItems = count.count.count
    },
    init(state, initHousehold) {
        state.items = initHousehold["entries"]
    },
    page(state, offset) {
        state.page.offset = offset.offset
    },
    push(state, pushHousehold) {
        state.items.push(pushHousehold.household)
    },
    update(state, container) {
        if(!container.dependsOnState) {
            container.householdContainer.versions.push(container.version)
        }
        if(typeof container.state !== "undefined" && container.state !== null) {
            container.householdContainer.state = container.state
            if(container.dependsOnState) {
                container.householdContainer.versions.push(container.version)
            }
        }
        state.items.splice(container.i, 1, container.householdContainer)
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