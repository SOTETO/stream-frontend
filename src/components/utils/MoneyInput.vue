<template>
    <el-form-item
        :required="required"
        class="vca-money-wrapper"
        :class="amountErrorState ? 'vca-error' : ''"
    >
        <el-input class="vca-input" v-model="amount" @change="validate" :placeholder="label" :disabled="disabled" />
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
            "value": {
                "type": Object,
                "required": false
            },
            "currency": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["EUR", "USD", "CHF"].indexOf(value) !== -1
                }
            },
            "numeric": {
                "type": Number,
                "default": 0.00
            },
            "label": {
                "type": String,
                "default": ""
            },
            "required": {
                "type": Boolean,
                "default": true
            },
            "disabled": {
                "type": Boolean,
                "default": false
            },
            "rules": {
                "type": Array,
                "default": () => [{
                    "validator": (numericValue) => false,
                    "msg": ""
                }]
            }
        },
        data () {
            var formatter = CurrencyFormatter.getDefault(this.currency)
            var amount = formatter.localize()
            var numericAmount = formatter.getNumeric()
            if(typeof this.value !== "undefined" && this.value !== null) {
                formatter = CurrencyFormatter.getFromNumeric(this.value.currency, this.value.amount)
                amount = formatter.localize()
                numericAmount = formatter.getNumeric()
            }
            return {
                "amount": amount,
                "numericAmount": numericAmount,
                "amountErrorState": false,
                "errorMsg": this.$t('donation.hints.error.amount.pattern')
            }
        },
        created: function () {
            var formatter = CurrencyFormatter.getFromNumeric(this.currency, this.numeric)
            var amount = formatter.localize()
            var numericAmount = formatter.getNumeric()
            if(typeof this.value !== "undefined" && this.value !== null) {
                formatter = CurrencyFormatter.getFromNumeric(this.value.currency, this.value.amount)
                amount = formatter.localize()
                numericAmount = formatter.getNumeric()
            }
            this.amount = amount
            this.numericAmount = numericAmount
            this.commit()
        },
        methods: {
            commit() {
                if (!this.amountErrorState) {
                    var result = {
                        "amount": this.numericAmount,
                        "currency": this.currency,
                    }
                    this.$emit('input', result)
                } else {
                    this.$emit('vca-money-validationError')
                }
            },
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
                var formatter = new CurrencyFormatter(this.currency, value)
                var internal = this.internalValidation(formatter.getNumeric())
                if (formatter.match() && internal.valid) {
                    this.amount = formatter.localize()
                    this.numericAmount = formatter.getNumeric()
                    this.amountErrorState = false
                    this.$emit("change")
                } else if(!formatter.match()) {
                    this.amountErrorState = true
                } else if(!internal.valid) {
                    this.amountErrorState = true
                    this.errorMsg = internal.msg
                }
                this.commit()
            }
        }
    }
</script>

<style scoped>
    .vca-money-wrapper.vca-error {
        margin-bottom: 2em;
    }

</style>
