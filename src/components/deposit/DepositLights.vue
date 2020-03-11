<template>
    <div class="deposit">
        <span><AmpleLight :color="stateConfirmed" />{{ $t("donation.hints.deposit.confirmed", { "amount": formatAmount(confirmed) }) }}</span>
        <span v-if="showUnconfirmed"><AmpleLight :color="stateUnconfirmed" />{{ $t("donation.hints.deposit.unconfirmed", { "amount": formatAmount(unconfirmed) }) }}</span>
        <span v-if="showOpen"><AmpleLight :color="stateOpen" />{{ $t("donation.hints.deposit.open", { "amount": formatAmount(open) }) }}</span>
    </div>
</template>

<script>
import Money from '@/utils/Money'
    import AmpleLight from '@/components/utils/AmpleLight'

    export default {
        name: "DepositLights",
        components: {
            AmpleLight
        },
        props: {
            "taking": {
                "type": Object,
                "required": true
            }
        },
        computed: {
            confirmed () {
                var confirmed = 0
                if(this.taking.deposited.confirmed.hasOwnProperty("EUR")) {
                    confirmed = this.taking.deposited.confirmed.EUR
                }
                return confirmed
            },
            unconfirmed () {
                var unconfirmed = 0
                if(this.taking.deposited.unconfirmed.hasOwnProperty("EUR")) {
                    unconfirmed = this.taking.deposited.unconfirmed.EUR
                }
                return unconfirmed
            },
            open () {
                return this.taking.amount.full - (this.confirmed + this.unconfirmed)
            },
            showUnconfirmed () {
                return this.unconfirmed > 0
            },
            showOpen () {
                return this.open > 0
            },
            /**
             * Calculates the state of the confirmed amount. It's "red", if there is no confirmed amount and "green", if
             * the confiremd amount is equal to the takings amount. It has a "yellow" state, if there is some confirmed
             * amount, but some percentage is missing AND also if the confirmed deposit amount is bigger than the amount
             * of the taking. The last case happens, if the supporter has made an error during counting the donation by
             * hand. It indicates, that the supporter should edit the takings amount.
             *
             * @author Johann Sell
             * @returns {string}
             */
            stateConfirmed () {
                var state = "red"
                if(this.confirmed > 0 && this.confirmed !== this.taking.amount.full) {
                    state = "yellow"
                } else if(this.confirmed === this.taking.amount.full) {
                    state = "green"
                }
                return state
            },
            stateUnconfirmed () {
                var state = "red"
                if(this.unconfirmed > 0) {
                    state = "yellow"
                }
                return state
            },
            stateOpen () {
                var state = "green"
                if(this.open > 0) {
                    state = "red"
                }
                return state
            }
        },
        methods: {
            formatAmount(amount) {
                return Money.getString(amount, "EUR")
            }
        }
    }
</script>

<style scoped lang="less">
.deposit span {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
