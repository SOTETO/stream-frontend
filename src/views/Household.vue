<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('household.header.box.list')">
                <ExpenseList @vca-edit-expense="editState" />
            </VcABox>
        </VcAColumn>
        <VcAColumn size="20%">
            <VcABox :first="true" :title="$t('household.header.box.expense')">
                <div slot="header" v-if="isEditState">
                    <button class="vca-button-default" @click.prevent="addState">
                        {{ $t("household.buttons.cancel") }}
                    </button>
                </div>
                <ExpenseForm v-if="!isEditState" :key="editable.key" />
                <ExpenseForm v-if="isEditState" :uuid="editable.key" :key="editable.key" @vca-expense-update="addState" />
            </VcABox>
            <VcABox :title="$t('household.header.box.transitions')" v-if="isEditState">
                <div slot="header" v-if="isEditState">
                    <button class="vca-button-default" @click.prevent="addState">
                        {{ $t("household.buttons.cancel") }}
                    </button>
                </div>
                <ExpenseStateTransition :uuid="editable.key" />
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import ExpenseForm from '../components/household/ExpenseForm'
    import ExpenseStateTransition from '../components/household/ExpenseStateTransition'
    import ExpenseList from '../components/household/ExpenseList'

    export default {
        name: "Household",
        components: {
            VcAFrame, VcAColumn, VcABox, ExpenseForm, ExpenseStateTransition, ExpenseList
        },
        data () {
            var editableDefault = {
                "value": null,
                "key": -1
            }
            return {
                "editableDefault" : editableDefault,
                "editable": JSON.parse(JSON.stringify(editableDefault))
            }
        },
        computed: {
            ...mapGetters('household', {
                byId: 'byId'
            }),
            isEditState () {
                return typeof this.editable.value !== "undefined" && this.editable.value !== null
            }
        },
        methods: {
            editState (expense) {
                this.editable.value = this.byId(expense.id)
                this.editable.key = expense.id
            },
            addState (expense) {
                this.editable = JSON.parse(JSON.stringify(this.editableDefault))
            }
        }
    }
</script>

<style scoped lang="less">
</style>