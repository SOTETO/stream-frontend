<template>
    <table class="takings">
        <thead>
        <tr>
            <th>{{ $t("takings.table.head.norms") }}
            <th>{{ $t("takings.table.head.title") }}</th>
            <th>{{ $t("takings.table.head.crew") }}</th>
            <th>{{ $t("takings.table.head.amount") }}</th>
            <th>{{ $t("takings.table.head.deposited") }}</th>
            <th>{{ $t("takings.table.head.date") }}</th>
            <th>{{ $t("takings.table.head.supporter") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="taking in takings" :key="taking.id" class="taking">
            <td>{{ formatNorms(taking.norms) }}</td>
            <td>{{ taking.name }}</td>
            <td class="crew"><CrewPlainName :id="taking.crew" /></td>
            <td>{{ formatAmount(taking.amount) }}</td>
            <td>
                <DepositLights :donation="taking" />
            </td>
            <td>
                <div class="dates">
                    <span>{{ $t("takings.table.dates.received", { "date":  formatDate(taking.date.received) }) }}</span>
                    <span>{{ $t("takings.table.dates.created", { "date":  formatDate(taking.date.created) }) }}</span>
                </div>
            </td>
            <td>
                <div class="supporter">
                    <Tag v-for="uuid in teaserSupporter(taking)" :uuid="uuid" :key="'sup-' + uuid" />
                    <span v-if="hasAddtionalSupporter(taking)">...</span>
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
    import DepositLights from '@/components/takings/DepositLights'
    import { Notification } from 'element-ui'

    Vue.use(Notification)
    Notification.closeAll()

    export default {
        name: "List",
        components: {
            Tag, CrewPlainName, DepositLights
        },
        computed: {
            ...mapGetters('takings', {
                takings: 'overview',
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
            ...mapActions('takings', [
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
            formatNorms(norms) {
              if (norms === "ECONOMY") {
                return "W"
              } else {
                return "D"
              }
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

    .takings {
        width: 100%;

        & .takings:nth-child(even) {
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

    .taking {
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
