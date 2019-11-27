<template>
    <el-form-item
        class="vca-money-wrapper"
        :class="amountErrorState ? 'vca-error' : ''"
    >
        <el-input class="vca-input" v-model="displayAmount" @input="validate" :placeholder="label" :disabled="disabled" />
        <div
                v-if="amountErrorState"
                class="el-form-item__error"
        >
            {{ errorMsg }}
        </div>
    </el-form-item>
</template>

<script>
    import { Input, FormItem } from 'element-ui'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "MoneyInput",
        components: {
            "el-input": Input,
            "el-form-item": FormItem
        },
        props: {
            amount: {
              type: Object,
              default: function () {
                return {
                  "amount": 0.0,
                  "currency": "EUR"
                }
              }
            },
            "rules": {
                "type": Array,
                "default": () => [{
                    "validator": (numericValue) => false,
                    "msg": ""
                }]
            },
            label: {
                "type": String,
                "default": ""
            },
            disabled: {
                "type": Boolean,
                "default": false
            },
        },
        data () {
            var formatter = CurrencyFormatter.getFromNumeric(this.amount.currency, this.amount.amount)
            var displayAmount = formatter.localize()
            return {
                "displayAmount": displayAmount,
                "amountErrorState": false,
                "errorMsg": this.$t('donation.hints.error.amount.pattern')
            }
        },
        methods: {
            internalValidation(numeric) {
               return this.rules.reduce((acc, rule) => {
                   var res = acc
                   if(rule.validator(numeric)) {
                      res = {
                          "valid": false,
                          "msg": rule.msg
                      }
                   }
                   return res
               }, {
                   "valid": true
               })
            },
            validate(value) {
                var formatter = new CurrencyFormatter(this.amount.currency, value)
                var internal = this.internalValidation(formatter.getNumeric())
                if (formatter.match() && internal.valid) {
                    this.amount.currency = formatter.selectedCurrency
                    this.amount.amount = formatter.getNumeric()
                    this.numericAmount = formatter.getNumeric()
                    this.amountErrorState = false
                } else if(!formatter.match()) {
                    this.amountErrorState = true
                } else if(!internal.valid) {
                    this.amountErrorState = true
                    this.errorMsg = internal.msg
                }
            }
        }
    }
</script>

<style scoped>
    .vca-money-wrapper.vca-error {
        margin-bottom: 2em;
    }

</style>
