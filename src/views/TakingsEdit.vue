<template>
  <VcAFrame :title="$t('takingsEdit.header')" hasContainer="true">

      <el-form
                :model="taking"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
                <el-card class="box-card">
                    <TakingContext v-model="taking.context" v-bind:context="taking.context" />
                </el-card>  
                <el-card class="box-card tail expand">
                  <TakingCalculator :first="false" v-model="taking.amount" v-bind:amount="taking.amount" />
                </el-card>

                <el-card v-if="showExternalTransactions" class="box-card tail expand">
                    <ExternalTransactionDetails v-model="donation.details" />
                </el-card>
                <el-card class="box-card tail expand">
                    <TakingDeadline :received="taking.amount.received" />
                    <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('donation.placeholder.comment')"
                            v-model="taking.comment">
                    </el-input>
                    <button
                            v-if="!updateMode"
                            :disabled="!validDonation"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="submitForm">
                        {{ $t("donation.buttons.save") }}
                    </button>
                    <button
                            v-if="updateMode"
                            :disabled="!validDonation"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="updateForm">
                        {{ $t("takings.buttons.update") }}
                    </button>
                  <el-popover
                    v-if="!updateMode"
                    placement="top"
                    width="300"
                    v-model="visible">
                    <p><strong>{{ $t("takings.popover.title") }}</strong></p>
                    <div v-if="this.taking.context.description === ''">{{ $t("takings.popover.errors.description") }}</div>
                    <div v-if="this.taking.context.category === ''">{{ $t("takings.popover.errors.category") }}</div>
                    <div v-if="this.taking.amount.sources.length === 0 ">{{ $t("takings.popover.errors.amount") }}</div>
                    <div style="text-align: right; margin: 0">
                      <el-button type="primary" size="mini" @click="visible = false">confirm</el-button>
                    </div>
                    <el-button type="text" slot="reference">{{ $t("takings.popover.buttonText") }}</el-button>
                  </el-popover>
                </el-card>
            </VcAColumn>
        </el-form>
    </VcAFrame>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { Input, Form, Card} from 'element-ui'
    import TakingCalculator from '@/components/takings/edit/TakingCalculator.vue'
    import ExternalTransactionDetails from '@/components/ExternalTransactionDetails.vue'
    import TakingDeadline from '@/components/takings/edit/TakingDeadline.vue'
    import TakingContext from '@/components/takings/edit/TakingContext.vue'

    export default {
        name: "TakingsEdit",
        components: {
            'TakingCalculator': TakingCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
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
                visible: false,
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

                },
            }
        },
        mounted () {
          if (this.id !== null) {
            this.taking = this.getById(this.id)
          }
        },
        computed: {
            ...mapGetters('takings', {
                getById: 'getById',
            }),
            status () {
              if (this.taking.context.category === '')
                return "Ohh no";
              else
                return "";
              },
            updateMode () {
              return this.id !== null
            },
            showExternalTransactions () {
                return this.taking.amount.sources.filter(s => s.type === "extern").length > 0
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
              return this.taking.amount.sources.length > 0 && this.taking.context.category !== "" && this.taking.context.description !== "" && this.taking.created !== "" && this.taking.amount.involvedSupporter !== "" && this.taking.amount.sources.every(validateSource)
            }
        },
        methods: {
            ...mapActions('takings', [
                'add', // -> this.foo()
                'update',
            ]),
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


