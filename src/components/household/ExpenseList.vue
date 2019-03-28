<template>
    <table class="expenses">
        <thead>
            <tr>
                <th>{{ $t("household.header.table.what") }}</th>
                <th>{{ $t("household.header.table.wherefor") }}</th>
                <th>{{ $t("household.header.table.crew") }}</th>
                <th>{{ $t("household.header.table.amount") }}</th>
                <th>{{ $t("household.header.table.supporter") }}</th>
                <th>{{ $t("household.header.table.state") }}</th>
                <th>{{ $t("household.header.table.process") }}</th>
            </tr>
        </thead>
        <ExpenseListEntry v-for="expense in expenses" :key="expense.id" :expense="expense" @vca-edit-expense="editState" />
    </table>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import ExpenseListEntry from './ExpenseListEntry'

    export default {
        name: "ExpenseList",
        components: {
            ExpenseListEntry
        },
        computed: {
            ...mapGetters('household', {
                expenses: 'overview'
            })
        },
        created () {
            this.init()
        },
        methods: {
            ...mapActions('household', [
                'init', // map `this.init()` to `this.$store.dispatch('donations/init')`
            ]),
            editState (expense) {
                this.$emit("vca-edit-expense", expense)
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/less/general";

    .expenses {
        width: 100%;

        & .expense:nth-child(even) {
            background-color: #colors[primaryDeactivated];
        }
    }
</style>