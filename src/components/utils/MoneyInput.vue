<template>
    <el-form-item
        :required="required"
    >
        <el-input class="vca-input" v-model="amount" @change="validate" :placeholder="label"/>
            <div
                v-if="amountErrorState"
                class="el-form-item__error"
            >
            {{ $t('donation.hints.error.amount.pattern') }}
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
                "default": 0.0
            },
            "label": {
                "type": String,
                "default": ""
            },
            "required": {
                "type": Boolean,
                "default": true
            }
        },
        data () {
            var formatter = CurrencyFormatter.getDefault(this.currency)
            return {
                "amount": formatter.localize(),
                "numericAmount": formatter.getNumeric(),
                "amountErrorState": false
            }
        },
        created: function () {
            var formatter = CurrencyFormatter.getFromNumeric(this.currency, this.numeric)
            this.amount = formatter.localize()
            this.numericAmount = formatter.getNumeric()
            this.commit()
        },
        methods: {
            commit() {
                if (!this.amountErrorState) {
                    var result = {
                        "amount": this.numericAmount,
                        "formatted": this.amount,
                    }
                    this.$emit('input', result)
                } else {
                    this.$emit('vca-money-validationError')
                }
            },
            validate(value) {
                var formatter = new CurrencyFormatter(this.currency, value)
                if (formatter.match()) {
                    this.amount = formatter.localize()
                    this.numericAmount = formatter.getNumeric()
                    this.amountErrorState = false
                } else {
                    this.amountErrorState = true
                }
                this.$emit("change")
                this.commit()
            }
        }
    }
</script>

<style scoped>

</style>