export default class HouseholdPetriNet {

    /**
     * Initialize a HousholdPetriNet instance by a given state.
     *
     * @author Johann Sell
     * @param initState {Object}
     */
    constructor(initState) {
        this.states = initState
    }

    /**
     * Checks if the other instance of {HouseholdPetriNet} is equivalent to this.
     * @param other {HouseholdPetriNet}
     * @returns {boolean}
     */
    equals (other) {
        var res = other.hasOwnProperty("states")
        if(res) {
            for (var place in this.states) {
                res = res && other.states.hasOwnProperty(place) && this.states[place] === other.states[place]
            }
        }
        return res
    }

    /**
     * Checks if all preconditions are fulfilled to fire a given transition.
     *
     * @author Johann Sell
     * @param transitionName {string}
     * @returns {boolean}
     */
    isAllowed (transitionName) {
        var res = false
        var i = HouseholdPetriNet.indexOf(transitionName)
        if(i > -1) {
            res = true
            for (var source in HouseholdPetriNet.Transitions[i].sources) {
                res = res && this.states.hasOwnProperty(source) &&
                    this.states[source] >= HouseholdPetriNet.Transitions[i].sources[source]
            }
        }
        return res
    }

    /**
     * Fires a transition identified by its given name.
     *
     * @author Johann Sell
     * @param transitionName {string}
     * @returns {HouseholdPetriNet}
     */
    fire (transitionName) {
        var res = this
        var i = HouseholdPetriNet.indexOf(transitionName)
        if(i > -1) {
            var statesCopy = JSON.parse(JSON.stringify(this.states))
            for (var source in HouseholdPetriNet.Transitions[i].sources) {
                if(!statesCopy.hasOwnProperty(source)) {    // should not happen!
                    statesCopy[source] = 0
                }
                statesCopy[source] -= HouseholdPetriNet.Transitions[i].sources[source]
            }
            for (var target in HouseholdPetriNet.Transitions[i].targets) {
                if(!statesCopy.hasOwnProperty(target)) {
                    statesCopy[target] = 0
                }
                statesCopy[target] += HouseholdPetriNet.Transitions[i].targets[target]
            }
            res = new HouseholdPetriNet(statesCopy)
        }
        return res
    }

    /**
     * Execute an action. Checks if the given action has been defined and tries to execute one of the possible transitions
     * of this action. It returns {null} if the action has not been defined, {this} if no transition is possible to fire
     * and a new instance of {HouseholdPetriNet} representing the new state, if a valid transition has been fired.
     *
     * @author Johann Sell
     * @param action {string}
     * @returns {HouseholdPetriNet | null}
     */
    execute (action) {
        var res = null
        if(HouseholdPetriNet.Actions.hasOwnProperty(action)) {
            res = this
            var allowedTransitions = HouseholdPetriNet.Actions[action]
                .filter(transition => this.isAllowed(transition))
            if(allowedTransitions.length > 0) {
                res = this.fire(allowedTransitions[0])
            }
        }
        return res
    }

    /**
     * Checks if any of the transitions of a given action can be fired from the current configuration.
     *
     * @author Johann Sell
     * @param action {String}
     */
    allowedTo (action) {
        var res = false
        if(HouseholdPetriNet.Actions.hasOwnProperty(action)) {
            res = HouseholdPetriNet.Actions[action].reduce(
                (result, transition) => result || this.isAllowed(transition),
                res
            )
        }
        return res
    }

    /**
     * Marks the represented household money entry as complete.
     *
     * @author Johann Sell
     * @returns {HouseholdPetriNet}
     */
    complete() {
        var statesCopy = JSON.parse(JSON.stringify(this.states))
        statesCopy[HouseholdPetriNet.States.ProcessState.HouseholdComplete] = 1
        return new HouseholdPetriNet(statesCopy)
    }

    /**
     * Marks the represented household money entry as incomplete.
     *
     * @author Johann Sell
     * @returns {HouseholdPetriNet}
     */
    incomplete() {
        var statesCopy = JSON.parse(JSON.stringify(this.states))
        statesCopy[HouseholdPetriNet.States.ProcessState.HouseholdComplete] = 0
        return new HouseholdPetriNet(statesCopy)
    }

    /**
     * Checks if the household entry is complete.
     *
     * @author Johann Sell
     * @returns {boolean}
     */
    isComplete () {
        return this.states.hasOwnProperty(HouseholdPetriNet.States.ProcessState.HouseholdComplete) &&
            this.states[HouseholdPetriNet.States.ProcessState.HouseholdComplete] > 0
    }

