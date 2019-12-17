<template>
    <div>
        <div>
            <span>{{ $t("donation.placeholder.externalDetails.partner.label") }}</span>
            <el-form-item>
                <el-input v-model="partner.name" :placeholder="$t('donation.placeholder.externalDetails.partner.name')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.asp" :placeholder="$t('donation.placeholder.externalDetails.partner.asp')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.email" :placeholder="$t('donation.placeholder.externalDetails.partner.email')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.address" :placeholder="$t('donation.placeholder.externalDetails.partner.address')"></el-input>
            </el-form-item>
        </div>
        <el-form-item>
            <el-checkbox v-model="donationReceipt" @change="commit">{{ $t("donation.placeholder.externalDetails.receipt") }}</el-checkbox>
        </el-form-item>

        <el-card class="box-card tail expand">
            <div><span>{{ $t("donation.placeholder.externalDetails.description") }}</span></div><br/>
            <ReasonForPayment v-model="reasonForPayment" v-on:addReason="addReason" :typeOfSource="external" :name="name" :address="partner.address"  />
        </el-card>

    </div>
</template>

<script>
    const uuidv5 = require('uuid/v5');
    import { Input, Checkbox, FormItem } from 'element-ui'
    import ReasonForPayment from '@/components/ReasonForPayment.vue'

    export default {
        name: "ExternalTransactionDetails",
        components: {
            "el-input": Input,
            "el-checkbox": Checkbox,
            "el-form-item": FormItem,
            'ReasonForPayment': ReasonForPayment,
        },
        props: {
            "value": {
                "type": Object
            },
            "sources": {
                "type": Array
            },
            "name": {
                type: String,
                default: null
            }
        },
        data () {
            return {
                "donationReceipt": false,
                "reasonForPayment": "",
                "partner": {
                    "name": "",
                    "asp": "",
                    "email": "",
                    "address": ""
                }
            }
        },
        computed: {
            external() {
                return "external"
            }
        },
        created () {
            if(this.sources.length > 0) {
                for (var source in this.sources) {
                    if (this.sources[source].typeOfSource.category == "extern") {
                        this.partner.name = this.sources[source].typeOfSource.external.location
                        this.partner.address = this.sources[source].typeOfSource.external.address
                        this.partner.asp = this.sources[source].typeOfSource.external.contactPerson
                        this.partner.email = this.sources[source].typeOfSource.external.email
                        this.donationReceipt = this.sources[source].typeOfSource.external.receipt
                    }
                }
            }

            if(typeof this.value !== "undefined" && this.value !== null) {
                if(this.value.hasOwnProperty("receipt")) {
                    this.donationReceipt = this.value.receipt
                }
                if(this.value.hasOwnProperty("partner")) {
                    this.partner = this.value.partner
                }
            }
            this.commit()
        },
        methods: {
            commit() {
                var result = {
                    "reasonForPayment": this.reasonForPayment,
                    "receipt": this.donationReceipt,
                    "partner": this.partner
                }
                this.$emit("input", result)
            },
            addReason(reason) {
                this.reasonForPayment = reason
                this.commit()
            }
        }
    }
</script>

<style scoped>
.donationAccount {
    font-weight: bold;
}
</style>
