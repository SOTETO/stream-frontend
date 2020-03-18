<template>
    <div>
    <p v-if="typeOfSource == 'external'">
        <span class="donationAccount">{{ $t("donation.placeholder.externalDetails.account.label") }}</span><br/>
        <span>{{ $t("donation.placeholder.externalDetails.account.owner") }}</span><br/>
        <span>{{ $t("donation.placeholder.externalDetails.account.iban") }}</span><br/>
        <span>{{ $t("donation.placeholder.externalDetails.account.bic") }}</span><br/>
    </p>
    <span class="reasonForPayment">{{ $t('externalTransaction.label.reasonForPayment', { 'generated': reasonForPayments }) }}</span><br/><br/>
    </div>
</template>

<script>
    export default {
        name: "ReasonForPayment",
        props: {
            "typeOfSource": {
                type: String,
                default: null
            },
            "name": {
                type: String,
                default: null
            },
            "address": {
                type: String,
                default: null
            },
            "taking": {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                "reasonForPayment": ""
            }
        },
        created: function () {
            this.reasonForPayment = this.reasonForPayments
        },
        methods: {
            getCurrentReason: function() {

                if ("" !== this.taking.details.reasonForPayment) {
                    return this.taking.details.reasonForPayment
                }

                var crewName = this.getCrewForReason()

                var name = this.getActionForReason()

                var reason = crewName + " - " + name

                this.$emit("addReason", reason)

                return reason

            },
            getCrewForReason: function() {

                var crewName = "UKN"
                var crew = this.$store.getters['user/getCrew']

                if(crew !== undefined && crew !== null && this.$store.getters['user/getCrew']) {
                    crewName = this.$store.getters['user/getCrew'][0]['name']
                    crewName = crewName.substr(0, 3).toUpperCase()
                }

                return crewName
            },
            getActionForReason: function() {

                var name = "AKN"
                if(this.name !== null && this.name !== "") {
                    name = this.name.toUpperCase()
                }
                return name
            }

        },
        computed: {
            reasonForPayments () {

                var reason = this.getCurrentReason()

		        if (this.typeOfSource == "external") {

                    /*var address = "ADR"
                    if(this.address !== null && this.address !== "") {
                        address  = this.address.toUpperCase().replace(/\s/g, ' ')
                    }*/

                    reason  += " - EXT"

                }

                return reason
            }
        }
    }
</script>

<style scoped>
.donationAccount, .reasonForPayment {
    font-weight: bold;
}
</style>
