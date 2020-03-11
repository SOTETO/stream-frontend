<template>
    <VcAFrame :title="headerTitle" hasContainer="true">
        <el-form
          :model="taking"
          :rules="rules"
          class="columns-container">
          <VcAColumn size="60%">
                <el-card class="box-card">
                    <TakingContext v-model="taking.context" v-bind:context="taking.context" />
                </el-card>  
                <el-card class="box-card tail expand">
                    <TakingCalculator :first="false" :sourceCount="sourceCount" v-model="taking.amount" v-bind:amount="taking.amount" />
                </el-card>

                <el-card v-if="showExternalTransactions" class="box-card tail expand">
                    <ExternalTransactionDetails v-model="taking.details" :taking="taking" :sources="taking.amount.sources" :name="taking.context.description" />
                </el-card>

                <el-card class="box-card tail expand">
                    <el-form-item :label="$t('donation.placeholder.comment')" class="vca-categories">
                        <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('takings.placeholder.comment')"
                            v-model="taking.comment">
                        </el-input>
                    </el-form-item>
                </el-card>

                <el-card v-if="showInternalTransactions" class="box-card tail expand">
                    <TakingDeadline :received="taking.amount.received" /><br/><br/>
                    <div><span>{{ $t("donation.placeholder.internalDetails.description") }}</span></div><br/>
                    <ReasonForPayment v-on:addReason="addReason" :taking="taking" :name="taking.context.description"/>
                </el-card>

                <button
                    v-if="!updateMode"
                    :disabled="!validInput"
                    class="vca-button-primary vca-full-width"
                    @click.prevent="submitForm">
                        {{ $t("takings.buttons.save") }}
                </button>
                <button
                    v-if="updateMode"
                    :disabled="!validInput"
                    class="vca-button-primary vca-full-width"
                    @click.prevent="updateForm">
                        {{ $t("takings.buttons.update") }}
                </button>

                <el-popover
                    v-if="!updateMode && (!validInput || !validPartner)"
                    placement="top"
                    width="350"
                    v-model="visible">
                        <p><strong>{{ $t("takings.popover.title") }}</strong></p>
                        <div v-if="!validDescription">{{ $t("takings.popover.errors.description") }}</div>
                        <div v-if="!validCategory">{{ $t("takings.popover.errors.category") }}</div>
                        <div v-if="!validSource || !validSourceData">{{ $t("takings.popover.errors.amount") }}</div>
                        <div v-if="!validPartner">{{ $t("takings.popover.errors.partner") }}</div>
                        <el-button type="text" slot="reference">{{ $t("takings.popover.buttonText") }}</el-button>
                </el-popover>
            </VcAColumn>
        </el-form>
    </VcAFrame>
</template>