    /**
     * Generates a readable description of the current state of the Petri Net.
     *
     * @author Johann Sell
     * @returns {Object}
     */
    describe () {
        var res = {}
        for(var role in HouseholdPetriNet.Descriptions) {
            for (var desc in HouseholdPetriNet.Descriptions[role]) {
                for (var state in HouseholdPetriNet.Descriptions[role][desc]) {
                    if (this.states[state] >= HouseholdPetriNet.Descriptions[role][desc][state]) {
                        var description = {
                            "name": desc,
                            "attentionLights": HouseholdPetriNet.DescriptionStates[role][desc]
                        }
                        if(res.hasOwnProperty(role)) {
                            res[role].push(description)
                        } else {
                            res[role] = [description]
                        }
                    }
                }
            }
        }
        if(!res.hasOwnProperty("Household")) {
            res["Household"] = []
        }
        var complete = res.Household.find(state => state.name === "HouseholdComplete")
        if(typeof complete === "undefined" || complete === -1 || complete === null) {
            var description = {
                "name": "HouseholdComplete",
                "attentionLights": {
                    "Supporter": 0,
                    "Employee": 0,
                    "VolunteerManager": 0
                }
            }
            res.Household.push(description)
        }
        return res
    }

    /**
     * Generates a representation that is interpretable by a machine.
     *
     * @author Johann Sell
     * @return { <placePath.placeName>: <countTokens> }
     */
    getConfig () {
        function placeName (placeId) {
            function recursiveSearch(placeId, tree) {
                var res = ""
                for(var layerName in tree) {
                    if(tree[layerName].toString() === placeId) {
                        res = layerName
                    } else if(typeof tree[layerName] === "object") {
                        var suffix = recursiveSearch(placeId, tree[layerName])
                        if(suffix !== "") {
                            res = layerName + "." + suffix
                        }
                    }
                }
                return res
            }
            return recursiveSearch(placeId, HouseholdPetriNet.States)
        }
        var res = []
        for(var placeId in this.states) {
            var name = placeName(placeId)
            if(name !== "") {
                var place = {
                    "name": name,
                    "tokens": this.states[placeId]
                }
                res.push(place)
            } // else: Error, because an invalid place is represented!
        }
        return res
    }

    isAppliedFor () {
        return this.states.hasOwnProperty(HouseholdPetriNet.States.ProcessState.AppliedFor) &&
            this.states[HouseholdPetriNet.States.ProcessState.AppliedFor] >= 1
    }

    isRequest () {
        return this.states.hasOwnProperty(HouseholdPetriNet.States.ProcessState.Requested) &&
            this.states[HouseholdPetriNet.States.ProcessState.Requested] >= 1
    }

    isApproved () {
        return this.states.hasOwnProperty(HouseholdPetriNet.States.ProcessState.Approved) &&
            this.states[HouseholdPetriNet.States.ProcessState.Approved] >= 1
    }

    isEditable () {
        return !this.states.hasOwnProperty(HouseholdPetriNet.States.ProcessState.NotEditable) ||
            this.states[HouseholdPetriNet.States.ProcessState.NotEditable] === 0
    }

    /**
     * Checks if a named transition is defined.
     *
     * @author Johann Sell
     * @param transitionName {string}
     * @returns {Number} either the numeric index of the named transition or -1 if there is no transition with the given name.
     */
    static indexOf (transitionName) {
        return HouseholdPetriNet.Transitions.findIndex(transition => transition.name === transitionName)
    }

    /**
     * Create an instance of {HousholdPetriNet} with a default configuration (default tokens in places).
     *
     * @author Johann Sell
     * @param complete {boolean}
     * @returns {HouseholdPetriNet}
     */
    static init(complete) {
        var state = {}
        state[HouseholdPetriNet.States.ProcessState.Start] = 1
        state[HouseholdPetriNet.States.VolunteerManager.Idle] = 1
        if(complete) {
            state[HouseholdPetriNet.States.ProcessState.HouseholdComplete] = 1
        }
        return new HouseholdPetriNet(state)
    }

    /**
     * Creates an HouseholdPetriNet instance from a given configuration.
     *
     * @author Johann Sell
     * @param config { <placePath.placeName>: <countTokens> }
     * @returns {HouseholdPetriNet}
     */
    static initFromConfig(config) {
        function placeId(placePath) {
            var pathNodes = placePath.split(".")
             return pathNodes.reduce((pathOrId, step) => {
                var res = pathOrId
                if(typeof pathOrId === "object" && pathOrId.hasOwnProperty(step)) {
                    res = pathOrId[step]
                }
                return res
            }, HouseholdPetriNet.States)
        }
        var state = config.reduce((state, place) => {
            var id = placeId(place.name)
            if(typeof id === "number") {
                state[id] = place.tokens
            } // else: Error, because an invalid place is represented!
            return state
        }, {})
        return new HouseholdPetriNet(state)
    }
}

