<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('donation.header.box.list')">
                <table class="donations">
                    <thead>
                        <tr>
                            <th>{{ $t("donation.header.table.title") }}</th>
                            <th>{{ $t("donation.header.table.crew") }}</th>
                            <th>{{ $t("donation.header.table.amount") }}</th>
                            <th>{{ $t("donation.header.table.deposited") }}</th>
                            <th>{{ $t("donation.header.table.date") }}</th>
                            <th>{{ $t("donation.header.table.supporter") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="donation in donations" :key="donation.id">
                            <td>{{ donation.name }}</td>
                            <td><Tag :uuid="donation.author" :crew="true" /></td>
                            <td>{{ formatAmount(donation.amount) }}</td>
                            <td>{{ donation.deposited }}</td>
                            <td>
                                <div class="dates">
                                    <span>{{ $t("donation.hints.dates.received", { "date":  formatDate(donation.date.received) }) }}</span>
                                    <span>{{ $t("donation.hints.dates.created", { "date":  formatDate(donation.date.created) }) }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="supporter">
                                    <Tag :uuid="donation.author" :key="donation.author" />
                                    <Tag v-for="uuid in donation.supporter" :uuid="uuid" :key="uuid" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </VcABox>
        </VcAColumn>
        <VcAColumn size="20%">
            <VcABox :first="true" :title="$t('donation.header.box.list-methods')">
                <router-link class="vca-button-primary vca-full-width" to="/donations/add">{{ $t('donation.buttons.add') }}</router-link>
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { Tag } from 'vca-widget-user'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "donations",
        components: {
            VcAFrame, VcAColumn, VcABox, Tag
        },
        computed: {
            // ...mapState({
            //     checkoutStatus: state => state.cart.checkoutStatus
            // }),
            ...mapGetters('donations', {
                donations: 'overview'
            })
            // donations () {
            //     return this.$store.state.donations.items
            // }
        },
        methods: {
            formatAmount(amount) {
                var formatter = CurrencyFormatter.getFromNumeric("EUR", amount) // Todo: select currency based on donation entry!
                return formatter.localize()
            },
            formatDate(date) {
                var d = new Date(date)
                return this.$d(d, 'short')
            }
        }
    }
</script>

<style scoped lang="less">
    .donations {
        width: 100%;
    }
    .dates {
        display: flex;
        flex-direction: column;
    }
    .supporter {
        display: flex;
        flex-direction: row;
        & /deep/ .user-role-wrapper:not(:first-child) {
            margin-left: 0.2em;
        }
    }
</style>