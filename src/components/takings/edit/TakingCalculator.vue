<template>
    <div>
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
          <el-form :model="dataForm" :rules="rules">
            <el-form-item
                class="vca-form user-select"
                :required="false"
                :label="$t('donation.placeholder.involved.label')"
                prop="who"
                >
                <WidgetUserAutocomplete
                        :placeholder="$t('donation.placeholder.involved.indicator')"
                        :preselection="amount.involvedSupporter"
                        @vca-user-selection="selectSupporter"
                        v-model="dataForm.who"
                />
            </el-form-item>
            <el-form-item
                class="vca-form"
                :label="$t('donation.placeholder.received')"
                prop="when"
            >
                <el-date-picker
                    v-model="dataForm.when"
                    :placeholder="$t('donation.placeholder.received')"
                    format="dd.MMM.yyyy"
                    :default-value="formatReceived"
                    :picker-options="datePickerOptions">
                </el-date-picker>
            </el-form-item>
          <el-form-item
          :label="$t('donation.header.donationSource.sourceSelect')"
          prop="where">
          <br/>
            <TakingSelectSource v-on:input="addSourceType($event)"/>
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
           <!--     {{ amount.sources[0].amount.amount }} -->

                    <TakingSource
                        v-for="t in amount.sources"
                        :source="t"
                        :category="t.category"
                        :checked="getCheckedSource(t.category)"
                        :type="getTypeSource(t.category)"
                        :numeric="getNumericSource(t.category)"
                        :description="t.desc"
                        :descriptionText="getDescSource(t.category)"
                        :key="t.category"
                    />
                </tbody>
            </table>
          </el-form>
        </div>
        <div class="evaluation">
            <span class="part">{{ $t('donation.hints.total.cash', { 'total': getTotalCash.localize() }) }}</span>
            <span class="part">{{ $t('donation.hints.total.extern', { 'total': getTotalExtern.localize() }) }}</span>
            <span class="all">{{ $t('donation.hints.total.all', { 'total': getTotalAll.localize() }) }}</span>
        </div>
    </div>
</template>

<script>
    import { DatePicker, FormItem, Select, Option} from 'element-ui'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import { WidgetUserAutocomplete } from 'vca-widget-user'
    import 'vca-widget-user/dist/vca-widget-user.css'
    import TakingSelectSource from '@/components/takings/edit/TakingSelectSource'
    import TakingSource from '@/components/takings/edit/TakingSource.vue'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "TakingCalculator",
        components: {
            "el-date-picker": DatePicker,
            "el-form-item": FormItem,
            "el-select": Select,
            "el-option": Option,
/*            "el-tag": Tag,
            "el-input": Input,*/
            "TakingSource": TakingSource,
            'WidgetUserAutocomplete': WidgetUserAutocomplete,
            "TakingSelectSource": TakingSelectSource
        },
        props: {
            amount: {
              type: Object,
              default: function () {
                return {
                  "received": this.dataForm.when,
                  "sources": '',
                  "involvedSupporter": this.dataForm.who
                }
              }
            },
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
                    received = this.dataForm.when
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

                result: Number,

                dataForm: {
                  when:'',
                  who: '',
                },

                rules: {
                  who: [
                    { required: true, message: 'test', trigger:'change' }
                  ],
                  when: [
                    { type: 'date', required: true, pattern:/^\d{2}.[a-zA-Z]{3}.\d{4}$/, message: 'test', trigger:'change' },
                  ],
                  where: [
                    { type: 'array', required: true, message: 'test', trigger:'blur' }
                  ],
                },

              "sourceTypes": [
                    { "category": "unknown", "desc": false },
                    { "category": "can", "desc": false },
                    { "category": "box", "desc": false },
                    { "category": "gl", "desc": false },
                    { "category": "other", "desc": true },
                    { "category": "merch", "desc": false },
                    { "category": "other_ec", "desc": true }
                ],
                "currentSourceType": [

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
              return this.getTotal('cash')
            },
            getTotalExtern: function () {
                return this.getTotal('extern')
            },
            getTotalAll: function () {
                return this.getTotal()
            },
            formatReceived: function() {
                return new Date(this.amount.received)
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
            this.dataForm.when = this.formatReceived
        },
        methods: {
          addSourceType(value) {
            this.amount.sources.push(value)
          },
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
            const reducer = (acc, c) => acc + c.amount.amount
            const filter = source => source.typeOfSource === part
            var result = this.amount.sources.reduce(reducer, 0);
            if (typeof part === 'string' && (part === 'cash' || part === 'extern')) {
              result = this.amount.sources.filter(filter).reduce(reducer, 0)
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
                var result = 0.00
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
                this.amount.involvedSupporter = supporter
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
