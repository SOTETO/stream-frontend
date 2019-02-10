<template>
    <div>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('Owner', 'RequestRepayment')"
                @click="requestRepayment">
            {{ $t("household.transitions.Owner.requestPayment") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('VolunteerManager', 'Knows')"
                @click="markAsKnown">
            {{ $t("household.transitions.VolunteerManager.knows") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('VolunteerManager', 'KnowsNothing')"
                @click="markAsUnknown">
            {{ $t("household.transitions.VolunteerManager.knowsNothing") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('Employee', 'Freed')"
                @click="markAsFreed">
            {{ $t("household.transitions.Employee.free") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('Employee', 'Blocked')"
                @click="markAsBlocked">
            {{ $t("household.transitions.Employee.block") }}
        </button>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: "ExpenseStateTransition",
        props: {
            "expense": {
                "type": Object,
                "required": true
            }
        },
        computed: {
            ...mapGetters('household', {
                stateById: 'stateById'
            }),
        },
        methods: {
            ...mapActions('household', [
                'isKnown', 'isUnknown', 'free', 'block', 'requestRepayment' // -> this.foo()
            ]),
            markAsKnown() {
                this.isKnown(this.expense)
            },
            markAsUnknown() {
                this.isUnknown(this.expense)
            },
            markAsFreed() {
                this.free(this.expense)
            },
            markAsBlocked() {
                this.block(this.expense)
            },
            requestRepayment() {
                this.requestRepayment(this.expense)
            },
            allowedRequestChange (role, action) {
                var res = true
                var state = this.stateById(this.expense.id)
                res = state.isAllowed(role, action)
                return res
            }
        }
    }
</script>

<style scoped>

</style>