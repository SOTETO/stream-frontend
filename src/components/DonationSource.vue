<template>
    <tr>
        <td><el-checkbox v-model="checked">{{ $t("donation.placeholder.source." + category) }}</el-checkbox></td>
        <td>
            <el-input class="vca-input" v-model="amount" @change="validate"/>
            <div
                    v-if="amountErrorState"
                    class="el-form-item__error"
            >
                {{ $t('donation.hints.error.amount.pattern') }}
            </div>
        </td>
        <td><el-radio v-model="type" label="cash">&nbsp;</el-radio></td>
        <td><el-radio v-model="type" label="extern">&nbsp;</el-radio></td>
    </tr>
</template>

<script>
    import { Input, Checkbox, Radio } from 'element-ui'
    import CurrencyFormatter from '@/utils/CurrencyFormatter'

    export default {
        name: "DonationSource",
        components: {
            "el-input": Input,
            "el-checkbox": Checkbox,
            "el-radio": Radio
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
                "default": "euro",
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["euro", "dollar"].indexOf(value) !== -1
                }
            }
        },
        data () {
            var formatter = CurrencyFormatter.getDefault(this.currency)
            return {
                "checked": false,
                "amount": formatter.localize(),
                "numericAmount": formatter.getNumeric(),
                "type": "cash",
                "amountErrorState": false
            }
        },
        methods: {
            validate(value) {
                var formatter = new CurrencyFormatter(this.currency, value)
                if(formatter.match()) {
                    this.amount = formatter.localize()
                    this.numericAmount = formatter.getNumeric()
                    this.amountErrorState = false
                } else {
                    this.amountErrorState = true
                }
            }
        }
    }
</script>

<style scoped lang="less">
</style>