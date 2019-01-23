<template>
    <div>
        <p>
            Todo: Konto
        </p>
        <span>{{ $t('externalTransaction.label.reasonForPayment', { 'generated': reasonForPayment }) }}</span>

        <el-form-item>
            <el-checkbox v-model="donationReceipt" @change="commit">{{ $t("donation.placeholder.externalDetails.receipt") }}</el-checkbox>
        </el-form-item>
        <div>
            <span>{{ $t("donation.placeholder.externalDetails.partner.label") }}</span>
            <el-form-item>
                <el-input v-model="partner.name" :disabled="!donationReceipt" :placeholder="$t('donation.placeholder.externalDetails.partner.name')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.asp" :disabled="!donationReceipt" :placeholder="$t('donation.placeholder.externalDetails.partner.asp')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.email" :disabled="!donationReceipt" :placeholder="$t('donation.placeholder.externalDetails.partner.email')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.address" :disabled="!donationReceipt" :placeholder="$t('donation.placeholder.externalDetails.partner.address')"></el-input>
            </el-form-item>
        </div>
    </div>
</template>

<script>
    const uuidv5 = require('uuid/v5');
    import { Input, Checkbox, FormItem } from 'element-ui'

    export default {
        name: "ExternalTransactionDetails",
        components: {
            "el-input": Input,
            "el-checkbox": Checkbox,
            "el-form-item": FormItem
        },
        props: {
            "value": {
                "type": Object
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
                console.log(this.donationReceipt)
                this.$emit("input", result)
            }
        }
    }
</script>

<style scoped>

</style>