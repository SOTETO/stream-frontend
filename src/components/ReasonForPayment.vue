<template>
    <div>
    <p>
        <span class="donationAccount">{{ $t("donation.placeholder.externalDetails.account.label") }}</span><br/>
        <span>{{ $t("donation.placeholder.externalDetails.account.owner") }}</span><br/>
        <span>{{ $t("donation.placeholder.externalDetails.account.iban") }}</span><br/>
        <span>{{ $t("donation.placeholder.externalDetails.account.bic") }}</span><br/>
    </p>
    <span class="reasonForPayment">{{ $t('externalTransaction.label.reasonForPayment', { 'generated': reasonForPayments }) }}</span><br/><br/>
    </div>
</template>

<script>
    const uuidv5 = require('uuid/v5');
    import { Input, Checkbox, FormItem } from 'element-ui'

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
            }
        },
        data () {
            return {
                "reasonForPayment": ""
            }
        },
        computed: {
            reasonForPayments () {

                var crewName = "UKN"
                var crew = this.$store.getters['user/getCrew']
                if(crew !== undefined && crew !== null && this.$store.getters['user/getCrew']) {
                    crewName = this.$store.getters['user/getCrew'][0]['name']
                    crewName = crewName.substr(0, 3).toUpperCase()
                }

                var name = "AKN"
                if(this.name !== null && this.name !== "") {
                    name = this.name.toUpperCase()
                }

                var address = "ADR"
                if(this.address !== null && this.address !== "") {
                    address  = this.address.toUpperCase().replace(/\s/g, ' ')
                }
                
                var reason = "\r\n" + crewName + " - " + name

		if (this.typeOfSource == "external") {
                    reason  += " - " + address
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
