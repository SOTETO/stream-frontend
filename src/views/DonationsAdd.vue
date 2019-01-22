<template>
    <VcAFrame :title="$t('donation.header.frame.create')" hasContainer="true">
        <el-form
                :model="donation"
                :rules="rules"
                class="columns-container">
            <VcAColumn size="40%">
                <DonationCalculator :first="true" />
            </VcAColumn>
            <VcAColumn>
                <VcABox :first="true" :title="$t('donation.header.box.save')">
                    <span>{{ $t("donation.hints.deadline", { "deadline": $d(getDeadline(), 'short') }) }}</span>
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

    export default {
        name: "DonationsAdd",
        components: {
            'DonationCalculator': DonationCalculator,
            'VcAFrame': VcAFrame,
            'VcAColumn': VcAColumn,
            'VcABox': VcABox,
            'el-input': Input,
            'el-form': Form
        },
        data () {
            return {
                donation: {
                    "comment": ''
                },
                comment: '',
                rules: {}
            }
        },
        methods: {
            ...mapActions('donations', [
                'add', // -> this.foo()
            ]),
            submitForm () {
                this.add(this.donation)
                this.$router.push('/donations')
            },
            getDeadline () {
                return new Date()
            }
        }
    }
</script>

<style scoped>

</style>