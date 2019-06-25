<template>
    <VcAFrame :title="$t('takings.header.frame.create')" hasContainer="true">
        <el-form
                :model="takings"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
                <VcABox :first="true" :title="$t('takings.header.box.action')">
                    <TakingsContext Context v-model="takings.context" />
                </VcABox>
                <TakingsCalculator v-if="showCalculator" :first="false" v-model="takings.amount" />
            </VcAColumn>
            <VcAColumn>
                <VcABox v-if="showExternalTransactions" :first="showExternalTransactions" :title="$t('takings.header.box.externalTransactions')">
                    <ExternalTransactionDetails v-model="takings.details" />
                </VcABox>
                <VcABox :first="!showExternalTransactions" :title="$t('takings.header.box.save')">
                    <TakingsDeadline :received="takings.amount.received" />
                    <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('takings.placeholder.comment')"
                            v-model="takings.comment">
                    </el-input>
                    <button
                            :disabled="!validTakings"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="submitForm">
                        {{ $t("takings.buttons.save") }}
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
    import {  Form } from 'element-ui'
    import TakingsCalculator from '@/components/takings/TakingsCalculator.vue'
    import ExternalTransactionDetails from '@/components/ExternalTransactionDetails.vue'
    import TakingsDeadline from '@/components/takings/TakingsDeadline.vue'
    import TakingsContext from '@/components/takings/TakingsContext.vue'

    export default {
        name: "TakingsAdd",
        components: {
            'TakingsCalculator': TakingsCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
            'TakingsDeadline': TakingsDeadline,
            'TakingsContext': TakingsContext,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'VcABox': VcABox,
            // 'el-input': Input,
            'el-form': Form
        },
        data () {
            return {
                takings: {
                    "context": {
                        "description": "",
                        "category": "",
                        "info": ""
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
                    "updated": Date.now()
                },
                rules: {},
            }
        },
        computed: {
            showExternalTransactions () {
                return this.takings.amount.sources.filter(s => s.type === "extern").length > 0
            },
            showCalculator () {
                return this.takings.context.hasOwnProperty("category") && this.takings.context.category !== "" &&
                    this.takings.context.hasOwnProperty("description") && this.takings.context.description !== ""
            },
            validTakings () {
                return this.showCalculator && this.takings.amount.sources.length > 0
            }
        },
        methods: {
            ...mapActions('takings', [
                'add', // -> this.foo()
            ]),
            submitForm () {
                //this.add(this.takings);
                console.log(this.takings);
                this.$router.push('/takings')
            }
        }
    }
</script>

<style scoped>

</style>