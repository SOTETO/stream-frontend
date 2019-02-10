export default class HouseholdStateMachine {
    /**
     * Init the HouseholdStateMachine with a state.
     * @author Johann Sell
     * @param currentState Int in the range of [0..5]
     * @param volunteerManager Int in the range of [6..8]
     * @param employee Int in the range of [9..11]
     */
    constructor(currentState, volunteerManager, employee) {
        this.state = currentState
        this.volunteerManager = volunteerManager
        this.employee = employee
    }

    /**
     * Check if something has changed and execute a transformation, if needed.
     *
     * @author Johann Sell
     * @param household
     * @returns {HouseholdStateMachine | null}
     */
    update (household) {
        if(household.hasOwnProperty("request")) {
            if(household.request && HouseholdStateMachine.States.AppliedFor === this.state) {
                return this.swapInitState()
            } else if(!household.request && HouseholdStateMachine.States.Requested === this.state) {
                return this.swapInitState()
            }
            return this
        }
        return this
    }

    /**
     * Check if the current combination of states is valid.
     *
     * @author Johann Sell
     * @returns {boolean}
     */
    isValid () {
        var combi = this.combiFinder()
        var result = true // VALID
        if(typeof combi === "undefined") {
            result = false // INVALID
        }
        return result
    }

    /**
     * TRANSITION: Volunteer manager marks as known
     * @author Johann Sell
     * @returns {HouseholdStateMachine | null}
     */
    isKnown () {
        return this.transform(HouseholdStateMachine.States.VolunteerManager.Knows)
    }

    /**
     * TRANSITION: Volunteer manager marks as unknown
     * @author Johann Sell
     * @returns {HouseholdStateMachine | null}
     */
    isUnknown () {
        return this.transform(HouseholdStateMachine.States.VolunteerManager.KnowsNothing)
    }

    /**
     * TRANSITION: Employee frees the request / application
     * @author Johann Sell
     * @returns {HouseholdStateMachine | null}
     */
    free () {
        return this.transform(HouseholdStateMachine.States.Employee.Freed)
    }

    /**
     * TRANSITION: Employee blocks the request / application
     * @author Johann Sell
     * @returns {HouseholdStateMachine | null}
     */
    block () {
        return this.transform(HouseholdStateMachine.States.Employee.Blocked)
    }

    /**
     * TRANSITION: Owner requests repayment (if state is approved)
     * @author Johann Sell
     * @returns {HouseholdStateMachine | null}
     */
    requestRepayment () {
        return this.transform(HouseholdStateMachine.States.Owner.RequestRepayment)
    }

    /**
     * TRANSITION: Owner switches from "appliedFor" state to "requested" state or the other way around
     * @author Johann Sell
     * @returns {HouseholdStateMachine | null}
     */
    swapInitState () {
        return this.transform(HouseholdStateMachine.States.Owner.SwapInitState)
    }

    /**
     * Executes the transformation from one valid state into another.
     *
     * @author Johann Sell
     * @param arc {number} a new state for volunteer manager, employee or one of the transition trigger states of the owner
     * @returns {HouseholdStateMachine | null}
     */
    transform (arc) {
        if(this.isValid()) {
            var combi = this.combiFinder()
            if(typeof combi !== "undefined") {
                var targetName = HouseholdStateMachine.States.Transitions[combi.name][arc]
                var targetState = HouseholdStateMachine.States.ValidCombinations.find(combi => combi.name === targetName)
                if(typeof targetState !== "undefined") {
                    return new HouseholdStateMachine(targetState.state, targetState.volunteerManager, targetState.employee)
                } else {
                    // invalid target!
                    return null
                }
            } else {
                // arc not allowed!
                return null
            }
        }
    }

    /**
     * Checks, if there exists an arc in the state machine outgoing of the current state.
     *
     * @author Johann Sell
     * @param role {String}
     * @param action {String}
     * @returns {boolean}
     */
    isAllowed(role, action) {
        var combi = this.combiFinder()
        var arc = HouseholdStateMachine.getArc(role, action)
        var res = false
        if(typeof combi !== "undefined" && arc != -1) {
            res = HouseholdStateMachine.States.Transitions[combi.name].hasOwnProperty(arc)
        }
        return res
    }

    /**
     * Get the state of a given role.
     *
     * @author Johann Sell
     * @param role {string}
     * @returns {string}
     */
    getFor (role) {
        var res = "Unknown"
        var s = -1
        switch (role) {
            case "VolunteerManager":
                s = this.volunteerManager
                break;
            case "Employee":
                s = this.employee
                break;
        }
        if(HouseholdStateMachine.States.hasOwnProperty(role)) {
            var states = HouseholdStateMachine.States[role]
            for(var key in states) {
                if(states[key] === s) {
                    res = key
                }
            }
        }
        return res
    }

    /**
     * Get the state of the household entry.
     *
     * @author Johann Sell
     * @returns {string}
     */
    get () {
        var res = "Unknown"
        for (var key in HouseholdStateMachine.States) {
            if(HouseholdStateMachine.States[key] === this.state) {
                res = key
            }
        }
        return res
    }

    /**
     * Finds the valid combination that represents the current instance or returns "undefined", if the instance is invalid.
     * @author Johann Sell
     * @returns {T | undefined}
     */
    combiFinder () {
        return HouseholdStateMachine.States.ValidCombinations.find(combi =>
            combi.state === this.state &&
            combi.volunteerManager === this.volunteerManager &&
            combi.employee === this.employee
        )
    }

    /**
     * Returns the arc in our state machine that represents the given role and action.
     *
     * @author Johann Sell
     * @param role {String}
     * @param action {String}
     * @returns {number}
     */
    static getArc(role, action) {
        var res = -1
        if(HouseholdStateMachine.States.hasOwnProperty(role) &&
            HouseholdStateMachine.States[role].hasOwnProperty(action)) {
            res = HouseholdStateMachine.States[role][action]
        }
        return res
    }

    /**
     * Instanciates the HouseholdStateMachine by a given Household object.
     * @author Johann Sell
     * @param household
     */
    static init(household) {
        var state = HouseholdStateMachine.States.AppliedFor
        if(household.hasOwnProperty("request") && household.request) {
            state = HouseholdStateMachine.States.Requested
        }
        return new HouseholdStateMachine(
            state, HouseholdStateMachine.States.VolunteerManager.Idle, HouseholdStateMachine.States.Employee.Idle
        )
    }
}

