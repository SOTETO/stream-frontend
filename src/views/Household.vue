<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('household.header.box.list')">
                <table class="exposes">
                    <thead>
                        <tr>
                            <th>{{ $t("household.header.table.what") }}</th>
                            <th>{{ $t("household.header.table.wherefor") }}</th>
                            <th>{{ $t("household.header.table.crew") }}</th>
                            <th>{{ $t("household.header.table.amount") }}</th>
                            <th>{{ $t("household.header.table.date") }}</th>
                            <th>{{ $t("household.header.table.supporter") }}</th>
                            <th>{{ $t("household.header.table.state") }}</th>
                            <th>{{ $t("household.header.table.process") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="expose in exposes" :key="expose.id">
                            <td>
                                <span>{{ expose.what }}</span><br />
                                <button
                                        class="vca-button-inline"
                                        @click="editState(expose)"
                                >{{ $t("household.buttons.edit") }}</button>
                            </td>
                            <td>{{ expose.wherefor }}</td>
                            <td><Tag :crew="true" :uuid="expose.author" /></td>
                            <td  class="vca-amount-wrapper">
                                <span class="vca-amount">
                                    {{ expose.amount[expose.amount.length - 1] }}
                                </span>
                                <div class="vca-amount-previous">
                                    <span v-if="expose.amount.length > 1" class="vca-amount">
                                        {{ expose.amount[expose.amount.length - 2] }}
                                    </span>
                                    <span v-if="expose.amount.length > 2" class="vca-amount">...</span>
                                </div>
                            </td>
                            <td>
                                <div class="dates">
                                    <span>{{ $t("household.hints.dates.created", { "date":  $d(new Date(expose.date.created), "short") }) }}</span>
                                    <span v-if="expose.date.created !== expose.date.updated">
                                        {{ $t("household.hints.dates.updated", { "date":  $d(new Date(expose.date.created), "short") }) }}
                                    </span>
                                </div>
                            </td>
                            <td><Tag v-for="uuid in expose.supporter" :key="uuid" :uuid="uuid" /></td>
                            <td>{{ $t("household.states." + expose.state) }}</td>
                            <td>
                                <span>{{ $t("household.process.VolunteerManager." + expose.processing.VolunteerManager) }}</span><br />
                                <span>{{ $t("household.process.Employee." + expose.processing.Employee) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
    import { mapActions, mapGetters } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { Tag } from 'vca-widget-user'
    import ExpenseForm from '../components/household/ExpenseForm'
    import ExpenseStateTransition from '../components/household/ExpenseStateTransition'

    export default {
        name: "Household",
        components: {
            VcAFrame, VcAColumn, VcABox, ExpenseForm, ExpenseStateTransition, Tag
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
        created () {
            this.init()
        },
        computed: {
            ...mapGetters('household', {
                exposes: 'overview',
                byId: 'byId'
            }),
            isEditState () {
                return typeof this.editable.value !== "undefined" && this.editable.value !== null
            }
        },
        methods: {
            ...mapActions('household', [
                'init', // map `this.init()` to `this.$store.dispatch('donations/init')`
            ]),
            editState (expose) {
                this.editable.value = this.byId(expose.id)
                this.editable.key = expose.id
            },
            addState (expose) {
                this.editable = JSON.parse(JSON.stringify(this.editableDefault))
            }
        }
    }
</script>

<style scoped lang="less">
    .exposes {
        width: 100%;
    }
    .dates {
        display: flex;
        flex-direction: column;
    }
    .vca-amount-wrapper {
        .vca-amount:not(:first-child) {
            margin-left: 0.2em
        }
        .vca-amount-previous {
            color: #8a8a8a;
        }
    }
</style>