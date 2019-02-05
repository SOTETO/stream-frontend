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
                        <tr v-for="(expose, i) in exposes" :key="i">
                            <td>{{ expose.reason.what }}</td>
                            <td>{{ expose.reason.wherefor }}</td>
                            <td> TODO </td>
                            <td>{{ expose.amount.formatted }}</td>
                            <td> TODO </td>
                            <td> TODO </td>
                            <td> TODO </td>
                            <td> TODO </td>
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
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import ExpenseForm from '../components/household/ExpenseForm'

    export default {
        name: "Household",
        components: {
            VcAFrame, VcAColumn, VcABox, ExpenseForm
        },
        data () {
            return {
                "exposes": []
            }
        },
        methods: {
            save (expose) {
                this.exposes.push(expose)
            }
        }
    }
</script>

<style scoped>
    .exposes {
        width: 100%;
    }
</style>