HouseholdStateMachine.States = {
    "AppliedFor": 0,
    "Requested": 1,
    "Approved": 2,
    "ToRepay": 3,
    "Repaid": 4,
    "Refused": 5,
    "VolunteerManager": {
        "Idle": 6,
        "KnowsNothing": 7,
        "Knows": 8
    },
    "Employee": {
        "Idle": 9,
        "Freed": 10,
        "Blocked": 11
    },
    "Owner": {
        "RequestRepayment": 12,
        "SwapInitState": 13
    }
}

HouseholdStateMachine.States.ValidCombinations = [
    {
        "name": "aii", // appliedFor - idle - idle
        "state": HouseholdStateMachine.States.AppliedFor,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Idle,
        "employee": HouseholdStateMachine.States.Employee.Idle
    },
    {
        "name": "aki", // appliedFor - knows - idle
        "state": HouseholdStateMachine.States.AppliedFor,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Knows,
        "employee": HouseholdStateMachine.States.Employee.Idle
    },
    {
        "name": "ani", // appliedFor - knows nothing - idle
        "state": HouseholdStateMachine.States.AppliedFor,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.KnowsNothing,
        "employee": HouseholdStateMachine.States.Employee.Idle
    },
    {
        "name": "rii", // requested - idle - idle
        "state": HouseholdStateMachine.States.Requested,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Idle,
        "employee": HouseholdStateMachine.States.Employee.Idle
    },
    {
        "name": "rki", // requested - knows - idle
        "state": HouseholdStateMachine.States.Requested,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Knows,
        "employee": HouseholdStateMachine.States.Employee.Idle
    },
    {
        "name": "rni", // requested - knows nothing - idle
        "state": HouseholdStateMachine.States.Requested,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.KnowsNothing,
        "employee": HouseholdStateMachine.States.Employee.Idle
    },
    {
        "name": "apif", // approved - idle - freed
        "state": HouseholdStateMachine.States.Approved,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Idle,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "apkf", // approved - knows - freed
        "state": HouseholdStateMachine.States.Approved,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Knows,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "apnf", // approved - knows nothing - freed
        "state": HouseholdStateMachine.States.Approved,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.KnowsNothing,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "tif", // to repay - idle - freed
        "state": HouseholdStateMachine.States.ToRepay,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Idle,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "tkf", // to repay - knows - freed
        "state": HouseholdStateMachine.States.ToRepay,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Knows,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "tnf", // to repay - knows nothing - freed
        "state": HouseholdStateMachine.States.ToRepay,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.KnowsNothing,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "rif", // repaid - idle - freed
        "state": HouseholdStateMachine.States.Repaid,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Idle,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "rkf", // repaid - knows - freed
        "state": HouseholdStateMachine.States.Repaid,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Knows,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "rnf", // repaid - knows nothing - freed
        "state": HouseholdStateMachine.States.Repaid,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.KnowsNothing,
        "employee": HouseholdStateMachine.States.Employee.Freed
    },
    {
        "name": "reib", // refused - idle - blocked
        "state": HouseholdStateMachine.States.Refused,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Idle,
        "employee": HouseholdStateMachine.States.Employee.Blocked
    },
    {
        "name": "rekb", // refused - knows - blocked
        "state": HouseholdStateMachine.States.Refused,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.Knows,
        "employee": HouseholdStateMachine.States.Employee.Blocked
    },
    {
        "name": "renb", // refused - knows nothing - blocked
        "state": HouseholdStateMachine.States.Refused,
        "volunteerManager": HouseholdStateMachine.States.VolunteerManager.KnowsNothing,
        "employee": HouseholdStateMachine.States.Employee.Blocked
    }
]

