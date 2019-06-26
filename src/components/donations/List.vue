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
        <tr v-for="donation in donations" :key="donation.id" class="donation">
            <td>{{ donation.name }}</td>
            <td class="crew"><CrewPlainName :id="donation.crew" /></td>
            <td>{{ formatAmount(donation.amount) }}</td>
            <td>
                <DepositLights :donation="donation" />
            </td>
            <td>
                <div class="dates">
                    <span>{{ $t("donation.hints.dates.received", { "date":  formatDate(donation.date.received) }) }}</span>
                    <span>{{ $t("donation.hints.dates.created", { "date":  formatDate(donation.date.created) }) }}</span>
                </div>
            </td>
            <td>
                <div class="supporter">
                    <Tag v-for="uuid in teaserSupporter(donation)" :uuid="uuid" :key="'sup-' + uuid" />
                    <span v-if="hasAddtionalSupporter(donation)">...</span>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters, mapActions } from 'vuex'
    import { Tag, CrewPlainName } from 'vca-widget-user'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'
    import DepositLights from '@/components/donations/DepositLights'
    import { Notification } from 'element-ui'

    Vue.use(Notification)
    Notification.closeAll()

    export default {
        name: "List",
        components: {
            Tag, CrewPlainName, DepositLights
        },
        computed: {
            ...mapGetters('donations', {
                donations: 'overview',
                isError: 'isError',
                getErrorCode: 'getErrorCode',
            }),
            maximumTags () {
                return 2;
            }
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
            supporter (donation) {
                return [donation.author].concat(donation.supporter)
                    .filter((value, index, self) => self.indexOf(value) === index)
            },
            teaserSupporter (donation) {
                return this.supporter(donation).slice(0, this.maximumTags)
            },
            hasAddtionalSupporter (donation) {
                return this.supporter(donation).length > this.maximumTags
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
    @import '../../assets/less/general.less';

    .donations {
        width: 100%;

        & .donation:nth-child(even) {
            background-color: #colors[primaryDeactivated];
        }

        & th {
            .colorProfilePrimary();
            font-weight: bold;
            padding: 0.25em 0;
            &:first-child {
                padding-left: 0.5em;
            }
            &:last-child {
                padding-right: 0.5em;
            }
        }
    }

    .donation {
        & tr {
            padding: 0.5em 0.5em 0 0.15em;
        }
        & td {
            padding: 0.5em 0.5em 0.5em 0.5em;
            vertical-align: top;
        }
    }

    .dates, .deposit {
        display: flex;
        flex-direction: column;
        padding: 0.2em;
        font-size: 0.8em;
    }
    .crew, .supporter {
        display: flex;
        flex-direction: row;
        & /deep/ .tag {
            margin-right: 0.5em;
        }
    }
</style>