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
                <el-tag
                  v-for="user in amount.involvedSupporter"
                  :disable-transitions="false">
                  {{ user.name}}
                </el-tag>
            </el-form-item>
            <el-form-item
                class="vca-form"
                :label="$t('donation.placeholder.received')"
                prop="when"
            >
                <el-date-picker
                    v-model="dataForm.when"
                    @change="changeWhen"
                    :placeholder="$t('donation.placeholder.received')"
                    format="dd.MMM yyyy"
                    :default-value="formatReceived"
                    :picker-options="datePickerOptions">
                </el-date-picker>
            </el-form-item>
          <el-form-item
          :label="$t('donation.header.donationSource.sourceSelect')"
          prop="where">
          <br/>
            <TakingSelectSource v-on:input="addSourceType($event)" :sources="amount.sources"/>
          </el-form-item>
            <table class="sources">
                <col width="65%">
                <col width="20%">
                <col width="5%">
                <col width="*">
                <thead>
                    <tr>
                        <th>{{ $t('donation.header.donationSource.sourceSelect') }}</th>
                        <th>{{ $t('donation.header.donationSource.sum') }}</th>
                        <th>{{ $t('donation.header.donationSource.sourceType.cash') }}</th>
                        <th>{{ $t('donation.header.donationSource.sourceType.extern') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <TakingSource
                        v-for="t in amount.sources"
                        :source="t"
                        :category="t.category"
                        :checked="getCheckedSource(t.category)"
                        :type="getTypeSource(t.category)"
                        :numeric="getNumericSource(t.category)"
                        :description="t.desc"
                        :descriptionText="getDescSource(t.category)"
                        :key="t.key"
                        :disableDelete="disableDelete(t)"
                        v-on:delete="deleteSource(t)"
                    />
                </tbody>
            </table>
          </el-form>
        </div>
        <div class="evaluation">
            <span class="part">{{ $t('donation.hints.total.cash', { 'total': getTotalCash }) }}</span>
            <span class="part">{{ $t('donation.hints.total.extern', { 'total': getTotalExtern }) }}</span>
            <span class="all">{{ $t('donation.hints.total.all', { 'total': getTotalAll }) }}</span>
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
import Money from '@/utils/Money'

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
            sourceCount: {
              type: Number,
              default: 0
            },
            amount: {
              type: Object,
              default: function () {
                return {
                  "received": '',
                  "sources": '',
                  "involvedSupporter": this.dataForm.who
                }
              }
            },
        },
        watch: {
            amount: function(amount, oldAmount) {
                if(amount.hasOwnProperty("received")) {
                    this.received = this.received
                    this.dataForm.when = this.formatReceived
                }
                if(amount.hasOwnProperty("sources")) {
                    this.sources = amount.sources
                }
                if(amount.hasOwnProperty("involvedSupporter")) {
                    this.involvedSupporter = amount.involvedSupporter
                }
            }
        },
        data () {
            var sources = []
            var received = new Date()
            var involvedSupporter = []
            if(typeof this.amount !== "undefined" && this.amount !== null) {
                if(this.amount.hasOwnProperty("sources")) {
                    sources = this.amount.sources
                }
                if(this.amount.hasOwnProperty("received")) {
                    received = this.amount.received
                }
                if(this.amount.hasOwnProperty("involvedSupporter")) {
                    involvedSupporter = this.amount.involvedSupporter
                }
            }

            return {
                "datePickerOptions": {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                "count": this.amount.sources.length,

                result: Number,

                dataForm: {
                  when: '',
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
                    { "category": "com", "desc": false },
                    { "category": "better", "desc": false },
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
            if(typeof this.amount !== "undefined" && this.amount !== null) {
                if(this.amount.hasOwnProperty("received")) {
                    this.received = this.received
                    this.dataForm.when = this.formatReceived
                }
                if(this.amount.hasOwnProperty("sources")) {
                    this.sources = this.amount.sources
                }
                if(this.amount.hasOwnProperty("involvedSupporter")) {
                    this.involvedSupporter = this.amount.involvedSupporter
                }
            }
        },
        methods: {
          addSourceType(value) {
            var valueExists = this.amount.sources.filter(t => t.category === value.category)

            if (valueExists.length === 0) {
              this.amount.sources.push(value)
            }
          },
          deleteSource(value) {
            var index = this.amount.sources.indexOf(value);
            if (index > -1) {
              this.amount.sources.splice(index, 1);
            }
          },
          disableDelete(value) {
            var index = this.amount.sources.indexOf(value)
            if(index < this.sourceCount) {
              return true
            } else {
              return false
            }
          },
          getWhen() {
            var day = this.formatReceived.getDate()
            var month = this.formatReceived.toString().substr(4,3)
            var year = this.formatReceived.getFullYear()
            return day + "." + month + " " + year
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
          changeWhen() {
            this.received = Date.parse(this.dataForm.when)
            this.commit()
          },
          getTotal(part) {
            const reducer = (acc, c) => acc + c.amount.amount
            const filter = source => source.typeOfSource === part
            var result = this.amount.sources.reduce(reducer, 0);
            if (typeof part === 'string' && (part === 'cash' || part === 'extern')) {
              result = this.amount.sources.filter(filter).reduce(reducer, 0)
            }
            return Money.getString(result, this.currency)
          },
            commit() {
                var result = {
                    "received": this.received,
                    "sources": this.sources,
                    "involvedSupporter": this.involvedSupporter
                }
                this.$refs[this.dataForm].validate((valid) => {
                  if (valid) {
                    alert('submit');
                  } else {
                    console.log('error submit');
                  }
                });
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
