<template>
    <table class="exposes">
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
        <tbody v-for="expose in exposes" :key="expose.id" class="expose">
        <tr>
            <td>
                <span>{{ formatWhat(expose) }}</span><br />
                <button
                        class="vca-button-inline"
                        @click="editState(expose)"
                >{{ $t("household.buttons.edit") }}</button>
            </td>
            <td>{{ formatWherefor(expose) }}</td>
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
            <td><Tag v-for="uuid in expose.supporter" :key="uuid" :uuid="uuid" /></td>
            <td>{{ $t("household.states." + expose.state) }}</td>
            <td>
                <span>{{ $t("household.process.VolunteerManager." + expose.processing.VolunteerManager) }}</span><br />
                <span>{{ $t("household.process.Employee." + expose.processing.Employee) }}</span>
            </td>
        </tr>
        <tr>
            <td colspan="7">
                <div class="dates">
                    <span>{{ $t("household.hints.dates.created", { "date":  $d(new Date(expose.date.created), "short") }) }}</span>
                    <span v-if="expose.date.created !== expose.date.updated">
                        {{ $t("household.hints.dates.updated", { "date":  $d(new Date(expose.date.created), "short") }) }}
                    </span>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import { Tag } from 'vca-widget-user'

    export default {
        name: "ExpenseList",
        components: {
            Tag
        },
        computed: {
            ...mapGetters('household', {
                exposes: 'overview'
            })
        },
        created () {
            this.init()
        },
        methods: {
            ...mapActions('household', [
                'init', // map `this.init()` to `this.$store.dispatch('donations/init')`
            ]),
            editState (expose) {
                this.$emit("vca-edit-expose", expose)
            },
            formatWhat (expose) {
                var res = expose.what
                if(typeof res === "undefined" || res === null || res === "") {
                    res = this.$t("household.hints.reason.what.missing")
                }
                return res
            },
            formatWherefor (expose) {
                var res = expose.wherefor
                if(typeof res === "undefined" || res === null || res === "") {
                    res = this.$t("household.hints.reason.wherefor.missing")
                }
                return res
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/less/general";

    .exposes {
        width: 100%;

        & .expose:nth-child(even) {
            background-color: #colors[primaryDeactivated];
        }
    }
    .dates {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        & span {
            margin-left: 0.5em;
        }
        padding: 0.2em;
        font-size: 0.8em;
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