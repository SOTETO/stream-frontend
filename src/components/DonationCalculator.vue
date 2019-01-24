<template>
    <VcABox :first="first" :title="$t('donation.header.box.amount')">
        <template slot="header">
            <el-select v-model="currency" size="small">
                <el-option
                        v-for="c in currencyOptions"
                        :key="c"
                        :label="$t('currencies.label.' + c)"
                        :value="c">
                </el-option>
            </el-select>
        </template>
        <div class="collector">
            <el-form-item
                class="vca-form"
                :required="true"
                :label="$t('donation.placeholder.received')">
                <el-date-picker
                    v-model="received"
                    type="date"
                    :placeholder="$t('donation.placeholder.received')"
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
                        <th>{{ $t('donation.header.donationSource.sourceSelect') }}</th>
                        <th>{{ $t('donation.header.donationSource.sum') }}</th>
                        <th>{{ $t('donation.header.donationSource.sourceType.cash') }}</th>
                        <th>{{ $t('donation.header.donationSource.sourceType.extern') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <DonationSource
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
            <span class="part">{{ $t('donation.hints.total.cash', { 'total': getTotalCash.localize() }) }}</span>
            <span class="part">{{ $t('donation.hints.total.extern', { 'total': getTotalExtern.localize() }) }}</span>
            <span class="all">{{ $t('donation.hints.total.all', { 'total': getTotalAll.localize() }) }}</span>
        </div>
    </VcABox>
</template>

<script>
    import { DatePicker, FormItem, Select, Option } from 'element-ui'
    import { VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import DonationSource from '@/components/DonationSource.vue'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "DonationCalculator",
        components: {
            "el-date-picker": DatePicker,
            "el-form-item": FormItem,
            "el-select": Select,
            "el-option": Option,
            "DonationSource": DonationSource,
            "VcABox": VcABox
        },
        props: {
            "first": {
               "type": Boolean,
               "default": true
            },
            "value": {
               "type": Object
            }
        },
        data () {
            return {
                "datePickerOptions": {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                "sourceTypes": [
                    { "category": "unknown", "desc": false},
                    { "category": "can", "desc": false},
                    { "category": "box", "desc": false},
                    { "category": "gl", "desc": false},
                    { "category": "other", "desc": true}
                ],
                "currency": this.$t("currencies.default"),
                "currencyOptions": [
                    "EUR", "USD", "CHF"
                ],
                "received": Date.now(),
                "sources": []
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
                    "sources": this.sources
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
            }
        }
    }
</script>

<style scoped lang="less">
    .vca-form .el-input {
        width: 100%;
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