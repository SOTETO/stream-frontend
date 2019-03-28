<template>
    <tbody class="expense">
        <tr class="details-table">
            <td>
                <StateLight v-model="what" :color-disabled-on-no-error="true" /><br />
                <button
                        class="vca-button-inline"
                        @click="editState(expense)"
                >{{ $t("household.buttons.edit") }}</button>
            </td>
            <td><StateLight v-model="wherefor" :color-disabled-on-no-error="true" /></td>
            <td><Tag :crew="true" :uuid="expense.author" /></td>
            <td  class="vca-amount-wrapper">
                    <span class="vca-amount">
                        {{ formatAmount(expense.amount[expense.amount.length - 1]) }}
                    </span>
                <div class="vca-amount-previous">
                        <span v-if="expense.amount.length > 1" class="vca-amount">
                            {{ formatAmount(expense.amount[expense.amount.length - 2]) }}
                        </span>
                    <span v-if="expense.amount.length > 2" class="vca-amount">...</span>
                </div>
            </td>
            <td><Tag v-for="uuid in expense.supporter" :key="uuid" :uuid="uuid" /></td>
            <td>
                <div class="states">
                    <RoleDependentStateLight v-for="state in cleanStates" :key="'exp.' + state.name" :value="formatStateNames('household.states.', state)" />
                </div>
            </td>
            <td class="process">
                <div class="labeled">
                    <span>{{ $t("household.process.VolunteerManager.RoleName") }}</span>
                    <div class="states">
                        <RoleDependentStateLight v-for="state in expense.processing.VolunteerManager" :key="'vm.' + state.name" :value="formatStateNames('household.process.VolunteerManager.', state)" />
                    </div>
                </div>
                <div class="labeled">
                    <span>{{ $t("household.process.Employee.RoleName") }}</span>
                    <div class="states">
                        <RoleDependentStateLight v-for="state in expense.processing.Employee" :key="'em.' + state.name" :value="formatStateNames('household.process.Employee.', state)" />
                    </div>
                </div>
            </td>
        </tr>
        <tr class="details-row">
            <td colspan="7">
                <div class="dates">
                    <span>{{ $t("household.hints.dates.created", { "date":  $d(new Date(expense.date.created), "short") }) }}</span>
                    <span v-if="expense.date.created !== expense.date.updated">
                            {{ $t("household.hints.dates.updated", { "date":  $d(new Date(expense.date.created), "short") }) }}
                        </span>
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { Tag } from 'vca-widget-user'
    import StateLight from './StateLight'
    import RoleDependentStateLight from './RoleDependentStateLight'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "ExpenseListEntry",
        components: { Tag, StateLight, RoleDependentStateLight },
        props: {
            "expense": {
                "type": Object,
                "required": true
            }
        },
        computed: {
            ...mapGetters('user', {
                hasRole: 'is'
            }),
            what () {
                var res = { "name": this.expense.what, "state": 1 }
                if(typeof res.name === "undefined" || res.name === null || res.name === "") {
                    res.name = this.$t("household.hints.reason.what.missing")
                    res.state = 0
                }
                return res
            },
            wherefor () {
                var res = { "name": this.expense.wherefor, "state": 1 }
                if(typeof res.name === "undefined" || res.name === null || res.name === "") {
                    res.name = this.$t("household.hints.reason.wherefor.missing")
                    res.state = 0
                }
                return res
            },
            cleanStates () {
                var paid = this.expense.state.find(state => state.name === "Repaid")
                var res = this.expense.state
                if(typeof paid !== "undefined" && paid !== -1 && paid !== null) {
                    res = this.expense.state.filter(state =>
                        state.name !== "HouseholdComplete" && state.name !== "NotEditable"
                    )
                }
                res = this.expense.state.filter(state =>
                    state.name !== "HouseholdComplete" || (
                        (state.attentionLights.Supporter === 0 && !this.hasRole(["Employee", "VolunteerManager"])) ||
                        (state.attentionLights.Employee === 0 && this.hasRole(["Employee"])) ||
                        (state.attentionLights.VolunteerManager === 0 && this.hasRole(["VolunteerManager"]))
                    )
                )
                return res
            }
        },
        methods: {
            formatAmount (amount) {
                var formatter = CurrencyFormatter.getFromNumeric(amount.currency, amount.amount)
                return formatter.localize()
            },
            formatStateNames (prefix, state) {
                var copy = JSON.parse(JSON.stringify(state))
                copy.name = this.$t(prefix + state.name)
                return copy
            },
            editState (expense) {
                this.$emit("vca-edit-expense", expense)
            }
        }
    }
</script>

<style scoped lang="less">
    .expense {
        & .details-table td {
            padding: 0.5em 0.15em 0 0.15em;
        }
        & .details-table td:first-child {
            padding: 0.5em 0.15em 0 0.5em;
        }
        & .details-table td:last-child {
            padding: 0.5em 0.5em 0 0.15em;
        }
        & .details-row td {
            padding: 0 0.5em 0.5em 0.5em;
        }
        & td {
            vertical-align: top;
        }
    }
    .dates {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        & span {
            margin-left: 0.5em;
        }
        padding: 0.2em;
        font-size: 0.8em;
    }
    .vca-amount-wrapper {
        .vca-amount:not(:first-child) {
            margin-left: 0.2em
        }
        .vca-amount-previous {
            color: #8a8a8a;
        }
    }

    .process {
        .labeled {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            & .states {
                width: 60%;
                &:not(:last-child) {
                    margin-bottom: 0.3em;
                }
            }
            &:not(:last-child) {
                margin-bottom: 0.3em;
            }
        }
    }

    .states {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        & /deep/ span:not(:last-child) {
            margin-bottom: 0.3em;
        }
    }
</style>