HouseholdStateMachine.States.Transitions = {
    "aii": {},
    "aki": {},
    "ani": {},
    "rii": {},
    "rki": {},
    "rni": {},
    "apif": {},
    "apkf": {},
    "apnf": {},
    "tif": {},
    "tkf": {},
    "tnf": {},
    "rif": {},
    "rkf": {},
    "rnf": {},
    "reib": {},
    "rekb": {},
    "renb": {}
}


// All possible transitions inside the state graph:
HouseholdStateMachine.States.Transitions.aii[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "ani"
HouseholdStateMachine.States.Transitions.aii[HouseholdStateMachine.States.VolunteerManager.Knows] = "aki"
HouseholdStateMachine.States.Transitions.aii[HouseholdStateMachine.States.Employee.Freed] = "apif"
HouseholdStateMachine.States.Transitions.aii[HouseholdStateMachine.States.Employee.Blocked] = "reib"
HouseholdStateMachine.States.Transitions.aii[HouseholdStateMachine.States.Owner.SwapInitState] = "rii"

HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "ani"
HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.Employee.Freed] = "apkf"
HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.Employee.Blocked] = "rekb"
HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.Owner.SwapInitState] = "rki"

HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.VolunteerManager.Knows] = "aki"
HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.Employee.Freed] = "apnf"
HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.Employee.Blocked] = "renb"
HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.Owner.SwapInitState] = "rni"

HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "rni"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.VolunteerManager.Knows] = "rki"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.Employee.Freed] = "tif"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.Employee.Blocked] = "reib"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.Owner.SwapInitState] = "aii"

HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "rni"
HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.Employee.Freed] = "tkf"
HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.Employee.Blocked] = "rekb"
HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.Owner.SwapInitState] = "aki"

HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.VolunteerManager.Knows] = "rki"
HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.Employee.Freed] = "tnf"
HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.Employee.Blocked] = "renb"
HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.Owner.SwapInitState] = "ani"

HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.VolunteerManager.Knows] = "apkf"
HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "apnf"
HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.Employee.Blocked] = "reib"
HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.Owner.RequestRepayment] = "tif"

HouseholdStateMachine.States.Transitions.apkf[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "apnf"
HouseholdStateMachine.States.Transitions.apkf[HouseholdStateMachine.States.Employee.Blocked] = "rekb"
HouseholdStateMachine.States.Transitions.apkf[HouseholdStateMachine.States.Owner.RequestRepayment] = "tkf"

HouseholdStateMachine.States.Transitions.apnf[HouseholdStateMachine.States.VolunteerManager.Knows] = "apkf"
HouseholdStateMachine.States.Transitions.apnf[HouseholdStateMachine.States.Employee.Blocked] = "renb"
HouseholdStateMachine.States.Transitions.apnf[HouseholdStateMachine.States.Owner.RequestRepayment] = "tnf"

HouseholdStateMachine.States.Transitions.tif[HouseholdStateMachine.States.VolunteerManager.Knows] = "tkf"
HouseholdStateMachine.States.Transitions.tif[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "tnf"
HouseholdStateMachine.States.Transitions.tif[HouseholdStateMachine.States.Employee.Blocked] = "reib"

HouseholdStateMachine.States.Transitions.tkf[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "tnf"
HouseholdStateMachine.States.Transitions.tkf[HouseholdStateMachine.States.Employee.Blocked] = "rekb"

HouseholdStateMachine.States.Transitions.tnf[HouseholdStateMachine.States.VolunteerManager.Knows] = "tkf"
HouseholdStateMachine.States.Transitions.tnf[HouseholdStateMachine.States.Employee.Blocked] = "renb"

HouseholdStateMachine.States.Transitions.rif[HouseholdStateMachine.States.VolunteerManager.Knows] = "rkf"
HouseholdStateMachine.States.Transitions.rif[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "rnf"

HouseholdStateMachine.States.Transitions.rkf[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "rnf"

HouseholdStateMachine.States.Transitions.rnf[HouseholdStateMachine.States.VolunteerManager.Knows] = "rkf"

HouseholdStateMachine.States.Transitions.reib[HouseholdStateMachine.States.VolunteerManager.Knows] = "rekb"
HouseholdStateMachine.States.Transitions.reib[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "renb"
HouseholdStateMachine.States.Transitions.reib[HouseholdStateMachine.States.Employee.Freed] = "tif"

HouseholdStateMachine.States.Transitions.rekb[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "renb"
HouseholdStateMachine.States.Transitions.rekb[HouseholdStateMachine.States.Employee.Freed] = "tkf"

HouseholdStateMachine.States.Transitions.renb[HouseholdStateMachine.States.VolunteerManager.Knows] = "rekb"
HouseholdStateMachine.States.Transitions.renb[HouseholdStateMachine.States.Employee.Freed] = "tnf"