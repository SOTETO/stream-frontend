<template>
    <VcABox :first="first" :title="$t('takings.header.box.amount')">
        <template slot="header">
            <el-select v-model="currency" size="small">
                <el-option
                        v-for="c in currencyOptions"
                        :key="c"
                        :label="$t('takings.currencies.label.' + c)"
                        :value="c">
                </el-option>
            </el-select>
        </template>
        <div class="collector">
            <el-form-item
                class="vca-form user-select"
                :required="false"
                :label="$t('takings.placeholder.involved.label')"
                >
                <WidgetUserAutocomplete
                        :placeholder="$t('takings.placeholder.involved.indicator')"
                        :preselection="involvedSupporter"
                        @vca-user-selection="selectSupporter"
                />
            </el-form-item>
            <el-form-item
                class="vca-form"
                :required="true"
                :label="$t('takings.placeholder.received')">
                <el-date-picker
                    v-model="received"
                    type="date"
                    :placeholder="$t('takings.placeholder.received')"
                    format="dd. MMM. yyyy"
                    value-format="timestamp"
                    :clearable="false"
                    :picker-options="datePickerOptions"
                    @change="commit">
                </el-date-picker>
            </el-form-item>
            <table class="sources">
                <thead>
                    <tr>
                        <th>{{ $t('takings.header.source.sourceSelect') }}</th>
                        <th>{{ $t('takings.header.source.sum') }}</th>
                        <th>{{ $t('takings.header.source.sourceType.cash') }}</th>
                        <th>{{ $t('takings.header.source.sourceType.extern') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <TakingsSource
                        v-for="t in sourceTypes"
                        :category="t.category"
                        :currency="currency"
                        :checked="getCheckedSource(t.category)"
                        :type="getTypeSource(t.category)"
                        :numeric="getNumericSource(t.category)"
                        :description="t.desc"
                        :descriptionText="getDescSource(t.category)"
                        :key="t.category + currency"
                        @input="changeDonation"
                        @deselect="deselect"
                    />
                </tbody>
            </table>
        </div>
        <div class="evaluation">
            <span class="part">{{ $t('takings.hints.total.cash', { 'total': getTotalCash.localize() }) }}</span>
            <span class="part">{{ $t('takings.hints.total.extern', { 'total': getTotalExtern.localize() }) }}</span>
            <span class="all">{{ $t('takings.hints.total.all', { 'total': getTotalAll.localize() }) }}</span>
        </div>
    </VcABox>
</template>

<script>
    import { DatePicker, FormItem, Select, Option } from 'element-ui'
    import { VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { WidgetUserAutocomplete } from 'vca-widget-user'
    import 'vca-widget-user/dist/vca-widget-user.css'
    import TakingsSource from '@/components/takings/TakingsSource.vue'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "TakingsCalculator",
        components: {
            "el-date-picker": DatePicker,
            "el-form-item": FormItem,
            "el-select": Select,
            "el-option": Option,
            "TakingsSource": TakingsSource,
            'WidgetUserAutocomplete': WidgetUserAutocomplete,
            "VcABox": VcABox
        },
        props: {
            "first": {
               "type": Boolean,
               "default": true
            },
            "value": {
               "type": Object,
                "required": false
            }
        },
        data () {
            var sources = []
            var received = Date.now()
            var involvedSupporter = []
            if(typeof this.value !== "undefined" && this.value !== null) {
                if(this.value.hasOwnProperty("sources")) {
                    sources = this.value.sources
                }
                if(this.value.hasOwnProperty("received")) {
                    received = this.value.received
                }
                if(this.value.hasOwnProperty("involvedSupporter")) {
                    involvedSupporter = this.value.involvedSupporter
                }
            }
            return {
                "datePickerOptions": {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                "sourceTypes": [
                    { "category": "unknown", "desc": false},
                    { "category": "can", "desc": false},
                    { "category": "other", "desc": true}
                ],
                "currency": this.$t("currencies.default"),
                "currencyOptions": [
                    "EUR", "USD", "CHF"
                ],
                "involvedSupporter": involvedSupporter,
                "received": received,
                "sources": sources
            }
        },
        computed: {
            getTotalCash: function () {
                return this.getTotal("cash")
            },
            getTotalExtern: function () {
                return this.getTotal("extern")
            },
            getTotalAll: function () {
                return this.getTotal()
            }
        },
        created () {
            if(typeof this.value !== "undefined" && this.value !== null) {
                if(this.value.hasOwnProperty("received")) {
                    this.received = this.value.received
                }
                if(this.value.hasOwnProperty("sources")) {
                    this.sources = this.value.sources
                }
                if(this.value.hasOwnProperty("involvedSupporter")) {
                    this.involvedSupporter = this.value.involvedSupporter
                }
            }
            this.commit()
        },
        methods: {
            changeDonation(source) {
                var copy = this.sources.slice(0)
                copy = copy.filter(s => source.category !== s.category)
                copy.push(source)
                this.sources = copy
                this.commit()
            },
            deselect(category) {
                var copy = this.sources.slice(0)
                copy = copy.filter(s => category !== s.category)
                this.sources = copy
                this.commit()
            },
            getTotal(part) {
                const reducer = (acc, c) => acc + c.amount
                const filter = source => source.type === part
                var result = this.sources.reduce(reducer, 0);
                if(typeof part === "string" && (part === "cash" || part === "extern")) {
                    result = this.sources.filter(filter).reduce(reducer, 0)
                }
                return CurrencyFormatter.getFromNumeric(this.currency, result)
            },
            commit() {
                var result = {
                    "received": this.received,
                    "sources": this.sources,
                    "involvedSupporter": this.involvedSupporter
                }
                this.$emit("input", result)
            },
            getCheckedSource(category) {
                var source = this.sources.filter(s => s.category === category).pop()
                var result = false
                if(typeof source !== "undefined") {
                    result = true
                }
                return result
            },
            getTypeSource(category) {
                var source = this.sources.filter(s => s.category === category).pop()
                var result = "cash"
                if(typeof source !== "undefined") {
                    result = source.type
                }
                return result
            },
            getNumericSource(category) {
                var source = this.sources.filter(s => s.category === category).pop()
                var result = 0.0
                if(typeof source !== "undefined") {
                    result = source.amount
                }
                return result
            },
            getDescSource(category) {
                var source = this.sources.filter(s => s.category === category).pop()
                var result = ""
                if(typeof source !== "undefined" && source !== null && source.hasOwnProperty("description")) {
                    result = source.description
                }
                return result
            },
            selectSupporter(supporter) {
                this.involvedSupporter = supporter
            }
        }
    }
</script>

<style scoped lang="less">
    .vca-form .el-input {
        width: 100%;
    }

    .user-select /deep/ .small {
        font-size: 100%;
    }

    .sources {
        width: 100%;
        & /deep/ th:not(:first-child), & /deep/ td:not(:first-child) {
            padding-left: 1em;
        }

        thead tr th {
            padding-bottom: 1em;
        }
    }

    .evaluation {
        border-top: 1px solid rgb(220, 223, 230);
        display: flex;
        flex-direction: column;
        padding-top: 1em;
        margin-top: 1em;
        .part {

        }
        .all {
            font-weight: bold;
            font-size: 1.2em;
        }
    }

</style>