<script>
    import axios from 'axios'
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { Input, Form, Card} from 'element-ui'
    import TakingCalculator from '@/components/takings/edit/TakingCalculator.vue'
    import ExternalTransactionDetails from '@/components/ExternalTransactionDetails.vue'
    import ReasonForPayment from '@/components/ReasonForPayment.vue'
    import TakingDeadline from '@/components/takings/edit/TakingDeadline.vue'
    import TakingContext from '@/components/takings/edit/TakingContext.vue'

    export default {
        name: "TakingsEdit",
        components: {
            'TakingCalculator': TakingCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
            'ReasonForPayment': ReasonForPayment,
            'TakingDeadline': TakingDeadline,
            'TakingContext': TakingContext,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'el-card': Card,
            'el-input': Input,
            'el-form': Form,
        },
        props: {
            id: {
                type: String,
                default: null
            }
        },
        data () {
            return {
                reason: "",
                visible: false,
                sourceCount: 0,
                taking: {
                    "context": {
                        "description": "",
                        "category": ""
                    },
                    "comment": "",
                    "details": {
                        "reasonForPayment": "",
                        "receipt": false,
                        "partner": {}
                    },
                    "description": "",
                    "amount": {
                        "received": Date.now(),
                        "sources": [],
                        "involvedSupporter": []
                    },
                    "created": Date.now(),
                    "updated": Date.now(),
                },
                rules: {
                    context: [{
                        required: true
                    }],
                    comment: [{
                        required: true
                    }],
                    amount: [{
                        required: true
                    }],

                }
            }
        },
        mounted () {
            if (this.id !== null) {
                axios.get(
                  '/backend/stream/takings/id/' + this.id,
                  { 'headers': { 'X-Requested-With': 'XMLHttpRequest' }}
                  )
                .then(response => {
                  if(response.status === 200) {
                    this.taking = response.data
                    this.sourceCount = this.taking.amount.sources.length
                }
            })
                .catch(error => { 
                    console.log(error.response.status)
                    switch(error.response.status) {
                        case 401:
                        this.open401()
                        this.$router.push('/takings')
                        break;
                    }
                })
            }
        },
        computed: {
            ...mapGetters('takings', {
                get: 'getById',
            }),
            headerTitle () {
              if (this.id !== null) {
                    return this.$t('takingsEdit.header.edit')
                } else {
                    return this.$t('takingsEdit.header.add')
                }
            },
            showExternalTransactions () {
                return this.taking.amount.sources.filter(s => s.typeOfSource.category === "extern").length > 0
            },
            showInternalTransactions () {
                return this.taking.amount.sources.filter(s => s.typeOfSource.category === "cash").length > 0
            },
            showCalculator () {
                return this.taking.context.hasOwnProperty("category") && this.taking.context.category !== "" &&
                this.taking.context.hasOwnProperty("description") && this.taking.context.description !== "" 
            },
            updateMode () {
                return this.id !== null
            },
            validSource () {
                return this.showInternalTransactions || this.showExternalTransactions
            },
            validCategory () {
                return this.taking.context.category !== ""
            },
            validDescription() {
                return this.taking.context.description !== ""
            },
            validPartner() {
                for (var source in this.taking.amount.sources) {
                    if (this.taking.amount.sources[source].typeOfSource.category == "extern") {
                        return (this.taking.details.partner.hasOwnProperty("name") && this.taking.details.partner.name !== "") &&
                            (this.taking.details.partner.hasOwnProperty("asp") && this.taking.details.partner.asp !== "") &&
                            (this.taking.details.partner.hasOwnProperty("email") && this.taking.details.partner.email !== "") &&
                            (this.taking.details.partner.hasOwnProperty("address") && this.taking.details.partner.address !== "")
                    }
                }
                return true;
            },
            validSourceData () {
                function validateSource(source) {
                    return source.amount.hasOwnProperty("amount") && source.amount.amount > 0 &&
                    source.hasOwnProperty("typeOfSource") && source.typeOfSource !== ""
                }
                return this.taking.amount.sources.length > 0 &&  this.taking.created !== "" && this.taking.amount.involvedSupporter !== "" && this.taking.amount.sources.every(validateSource)
            },
            validInput() {
                return this.validSource && this.validCategory && this.validDescription && this.validSourceData && this.validPartner
            }
        },
        methods: {
            ...mapActions('takings', [
                'add', // -> this.foo()
                'update',
                'getById',
            ]),
            addReason(reason) {
                this.reason = reason
            },
            submitForm () {

                if(this.taking.amount.sources.length > 0) {
                    for (var source in this.taking.amount.sources) {
                        if (this.taking.amount.sources[source].typeOfSource.category == "extern") {
                            this.taking.amount.sources[source].typeOfSource.external = {
                                "location": this.taking.details.partner.name,
                                "contactPerson": this.taking.details.partner.asp,
                                "email": this.taking.details.partner.email,
                                "address": this.taking.details.partner.address,
                                "receipt": this.taking.details.receipt,
                            }
                        }
                    }
                }

                this.taking.details.reasonForPayment = this.reason

                this.add(this.taking)
                this.$router.push('/takings')
            },
            updateForm () {

                if(this.taking.amount.sources.length > 0) {
                    for (var source in this.taking.amount.sources) {
                        if (this.taking.amount.sources[source].typeOfSource.category == "extern") {
                            this.taking.amount.sources[source].typeOfSource.external = {
                                "location": this.taking.details.partner.name,
                                "contactPerson": this.taking.details.partner.asp,
                                "email": this.taking.details.partner.email,
                                "address": this.taking.details.partner.address,
                                "receipt": this.taking.details.receipt,
                            }
                        }
                    }
                }

                this.update(this.taking)
                this.$router.push('/takings')
            },
            open401() {
                this.$notify({
                    title: this.$t('errors.ajax.forbidden.header'),
                    message: this.$t('errors.ajax.forbidden.msg'),
                    type: 'warning'
                })
            },
            open(title, message, type) {
                Notification({
                    title:  title,
                    message: message,
                    type: type
                });
            }
        }
    }
</script>

<style scoped>
    .box-card {
        width: 100%;
    }
    .box-card.tail {
        margin-top: 2em;
    }
    .box-card.expand {
        flex-grow: 1;
    }
</style>


