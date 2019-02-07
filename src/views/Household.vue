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
                                <span>{{ expose.what }}</span>
                                <button
                                        class="vca-button-secundary"
                                        @click="editState(expose)"
                                >{{ $t("household.buttons.edit") }}</button>
                            </td>
                            <td>{{ expose.wherefor }}</td>
                            <td>{{ expose.crew }}</td>
                            <td>{{ expose.amount }}</td>
                            <td>
                                <div class="dates">
                                    <span>{{ $t("household.hints.dates.created", { "date":  $d(new Date(expose.date.created), "short") }) }}</span>
                                    <span v-if="expose.date.created !== expose.date.updated">
                                        {{ $t("household.hints.dates.updated", { "date":  $d(new Date(expose.date.created), "short") }) }}
                                    </span>
                                </div>
                            </td>
                            <td>{{ expose.supporter }}</td>
                            <td>{{ formatState(expose.state) }}</td>
                            <td>{{ expose.processing }}</td>
                        </tr>
                    </tbody>
                </table>
            </VcABox>
        </VcAColumn>
        <VcAColumn size="20%">
            <VcABox :first="true" :title="$t('household.header.box.expense')">
                <ExpenseForm v-model="editable.value" :key="editable.key" @vca-expense-update="addState" />
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import ExpenseForm from '../components/household/ExpenseForm'

    export default {
        name: "Household",
        components: {
            VcAFrame, VcAColumn, VcABox, ExpenseForm
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
                exposes: 'overview',
                byId: 'byId'
            }),
            isEditState () {
                return typeof this.editable.value !== "undefined" && this.editable.value !== null
            }
        },
        methods: {
            editState (expose) {
                this.editable.value = this.byId(expose.id)
                this.editable.key = expose.id
            },
            addState (expose) {
                this.editable = JSON.parse(JSON.stringify(this.editableDefault))
            },
            formatState(state) {
                var stringified = this.$t("household.states.appliedFor")
                if(state) {
                    stringified = this.$t("household.states.requested")
                }
                return stringified
            }
        }
    }
</script>

<style scoped>
    .exposes {
        width: 100%;
    }
    .dates {
        display: flex;
        flex-direction: column;
    }
</style>