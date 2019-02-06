<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('household.header.box.list')">
                <table class="exposes">
                    <thead>
                        <tr>
                            <th>Was?</th>
                            <th>Wofür?</th>
                            <th>Crew</th>
                            <th>Betrag</th>
                            <th>Datum</th>
                            <th>Beteiligte</th>
                            <th>Status</th>
                            <th>Bearbeitung</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="expose in exposes" :key="expose.id">
                            <td>{{ expose.what }}</td>
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
                <ExpenseForm @input="save" />
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import ExpenseForm from '../components/household/ExpenseForm'

    export default {
        name: "Household",
        components: {
            VcAFrame, VcAColumn, VcABox, ExpenseForm
        },
        computed: {
            ...mapGetters('household', {
                exposes: 'overview'
            })
        },
        methods: {
            ...mapActions('household', [
                'add', // -> this.foo()
            ]),
            save (expose) {
                this.add(expose)
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