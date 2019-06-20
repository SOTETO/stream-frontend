<template>
    <div class="assignment">
        <span class="name">{{ label }}</span>
        <MoneyInput
                :numeric="amount.amount"
                :currency="currency"
                :rules="rules.amount"
                @input="commit"
                @vca-money-validationError="onError" />
    </div>
</template>

<script>
    import { FormItem } from 'element-ui'
    import MoneyInput from '@/components/utils/MoneyInput'
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: "DonationDepositAssignment",
        components: {
            "el-form-item": FormItem,
            "MoneyInput": MoneyInput
        },
        props: {
            "id": {
                "type": String,
                "required": true
            },
            "label": {
                "type": String,
                "required": true
            },
            "max": {
                "type": Number,
                "required": true
            },
            "currency": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["EUR", "USD", "CHF"].indexOf(value) !== -1
                }
            }
        },
        data () {
            return {
                "amount": {
                    "amount": 0,
                    "currency": this.currency
                },
                "rules": {
                    "amount": [
                        {
                            "validator": (numericValue) =>
                                numericValue === null || (typeof numericValue === "undefined") || numericValue === 0,
                            "msg": this.$t("deposit.errors.noValueForAssignedDonation")
                        },
                        {
                            "validator": (numericValue) =>
                                numericValue > this.max,
                            "msg": this.$t("deposit.errors.valueForAssignedDonationOutOfRange")
                        }
                    ]
                }
            }
        },
        methods: {
            commit(value) {
                this.amount = value
                this.$emit('vca-add-depositUnit', {
                    "deposit": this.amount,
                    "donation": this.id
                })
            },
            onError() {
                this.$emit('vca-remove-depositUnit', this.amount)
            }
        }
    }
</script>

<style scoped lang="less">
.assignment {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .name {
        padding: 0.7em 1em 0.5em 0;
    }
}
</style>