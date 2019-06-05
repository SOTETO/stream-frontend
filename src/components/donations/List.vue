<template>
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
</template>

<script>
    import Vue from 'vue'
    import { mapGetters, mapActions } from 'vuex'
    import { Tag } from 'vca-widget-user'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'
    import { Notification } from 'element-ui'

    Vue.use(Notification)
    Notification.closeAll()

    export default {
        name: "List",
        components: {
            Tag
        },
        computed: {
            ...mapGetters('donations', {
                donations: 'overview',
                isError: 'isError',
                getErrorCode: 'getErrorCode',
            }),
        },
        created () {
            if(this.isError) {
                switch(this.getErrorCode) {
                    case 400:
                        this.open(this.$t('errors.ajax.badRequest.header'), this.$t('errors.ajax.badRequest.msg'), 'error')
                        break;
                    case 403:
                        this.open(this.$t('errors.ajax.forbidden.header'), this.$t('errors.ajax.forbidden.msg'), 'error')
                        break;
                    case 404:
                        this.open(this.$t('errors.ajax.notFound.header'), this.$t('errors.ajax.notFound.msg'), 'error')
                        break;
                    default:
                        if(this.getErrorCode > 404) {
                            this.open(this.$t('errors.ajax.server.header'), this.$t('errors.ajax.server.msg'), 'error')
                        }
                }
            } else {
                this.init()
            }
        },
        methods: {
            ...mapActions('donations', [
                'init', // map `this.init()` to `this.$store.dispatch('donations/init')`
            ]),
            formatAmount(amount) {
                var formatter = CurrencyFormatter.getFromNumeric("EUR", amount) // Todo: select currency based on donation entry!
                return formatter.localize()
            },
            formatDate(date) {
                var d = new Date(date)
                return this.$d(d, 'short')
            },
            open(title, message, type) {
                Notification({
                    title:  title,
                    message: message,
                    type: type
                });
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