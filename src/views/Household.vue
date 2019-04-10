<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('household.header.box.list')">
                <ListMenu />
                <button v-if="hasPrevious" v-on:click="pageDown()" class="paginate">
                    {{ $tc('pagination.previous', pageGet.previous, { 'number': pageGet.previous }) }}
                </button>
                <ExpenseList @vca-edit-expense="editState" />
                <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
                    {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
                </button>
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
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import ExpenseForm from '../components/household/ExpenseForm'
    import ExpenseStateTransition from '../components/household/ExpenseStateTransition'
    import ExpenseList from '../components/household/ExpenseList'
    import ListMenu from '../components/utils/ListMenu'

    export default {
        name: "Household",
        components: {
            VcAFrame, VcAColumn, VcABox, ExpenseForm, ExpenseStateTransition, ExpenseList, ListMenu
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
                byId: 'byId',
                pageGet: 'page'
            }),
            isEditState () {
                return typeof this.editable.value !== "undefined" && this.editable.value !== null
            },
            hasPrevious () {
                return this.pageGet.previous > 0
            },
            hasNext () {
                return this.pageGet.next > 0
            }
        },
        methods: {
            ...mapActions('household', {
                page: 'page'
            }),
            editState (expense) {
                this.editable.value = this.byId(expense.id)
                this.editable.key = expense.id
            },
            addState (expense) {
                this.editable = JSON.parse(JSON.stringify(this.editableDefault))
            },
            pageDown () {
                this.page(true)
            },
            pageUp () {
                this.page(false)
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../assets/less/general.less';

    .paginate {
        width: 100%;
        height: 2.5em;
        .inputElement();
        cursor: pointer;
        background: none;
    }
</style>