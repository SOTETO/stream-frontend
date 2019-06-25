<template>
    <div class="deposit">
        <span><AmpleLight :color="stateConfirmed" />{{ $t("donation.hints.deposit.confirmed", { "amount": formatAmount(confirmed) }) }}</span>
        <span v-if="showUnconfirmed"><AmpleLight :color="stateUnconfirmed" />{{ $t("donation.hints.deposit.unconfirmed", { "amount": formatAmount(unconfirmed) }) }}</span>
        <span v-if="showOpen"><AmpleLight :color="stateOpen" />{{ $t("donation.hints.deposit.open", { "amount": formatAmount(open) }) }}</span>
    </div>
</template>

<script>
    import CurrencyFormatter from '@/utils/CurrencyFormatter'
    import AmpleLight from '@/components/donations/AmpleLight'

    export default {
        name: "DepositLights",
        components: {
            AmpleLight
        },
        props: {
            "donation": {
                "type": Object,
                "required": true
            }
        },
        computed: {
            confirmed () {
                var confirmed = 0
                if(this.donation.deposited.confirmed.hasOwnProperty("EUR")) {
                    confirmed = this.donation.deposited.confirmed.EUR
                }
                return confirmed
            },
            unconfirmed () {
                var unconfirmed = 0
                if(this.donation.deposited.unconfirmed.hasOwnProperty("EUR")) {
                    unconfirmed = this.donation.deposited.unconfirmed.EUR
                }
                return unconfirmed
            },
            open () {
                return this.donation.amount - (this.confirmed + this.unconfirmed)
            },
            showUnconfirmed () {
                return this.unconfirmed > 0
            },
            showOpen () {
                return this.open > 0
            },
            /**
             * Calculates the state of the confirmed amount. It's "red", if there is no confirmed amount and "green", if
             * the confiremd amount is equal to the donations amount. It has a "yellow" state, if there is some confirmed
             * amount, but some percentage is missing AND also if the confirmed deposit amount is bigger than the amount
             * of the donation. The last case happens, if the supporter has made an error during counting the donation by
             * hand. It indicates, that the supporter should edit the donations amount.
             *
             * @author Johann Sell
             * @returns {string}
             */
            stateConfirmed () {
                var state = "red"
                if(this.confirmed > 0 && this.confirmed !== this.donation.amount) {
                    state = "yellow"
                } else if(this.confirmed === this.donation.amount) {
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
                var formatter = CurrencyFormatter.getFromNumeric("EUR", amount) // Todo: select currency based on donation entry!
                return formatter.localize()
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