<template>
    <tr class="source">
        <td>
            <el-form-item>
                <el-checkbox v-model="checkedVar" @change="commit">{{ $t("donation.placeholder.source." + category) }}</el-checkbox>
            </el-form-item>
        </td>
        <td>
            <el-form-item>
                <el-input class="vca-input" v-model="amount" @change="validate"/>
                <div
                        v-if="amountErrorState"
                        class="el-form-item__error"
                >
                    {{ $t('donation.hints.error.amount.pattern') }}
                </div>
            </el-form-item>
        </td>
        <td>
            <el-form-item>
                <el-radio v-model="typeVar" label="cash" @change="commit">&nbsp;</el-radio>
            </el-form-item>
        </td>
        <td>
            <el-form-item>
                <el-radio v-model="typeVar" label="extern" @change="commit">&nbsp;</el-radio>
            </el-form-item>
        </td>
    </tr>
</template>

<script>
    import { Input, Checkbox, Radio, FormItem } from 'element-ui'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "DonationSource",
        components: {
            "el-input": Input,
            "el-checkbox": Checkbox,
            "el-radio": Radio,
            "el-form-item": FormItem
        },
        props: {
            "category": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["can", "box", "gl"].indexOf(value) !== -1
                }
            },
            "currency": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["euro", "dollar"].indexOf(value) !== -1
                }
            },
            "checked": {
                "type": Boolean,
                "default": false
            },
            "numeric": {
                "type": Number,
                "default": 0.0
            },
            "type": {
                "type": String,
                "default": "cash"
            }
        },
        data () {
            var formatter = CurrencyFormatter.getDefault(this.currency)
            return {
                "checkedVar": false,
                "amount": formatter.localize(),
                "numericAmount": formatter.getNumeric(),
                "typeVar": "cash",
                "amountErrorState": false
            }
        },
        created: function () {
            var formatter = CurrencyFormatter.getFromNumeric(this.currency, this.numeric)
            this.amount = formatter.localize()
            this.numericAmount = formatter.getNumeric()
            this.checkedVar = this.checked
            this.typeVar = this.type
            this.commit()
        },
        methods: {
            commit() {
                if(this.checkedVar && !this.amountErrorState) {
                    this.$emit('input', {
                        "category": this.category,
                        "amount": this.numericAmount,
                        "formatted": this.amount,
                        "type": this.typeVar
                    })
                } else if(!this.checkedVar && !this.amountErrorState) {
                    this.deselect()
                }
            },
            validate(value) {
                var formatter = new CurrencyFormatter(this.currency, value)
                if(formatter.match()) {
                    this.amount = formatter.localize()
                    this.numericAmount = formatter.getNumeric()
                    this.checkedVar = true
                    this.amountErrorState = false
                    this.commit()
                } else {
                    this.amountErrorState = true
                    this.checkedVar = false
                    this.deselect()
                }
            },
            deselect() {
                this.$emit('deselect', this.category)
            }
        }
    }
</script>

<style scoped lang="less">
</style>