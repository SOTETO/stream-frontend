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
            <ReasonForPayment :typeOfSource="external" :name="name" :address="partner.address"  />
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
            name: {
                type: String,
                default: null
            }
        },
        data () {
            return {
                "donationReceipt": false,
                "partner": {
                    "name": "",
                    "asp": "",
                    "email": "",
                    "address": ""
                }
            }
        },
        computed: {
            reasonForPayment () {
                return uuidv5('http://pool.vivaconagua.org/stream', uuidv5.URL)
            },
            external() {
                return "external"
            }
        },
        created () {
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
            }
        }
    }
</script>

<style scoped>
.donationAccount {
    font-weight: bold;
}
</style>