/**
 * Declarative description of all places inside the Petri Net.
 *
 * @author Johann Sell
 * @type {{ProcessState: {Start: number, AppliedFor: number, Requested: number, Refused: {FromRequest: number, FromApplication: number}, Approved: number, Free: number, Repaid: number, HouseholdComplete: number}, VolunteerManager: {Idle: number, Knows: number, KnowsNothing: number}}}
 */
HouseholdPetriNet.States = {
    "ProcessState": {
        "Start": 0,
        "AppliedFor": 1,
        "Requested": 2,
        "Refused": {
            "FromRequest": 3,
            "FromApplication": 4
        },
        "Approved": 5,
        "Free": 6,
        "Repaid": 7,
        "HouseholdComplete": 8,
        "NotEditable": 12
    },
    "VolunteerManager": {
        "Idle": 9,
        "Knows": 10,
        "KnowsNothing": 11
    }
}

/**
 * Declarative description of all possible transitions inside the Petri Net. All transitions need to have a name, sources
 * and targets. The sources and targets are objects containing numeric identifiers for the places as keys and an amount
 * of tokens as a value. If the tokens are consumed or created by the transition, is defined by the semantics of the
 * terms "sources" and "targets".
 *
 * The numeric identifiers of the places result from the declarative description of the places ({HouseholdPetriNet.States}).
 *
 * @author Johann Sell
 * @type {[{name: {String}, sources: {{Number}: {Number}}, targets: {{Number}: {Number}}}]}
 */
HouseholdPetriNet.Transitions = [
    {
        "name": "apply",
        "sources": {
            0: 1
        },
        "targets": {
            1: 1
        }
    },
    {
        "name": "request",
        "sources": {
            0: 1
        },
        "targets": {
            2: 1
        }
    },
    {
        "name": "swap_to_request",
        "sources": {
            1: 1
        },
        "targets": {
            2: 1
        }
    },
    {
        "name": "swap_to_appliedFor",
        "sources": {
            2: 1
        },
        "targets": {
            1: 1
        }
    },
    {
        "name": "block_from_requested",
        "sources": {
            2: 1
        },
        "targets": {
            3: 1
        }
    },
    {
        "name": "block_from_appliedFor",
        "sources": {
            1: 1
        },
        "targets": {
            4: 1
        }
    },
    {
        "name": "block_from_approved",
        "sources": {
            5: 1
        },
        "targets": {
            3: 1
        }
    },
    {
        "name": "block_from_freed",
        "sources": {
            6: 1
        },
        "targets": {
            4: 1
        }
    },
    {
        "name": "approve",
        "sources": {
            2: 1
        },
        "targets": {
            5: 1
        }
    },
    {
        "name": "free",
        "sources": {
            1: 1
        },
        "targets": {
            6: 1
        }
    },
    {
        "name": "approve_from_blocked",
        "sources": {
            3: 1
        },
        "targets": {
            5: 1
        }
    },
    {
        "name": "free_from_blocked",
        "sources": {
            4: 1
        },
        "targets": {
            6: 1
        }
    },
    {
        "name": "request_payment",
        "sources": {
            5: 1
        },
        "targets": {
            6: 1
        }
    },
    {
        "name": "repay",
        "sources": {
            6: 1,
            8: 1
        },
        "targets": {
            7: 1,
            12: 1
        }
    },
    {
        "name": "knows",
        "sources": {
            9: 1
        },
        "targets": {
            10: 1
        }
    },
    {
        "name": "knows_nothing",
        "sources": {
            9: 1
        },
        "targets": {
            11: 1
        }
    },
    {
        "name": "from_knows_to_nothing",
        "sources": {
            10: 1
        },
        "targets": {
            11: 1
        }
    },
    {
        "name": "from_nothing_to_knows",
        "sources": {
            11: 1
        },
        "targets": {
            10: 1
        }
    }
]

/**
 * Declarative description of all possible actions a user is able to execute. Every action is mapped to a set of
 * transitions that are all possible implementations of the requested action.
 *
 * @author Johann Sell
 * @type {{apply: string[], request: string[], free: string[], approve: string[], block: string[], requestPayment: string[], repay: string[], isKnown: string[], isUnknown: string[]}}
 */
HouseholdPetriNet.Actions = {
    "apply": ["apply", "swap_to_appliedFor"],
    "request": ["request", "swap_to_request"],
    "free": ["free", "free_from_blocked"],
    "approve": ["approve", "approve_from_blocked"],
    "block": ["block_from_requested", "block_from_appliedFor", "block_from_approved", "block_from_freed"],
    "requestPayment": ["request_payment"],
    "repay": ["repay"],
    "isKnown": ["knows", "from_nothing_to_knows"],
    "isUnknown": ["knows_nothing", "from_knows_to_nothing"]
}

