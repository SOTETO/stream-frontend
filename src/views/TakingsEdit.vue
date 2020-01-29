<template>
  <VcAFrame :title="headerTitle" hasContainer="true">
      <el-form
                :model="taking"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
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

                    <el-card v-if="showInternalTransactions" class="box-card tail expand">
                        <TakingDeadline :received="taking.amount.received" /><br/><br/>
                        <div><span>{{ $t("donation.placeholder.internalDetails.description") }}</span></div><br/>
                        <ReasonForPayment v-on:addReason="addReason" :taking="taking" :name="taking.context.description"/>
                    </el-card>
                    <button
                            v-if="!updateMode"
                            :disabled="!validDonation"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="submitForm">
                        {{ $t("takings.buttons.save") }}
                    </button>
                    <button 
                            v-if="updateMode"
                            :disabled="!validDonation"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="updateForm">
                        {{ $t("takings.buttons.update") }}
                    </button>
                </el-card>
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
                rules: {},
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
            .catch(error => console.log(error))

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
            updateMode () {
              return this.id !== null
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
            validDonation () {
              function validateSource(source) {
                return source.amount.hasOwnProperty("amount") && source.amount.amount > 0 &&
                source.hasOwnProperty("typeOfSource") && source.typeOfSource !== ""
              }
              return this.taking.amount.sources.length > 0 && this.taking.amount.sources.every(validateSource)
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


