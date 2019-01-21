<template>
    <VcAFrame title="Save donation" hasContainer="true">
        <el-form
                :model="donation"
                :rules="rules"
                class="columns-container">
            <VcAColumn>
                <VcABox :first="true" title="Save">
                    <span>Bitte zahle die Spende bis spätestens ...TODO... ein!</span>
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="Bemerkung / Frage"
                            v-model="donation.comment">
                    </el-input>
                    <button
                            class="vca-button-primary vca-full-width"
                            @click.prevent="submitForm">
                        Speichern
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

    export default {
        name: "DonationsAdd",
        components: {
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
            }
        }
    }
</script>

<style scoped>

</style>