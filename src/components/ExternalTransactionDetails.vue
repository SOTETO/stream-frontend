<template>
    <div>
        <div>
            <span>{{ $t("donation.placeholder.externalDetails.partner.label") }}</span>
            <el-form-item>
                <el-input v-model="partner.name" @change="changeName" :placeholder="$t('donation.placeholder.externalDetails.partner.name')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.asp" @change="changeASP" :placeholder="$t('donation.placeholder.externalDetails.partner.asp')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.email" @change="changeEmail" :placeholder="$t('donation.placeholder.externalDetails.partner.email')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="partner.address" @change="changeAddress" :placeholder="$t('donation.placeholder.externalDetails.partner.address')"></el-input>
            </el-form-item>
        </div>
        <el-form-item>
            <el-checkbox v-model="donationReceipt" @change="commit">{{ $t("donation.placeholder.externalDetails.receipt") }}</el-checkbox>
        </el-form-item>

        <el-card class="box-card tail expand">
            <div><span>{{ $t("donation.placeholder.externalDetails.description") }}</span></div><br/>
            <ReasonForPayment :taking="taking" :typeOfSource="external" :name="name" :address="partner.address"  />
        </el-card>

    </div>
</template>

<script>
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
            "taking": {
                "type": Object
            },
            sources: {
                type: Array
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
                  if (this.sources[source].typeOfSource.category === "extern") {
                    if (typeof this.sources[source].typeOfSource.external == "undefined") {
                      this.sources[source].typeOfSource["external"] = {"location": "", "address": "", "contactPerson":"", "email":"", "receipt": false}
                    } else {
                      this.partner.name = this.sources[source].typeOfSource.external.location
                      this.partner.address = this.sources[source].typeOfSource.external.address
                      this.partner.asp = this.sources[source].typeOfSource.external.contactPerson
                      this.partner.email = this.sources[source].typeOfSource.external.email
                      this.donationReceipt = this.sources[source].typeOfSource.external.receipt
                    }
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
        watch: {
          sources: {
            deep: true,
            handler(update) {
              for (var source in this.sources) {
                if (this.sources[source].typeOfSource.category === "extern") {
                  if (typeof this.sources[source].typeOfSource.external == "undefined") {
                    this.sources[source].typeOfSource["external"] = {"location": this.partner.name, "address": this.partner.address, "contactPerson": this.partner.asp, "email": this.partner.email, "receipt": this.donationReceipt}
                  }
                }else{
                  if (typeof this.sources[source].typeOfSource.external != "undefined") {
                    delete this.sources[source].typeOfSource.external
                  }
                }
              }
            }
          }
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
            changeName () {
              if(this.sources.length > 0) {
                for (var source in this.sources ) {
                  if (this.sources[source].typeOfSource.category === "extern") {
                    this.sources[source].typeOfSource.external.location = this.partner.name
                  }
                }
              }
            },
            changeAddress () {
              if(this.sources.length > 0) {
                for (var source in this.sources ) {
                  if (this.sources[source].typeOfSource.category === "extern") {
                    this.sources[source].typeOfSource.external.address = this.partner.address
                  }
                }
              }
            },
            changeASP () {
              if(this.sources.length > 0) {
                for (var source in this.sources ) {
                  if (this.sources[source].typeOfSource.category === "extern") {
                    this.sources[source].typeOfSource.external.contactPerson = this.partner.asp
                  }
                }
              }
            },
            changeEmail () {
              if(this.sources.length > 0) {
                for (var source in this.sources ) {
                  if (this.sources[source].typeOfSource.category === "extern") {
                    this.sources[source].typeOfSource.external.email = this.partner.email
                  }
                }
              }
            },
            changeReceipt () {
              if(this.sources.length > 0) {
                for (var source in this.sources ) {
                  if (this.sources[source].typeOfSource.category === "extern") {
                    this.sources[source].external.receipt = this.donationReceipt
                  }
                }
              }
            }
        }
    }
</script>

<style scoped>
.donationAccount {
    font-weight: bold;
}
</style>
