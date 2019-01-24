<template>
    <VcAFrame :title="$t('donation.header.frame.create')" hasContainer="true">
        <el-form
                :model="donation"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
                <DonationCalculator :first="true" v-model="donation.amount" />
            </VcAColumn>
            <VcAColumn>
                <VcABox v-if="showExternalTransactions" :first="showExternalTransactions" :title="$t('donation.header.box.externalTransactions')">
                    <ExternalTransactionDetails v-model="donation.details" />
                </VcABox>
                <VcABox :first="!showExternalTransactions" :title="$t('donation.header.box.save')">
                    <span>{{ $t("donation.hints.deadline", { "deadline": $d(deadline, 'short') }) }}</span>
                    <el-input
                            type="textarea"
                            :rows="4"
                            :placeholder="$t('donation.placeholder.comment')"
                            v-model="donation.comment">
                    </el-input>
                    <button
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

    export default {
        name: "DonationsAdd",
        components: {
            'DonationCalculator': DonationCalculator,
            'ExternalTransactionDetails': ExternalTransactionDetails,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'VcABox': VcABox,
            'el-input': Input,
            'el-form': Form
        },
        data () {
            return {
                donation: {
                    "comment": '',
                    "details": {
                        "reasonForPayment": "",
                        "receipt": false,
                        "partner": {}
                    },
                    "amount": {
                        "received": Date.now(),
                        "sources": []
                    }
                },
                comment: '',
                rules: {},
            }
        },
        computed: {
            showExternalTransactions () {
                return this.donation.amount.sources.filter(s => s.type === "extern").length > 0
            },
            deadline () {
                var received = new Date(this.donation.amount.received)
                received.setDate(received.getDate() + 28)
                return received
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