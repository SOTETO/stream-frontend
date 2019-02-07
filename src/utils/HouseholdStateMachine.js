export default class HouseholdStateMachine {
    /**
     * Init the HouseholdStateMachine with a state.
     * @author Johann Sell
     * @param currentState Int in the range of [0..5]
     * @param volunteerManager Int in the range of [0..2]
     * @param employee Int in the range of [0..2]
     */
    constructor(currentState, volunteerManager, employee) {
        this.state = currentState
        this.volunteerManager = volunteerManager
        this.employee = employee
    }

    /**
     * Check if something has changed and execute a transformation.
     *
     * @author Johann Sell
     * @param household
     */
    update (household) {
        if(household.hasOwnProperty("request")) {
            if(household.request) {
                this.state = HouseholdStateMachine.States.Requested
            } else {
                this.state = HouseholdStateMachine.States.AppliedFor
            }
        }
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

    isKnown () {
        return this.transform(HouseholdStateMachine.States.VolunteerManager.Knows)
    }

    isUnknown () {
        return this.transform(HouseholdStateMachine.States.VolunteerManager.KnowsNothing)
    }

    free () {
        return this.transform(HouseholdStateMachine.States.Employee.Freed)
    }

    block () {
        return this.transform(HouseholdStateMachine.States.Employee.Blocked)
    }

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

    combiFinder () {
        return HouseholdStateMachine.States.ValidCombinations.find(combi =>
            combi.state === this.state &&
            combi.volunteerManager === this.volunteerManager &&
            combi.employee === this.employee
        )
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
    "apif": {}, // Todo
    "apkf": {}, // Todo
    "apnf": {}, // Todo
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

HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "ani"
HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.Employee.Freed] = "apkf"
HouseholdStateMachine.States.Transitions.aki[HouseholdStateMachine.States.Employee.Blocked] = "rekb"

HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.VolunteerManager.Knows] = "aki"
HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.Employee.Freed] = "apnf"
HouseholdStateMachine.States.Transitions.ani[HouseholdStateMachine.States.Employee.Blocked] = "renb"

HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "rni"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.VolunteerManager.Knows] = "rki"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.Employee.Freed] = "tif"
HouseholdStateMachine.States.Transitions.rii[HouseholdStateMachine.States.Employee.Blocked] = "reib"

HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "rni"
HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.Employee.Freed] = "tkf"
HouseholdStateMachine.States.Transitions.rki[HouseholdStateMachine.States.Employee.Blocked] = "rekb"

HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.VolunteerManager.Knows] = "rki"
HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.Employee.Freed] = "tnf"
HouseholdStateMachine.States.Transitions.rni[HouseholdStateMachine.States.Employee.Blocked] = "renb"

HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.VolunteerManager.Knows] = "apkf"
HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "apnf"
HouseholdStateMachine.States.Transitions.apif[HouseholdStateMachine.States.Employee.Blocked] = "reib"
// TODO: apif + Supporter erbittet Erstattung --> zu erstatten (tif)

HouseholdStateMachine.States.Transitions.apkf[HouseholdStateMachine.States.VolunteerManager.KnowsNothing] = "apnf"
HouseholdStateMachine.States.Transitions.apkf[HouseholdStateMachine.States.Employee.Blocked] = "rekb"
// TODO: apkf + Supporter erbittet Erstattung --> zu erstatten (tkf)

HouseholdStateMachine.States.Transitions.apnf[HouseholdStateMachine.States.VolunteerManager.Knows] = "apkf"
HouseholdStateMachine.States.Transitions.apnf[HouseholdStateMachine.States.Employee.Blocked] = "renb"
// TODO: apnf + Supporter erbittet Erstattung --> zu erstatten (tnf)

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