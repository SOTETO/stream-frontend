<template>
    <VcAFrame :title="$t('economic-add.header')" hasContainer="true">
        <el-form
                :model="taking"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
                <VcABox :first="true" :title="$t('economic-add.box.action')">
                    <EconomicContext v-model="taking.context" v-bind:categories="categories.list" />
                </VcABox>
                <VcABox v-if="showCalculator" :first="false" :title="labelCalculator">
                  <EconomicCalculator :first="false" v-model="taking.amount" />
                </VcABox>
                <VcABox v-if="showExternalTransactions" :first="false" :title="$t('economic-add.box.externalTransactions')">
                    <ExternalTransactionDetails v-model="taking.details" />
                </VcABox>
                <VcABox :first="false" :title="$t('economic-add.box.save')">
                    <EconomicDeadline :received="taking.amount.received" />
                    <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('economic-add.comment')"
                            v-model="taking.comment">
                    </el-input>
                    <button
                            :disabled="!validDonation"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="submitForm">
                        {{ $t("economic-add.buttons.save") }}
                    </button>
                </VcABox>
            </VcAColumn>
        </el-form>
    </VcAFrame>
</template>

<script>
    import { mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { Input, Form } from 'element-ui'
    import EconomicCalculator from '@/components/economy/EconomicCalculator.vue'
    import ExternalTransactionDetails from '@/components/ExternalTransactionDetails.vue'
    import EconomicDeadline from '@/components/economy/EconomicDeadline.vue'
    import EconomicContext from '@/components/economy/EconomicContext.vue'

    export default {
        name: "DonationsAdd",
        components: {
            'EconomicCalculator': EconomicCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
            'EconomicDeadline': EconomicDeadline,
            'EconomicContext': EconomicContext,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'VcABox': VcABox,
            'el-input': Input,
            'el-form': Form,
        },
        data () {
            return {
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
                    "norms": "ECONOMY"
                },
                    
              categories: {
                "list": [
                    ["concert", "run4wash", "streetFestivals"],
                    ["festival", "school", "karaoke"],
                    ["stadium", "party", "kicker"]
                ]
              },
              rules: {},
            }
        },
        computed: {
            showExternalTransactions () {
                return this.taking.amount.sources.filter(s => s.type === "extern").length > 0
            },
            showCalculator () {
                return this.taking.context.hasOwnProperty("category") && this.taking.context.category !== "" &&
                    this.taking.context.hasOwnProperty("description") && this.taking.context.description !== "" 
            },
            validDonation () {
                return this.showCalculator && this.taking.amount.sources.length > 0
            },
        },
        methods: {
            ...mapActions('donations', [
                'add', // -> this.foo()
            ]),
            submitForm () {
                this.add(this.taking)
                this.$router.push('/donations')
            }
        }
    }
</script>

<style scoped>

</style>
