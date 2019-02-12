<template>
    <div>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('requestPayment')"
                @click="startRequestRepayment">
            {{ $t("household.transitions.Owner.requestPayment") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('isKnown')"
                @click="markAsKnown">
            {{ $t("household.transitions.VolunteerManager.knows") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('isUnknown')"
                @click="markAsUnknown">
            {{ $t("household.transitions.VolunteerManager.knowsNothing") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('free') && !allowedRequestChange('approve')"
                @click="markAsFreed">
            {{ $t("household.transitions.Employee.free") }}
        </button>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('block')"
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
            startRequestRepayment() {
                this.requestRepayment(this.expense)
            },
            allowedRequestChange (action) {
                var res = true
                var state = this.stateById(this.expense.id)
                res = state.allowedTo(action)
                return res
            }
        }
    }
</script>

<style scoped>

</style>