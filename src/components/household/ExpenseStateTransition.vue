<template>
    <div>
        <button
                v-if="isApproved && isAuthorOrEditor"
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('requestPayment')"
                @click="startRequestRepayment">
            {{ $t("household.transitions.Owner.requestPayment") }}
        </button>
        <button
                v-if="isVolunteerManager"
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('isKnown')"
                @click="markAsKnown">
            {{ $t("household.transitions.VolunteerManager.knows") }}
        </button>
        <button
                v-if="isVolunteerManager"
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('isUnknown')"
                @click="markAsUnknown">
            {{ $t("household.transitions.VolunteerManager.knowsNothing") }}
        </button>
        <button
                v-if="isEmployee"
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('free') && !allowedRequestChange('approve')"
                @click="markAsFreed">
            {{ $t("household.transitions.Employee.free") }}
        </button>
        <button
                v-if="isEmployee"
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('block')"
                @click="markAsBlocked">
            {{ $t("household.transitions.Employee.block") }}
        </button>
        <button
                v-if="isEmployee"
                class="vca-button-primary vca-full-width"
                :disabled="!allowedRequestChange('repay')"
                @click="markAsRepaid">
            {{ $t("household.transitions.Employee.repay") }}
        </button>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: "ExpenseStateTransition",
        props: {
            "uuid": {
                "type": String,
                "required": true
            }
        },
        computed: {
            ...mapGetters('household', {
                isApprovedState: 'isApproved',
                allowedAction: 'allowedAction',
                byId: 'byId'
            }),
            ...mapGetters('user', {
                isEmployee: 'isEmployee',
                isVolunteerManager: 'isVolunteerManager',
                canRequestRepayment: 'isAuthorOrEditor'
            }),
            isAuthorOrEditor () {
                return this.canRequestRepayment([this.expense.author, this.expense.editor])
            },
            isApproved () {
                return this.isApprovedState(this.uuid)
            },
            expense () {
                return this.byId(this.uuid)
            }
        },
        methods: {
            ...mapActions('household', [
                'isKnown', 'isUnknown', 'free', 'block', 'requestRepayment', 'repay' // -> this.foo()
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
            markAsRepaid() {
                this.repay(this.expense)
            },
            allowedRequestChange (action) {
                // var res = true
                // var state = this.stateById(this.uuid)
                // res = state.allowedTo(action)
                return this.allowedAction(this.uuid, action)
            }
        }
    }
</script>

<style scoped>

</style>