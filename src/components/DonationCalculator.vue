<template>
    <VcABox :first="first" :title="$t('donation.header.box.amount')">
        <template slot="header">
            
        </template>
        <div class="collector">
            <el-form-item
                class="vca-form"
                :label="$t('donation.placeholder.received')">
                <el-date-picker
                    v-model="received"
                    type="date"
                    :placeholder="$t('donation.placeholder.received')"
                    :picker-options="datePickerOptions">
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
                    <DonationSource v-for="category in sourceTypes" :category="category" :key="category" @input="changeDonation" />
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
    import { DatePicker, FormItem } from 'element-ui'
    import { VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import DonationSource from '@/components/DonationSource.vue'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "DonationCalculator",
        components: {
            "el-date-picker": DatePicker,
            "el-form-item": FormItem,
            "DonationSource": DonationSource,
            "VcABox": VcABox
        },
        props: {
           "first": {
               "type": Boolean,
               "default": true
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
                    "can", "box", "gl"
                ],
                "received": new Date(),
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
        methods: {
            changeDonation(source) {
                var copy = this.sources.slice(0)
                copy = copy.filter(s => source.category !== s.category)
                copy.push(source)
                this.sources = copy
            },
            getTotal(part) {
                const reducer = (acc, c) => acc + c.amount
                const filter = source => source.type === part
                var result = this.sources.reduce(reducer, 0);
                if(typeof part === "string" && (part === "cash" || part === "extern")) {
                    result = this.sources.filter(filter).reduce(reducer, 0)
                }
                return CurrencyFormatter.getFromNumeric("euro", result)
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