/**
 * Declarative mapping between places with tokens inside the Petri Net and descriptive labels of the states of different
 * involved process roles.
 *
 * @author Johann Sell
 * @type {{Employee: {Idle: {"0": number, "1": number, "2": number}, Freed: {"5": number, "6": number, "7": number}, Blocked: {"3": number, "4": number}}, VolunteerManager: {Idle: {"9": number}, Knows: {"10": number}, KnowsNothing: {"11": number}}, Household: {Idle: {"0": number}, AppliedFor: {"1": number}, Requested: {"2": number}, Approved: {"5": number}, Refused: {"3": number, "4": number}, ToRepay: {"6": number}, Repaid: {"7": number}}}}
 */
HouseholdPetriNet.Descriptions = {
    "Employee": {
        "Idle": {
            0: 1,
            1: 1,
            2: 1
        },
        "Freed": {
            5: 1,
            6: 1,
            7: 1
        },
        "Blocked": {
            3: 1,
            4: 1
        }
    },
    "VolunteerManager": {
        "Idle": {
            9: 1
        },
        "Knows": {
            10: 1
        },
        "KnowsNothing": {
            11: 1
        }
    },
    "Household": {
        "Idle": {
            0: 1
        },
        "AppliedFor": {
            1: 1
        },
        "Requested": {
            2: 1
        },
        "Approved": {
            5: 1
        },
        "Refused": {
            3: 1,
            4: 1
        },
        "ToRepay": {
            6: 1
        },
        "Repaid": {
            7: 1
        },
        "HouseholdComplete": {
            8: 1
        },
        "NotEditable": {
            12: 1
        }
    }
}

/**
 * Describes for every state description if this state has to become attention (0), is fine / done (1) or if the user
 * has to bear the expense in mind (2). The description depends on the users role.
 * @type {{Employee: {Idle: {Employee: number, VolunteerManager: number, Supporter: number}, Freed: {Employee: number, VolunteerManager: number, Supporter: number}, Blocked: {Employee: number, VolunteerManager: number, Supporter: number}}, VolunteerManager: {Idle: {Employee: number, VolunteerManager: number, Supporter: number}, Knows: {Employee: number, VolunteerManager: number, Supporter: number}, KnowsNothing: {Employee: number, VolunteerManager: number, Supporter: number}}, Household: {Idle: {Employee: number, VolunteerManager: number, Supporter: number}, AppliedFor: {Employee: number, VolunteerManager: number, Supporter: number}, Requested: {Employee: number, VolunteerManager: number, Supporter: number}, Approved: {Employee: number, VolunteerManager: number, Supporter: number}, Refused: {Employee: number, VolunteerManager: number, Supporter: number}, ToRepay: {Employee: number, VolunteerManager: number, Supporter: number}, Repaid: {Employee: number, VolunteerManager: number, Supporter: number}}}}
 */
HouseholdPetriNet.DescriptionStates = {
    "Employee": {
        "Idle": {
            "Employee": 0,
            "VolunteerManager": 2,
            "Supporter": 2
        },
        "Freed": {
            "Employee": 1,
            "VolunteerManager": 1,
            "Supporter": 1
        },
        "Blocked": {
            "Employee": 2,
            "VolunteerManager": 0,
            "Supporter": 0
        }
    },
    "VolunteerManager": {
        "Idle": {
            "Employee": 2,
            "VolunteerManager": 0,
            "Supporter": 2
        },
        "Knows": {
            "Employee": 1,
            "VolunteerManager": 1,
            "Supporter": 1
        },
        "KnowsNothing": {
            "Employee": 0,
            "VolunteerManager": 2,
            "Supporter": 0
        }
    },
    "Household": {
        "Idle": {
            "Employee": 0,
            "VolunteerManager": 0,
            "Supporter": 0
        },
        "AppliedFor": {
            "Employee": 2,
            "VolunteerManager": 2,
            "Supporter": 1
        },
        "Requested": {
            "Employee": 2,
            "VolunteerManager": 2,
            "Supporter": 1
        },
        "Approved": {
            "Employee": 1,
            "VolunteerManager": 1,
            "Supporter": 1
        },
        "Refused": {
            "Employee": 2,
            "VolunteerManager": 2,
            "Supporter": 0
        },
        "ToRepay": {
            "Employee": 0,
            "VolunteerManager": 2,
            "Supporter": 2
        },
        "Repaid": {
            "Employee": 1,
            "VolunteerManager": 1,
            "Supporter": 1
        },
        "HouseholdComplete": {
            "Employee": 1,
            "VolunteerManager": 1,
            "Supporter": 1
        },
        "NotEditable": {
            "Employee": 2,
            "VolunteerManager": 2,
            "Supporter": 2
        }
    }
}