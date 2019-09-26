<template>
    <VcAFrame :title="$t('donation.header.frame.create')" hasContainer="true">
        <el-form
                :model="donation"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
                <VcABox :first="true" :title="$t('donation.header.box.action')">
                    <DonationContext v-model="donation.context" />
                </VcABox>
                <DonationCalculator v-if="showCalculator" :first="false" v-model="donation.amount" />
            </VcAColumn>
            <VcAColumn>
                <VcABox :title="$t('donation.header.box.norms')" :first="true">
                  <TakingsSelect v-model="donation.norms"/>
                </VcABox>
                <VcABox v-if="showExternalTransactions" :first="showExternalTransactions" :title="$t('donation.header.box.externalTransactions')">
                    <ExternalTransactionDetails v-model="donation.details" />
                </VcABox>
                <VcABox :first="!showExternalTransactions" :title="$t('donation.header.box.save')">
                    <DonationDeadline :received="donation.amount.received" />
                    <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('donation.placeholder.comment')"
                            v-model="donation.comment">
                    </el-input>
                    <button
                            :disabled="!validDonation"
                            class="vca-button-primary vca-full-width"
                            @click.prevent="submitForm">
                        {{ $t("donation.buttons.save") }}
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
    import DonationCalculator from '@/components/DonationCalculator.vue'
    import ExternalTransactionDetails from '@/components/ExternalTransactionDetails.vue'
    import DonationDeadline from '@/components/DonationDeadline.vue'
    import DonationContext from '@/components/DonationContext.vue'
    import TakingsSelect from '@/components/TakingsSelect.vue'

    export default {
        name: "DonationsAdd",
        components: {
            'DonationCalculator': DonationCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
            'DonationDeadline': DonationDeadline,
            'DonationContext': DonationContext,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'VcABox': VcABox,
            'el-input': Input,
            'el-form': Form,
            'TakingsSelect': TakingsSelect
        },
        data () {
            return {
                donation: {
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
                    "norms": ""
                },
                rules: {},
            }
        },
        computed: {
            showExternalTransactions () {
                return this.donation.amount.sources.filter(s => s.type === "extern").length > 0
            },
            showCalculator () {
                return this.donation.context.hasOwnProperty("category") && this.donation.context.category !== "" &&
                    this.donation.context.hasOwnProperty("description") && this.donation.context.description !== ""
            },
            validDonation () {
                return this.showCalculator && this.donation.amount.sources.length > 0
            }
        },
        methods: {
            ...mapActions('donations', [
                'add', // -> this.foo()
            ]),
            submitForm () {
                this.add(this.donation)
                this.$router.push('/donations')
            }
        }
    }
</script>

<style scoped>

</style>
