<template>
    <table class="takings">
        <thead>
        <tr>
            <th>{{ $t("takings.header.table.title") }}</th>
            <th>{{ $t("takings.header.table.crew") }}</th>
            <th>{{ $t("takings.header.table.amount") }}</th>
            <th>{{ $t("takings.header.table.deposited") }}</th>
            <th>{{ $t("takings.header.table.date") }}</th>
            <th>{{ $t("takings.header.table.supporter") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="taking in takings" :key="taking.id" class="takings">
            <td>{{ taking.name }}</td>
            <td class="crew"><Tag :uuid="taking.author" :crew="true" /></td>
            <td>{{ formatAmount(taking.amount) }}</td>
            <td>{{ taking.deposited }}</td>
            <td>
                <div class="dates">
                    <span>{{ $t("takings.hints.dates.received", { "date":  formatDate(taking.date.received) }) }}</span>
                    <span>{{ $t("takings.hints.dates.created", { "date":  formatDate(taking.date.created) }) }}</span>
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
            ...mapGetters('takings', {
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
            supporter (taking) {
                return [taking.author].concat(taking.supporter)
                    .filter((value, index, self) => self.indexOf(value) === index)
            },
            teaserSupporter (taking) {
                return this.supporter(taking).slice(0, this.maximumTags)
            },
            hasAddtionalSupporter (taking) {
                return this.supporter(taking).length > this.maximumTags
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

    .dates {
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
</style>ü