import HouseholdPetriNet from "./HouseholdPetriNet";

export default class StateMessageInterpreter {
    /**
     * Generates a readable description of the current state of the Petri Net.
     *
     * @author Johann Sell
     * @returns {Object}
     */
    static describe (messages) {
        var res = {}
        for(var role in StateMessageInterpreter.Descriptions) {
            for (var desc in StateMessageInterpreter.Descriptions[role]) {
                for (var state in StateMessageInterpreter.Descriptions[role][desc]) {
                    var placeMessage = messages.find(place => place.name === state)
                    if (typeof placeMessage === "object" && placeMessage.hasOwnProperty("tokens") &&
                        placeMessage.tokens >= StateMessageInterpreter.Descriptions[role][desc][state]) {
                        var description = {
                            "name": desc,
                            "attentionLights": StateMessageInterpreter.DescriptionStates[role][desc]
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

    static hasState(messages, stateName) {
        return messages.find(place => place.name === stateName) !== -1
    }

    static equals(messages1, messages2) {
        function comparison(first, second) {
            return first.map(place => second.some(p => p.name == place.name && p.tokens == place.tokens))
                .reduce((acc, c) => acc && c, true)
        }
        return comparison(messages1, messages2) && comparison(messages2, messages1)
    }

    static isEditable(messages) {
        var res = true
        var notEditable = messages.find(place => place.name === "NotEditable")
        if(typeof notEditable !== "undefined" && notEditable !== null && notEditable !== -1) {
            res = notEditable.tokens === 0
        }
        return res
    }

    static isApproved(messages) {
        var res = false
        var approved = messages.find(place => place.name === "Approved")
        if(typeof approved !== "undefined" && approved !== null && approved !== -1) {
            res = approved > 0
        }
        return res
    }
}

/**
 * Declarative mapping between places with tokens inside the Petri Net and descriptive labels of the states of different
 * involved process roles.
 *
 * @author Johann Sell
 * @type {{Employee: {Idle: {"0": number, "1": number, "2": number}, Freed: {"5": number, "6": number, "7": number}, Blocked: {"3": number, "4": number}}, VolunteerManager: {Idle: {"9": number}, Knows: {"10": number}, KnowsNothing: {"11": number}}, Household: {Idle: {"0": number}, AppliedFor: {"1": number}, Requested: {"2": number}, Approved: {"5": number}, Refused: {"3": number, "4": number}, ToRepay: {"6": number}, Repaid: {"7": number}}}}
 */
StateMessageInterpreter.Descriptions = {
    "Employee": {
        "Idle": {
            "Start": 1,
            "AppliedFor": 1,
            "Requested": 1
        },
        "Freed": {
            "Approved": 1,
            "Free": 1,
            "Repaid": 1
        },
        "Blocked": {
            "RefusedFromRequest": 1,
            "RefusedFromApplication": 1
        }
    },
    "VolunteerManager": {
        "Idle": {
            "VM.Idle": 1
        },
        "Knows": {
            "VM.Knows": 1
        },
        "KnowsNothing": {
            "VM.KnowsNothing": 1
        }
    },
    "Household": {
        "Idle": {
            "Start": 1
        },
        "AppliedFor": {
            "AppliedFor": 1
        },
        "Requested": {
            "Requested": 1
        },
        "Approved": {
            "Approved": 1
        },
        "Refused": {
            "RefusedFromRequest": 1,
            "RefusedFromApplication": 1
        },
        "ToRepay": {
            "Free": 1
        },
        "Repaid": {
            "Repaid": 1
        },
        "HouseholdComplete": {
            "HouseholdComplete": 1
        },
        "NotEditable": {
            "NotEditable": 1
        }
    }
}

/**
 * Describes for every state description if this state has to become attention (0), is fine / done (1) or if the user
 * has to bear the expense in mind (2). The description depends on the users role.
 * @type {{Employee: {Idle: {Employee: number, VolunteerManager: number, Supporter: number}, Freed: {Employee: number, VolunteerManager: number, Supporter: number}, Blocked: {Employee: number, VolunteerManager: number, Supporter: number}}, VolunteerManager: {Idle: {Employee: number, VolunteerManager: number, Supporter: number}, Knows: {Employee: number, VolunteerManager: number, Supporter: number}, KnowsNothing: {Employee: number, VolunteerManager: number, Supporter: number}}, Household: {Idle: {Employee: number, VolunteerManager: number, Supporter: number}, AppliedFor: {Employee: number, VolunteerManager: number, Supporter: number}, Requested: {Employee: number, VolunteerManager: number, Supporter: number}, Approved: {Employee: number, VolunteerManager: number, Supporter: number}, Refused: {Employee: number, VolunteerManager: number, Supporter: number}, ToRepay: {Employee: number, VolunteerManager: number, Supporter: number}, Repaid: {Employee: number, VolunteerManager: number, Supporter: number}}}}
 */
StateMessageInterpreter.DescriptionStates = {
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