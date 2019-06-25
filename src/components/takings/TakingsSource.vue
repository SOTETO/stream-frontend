<template>
    <tr class="source">
        <td>
            <div class="category">
                <el-form-item>
                    <el-checkbox v-model="checkedVar" @change="commit">{{ $t("takings.placeholder.source." + category) }}</el-checkbox>
                </el-form-item>
                <el-form-item v-if="description">
                    <el-input v-model="descriptionTextVar" @change="commit" :placeholder="$t('takings.placeholder.source.description')"></el-input>
                </el-form-item>
            </div>
        </td>
        <td>
            <MoneyInput
                    v-model="amount"
                    :currency="currency"
                    @change="valid"
                    @input="commit"
                    @vca-money-validationError="invalid"
            />
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
    import MoneyInput from '@/components/utils/MoneyInput'

    // Todo: Should use new component utils.MoneyInput!
    export default {
        name: "TakingsSource",
        components: {
            "el-input": Input,
            "el-checkbox": Checkbox,
            "el-radio": Radio,
            "el-form-item": FormItem,
            "MoneyInput": MoneyInput
        },
        props: {
            "category": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["unknown", "can", "other"].indexOf(value) !== -1
                }
            },
            "currency": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["EUR", "USD", "CHF"].indexOf(value) !== -1
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
            },
            "description": {
                "type": Boolean,
                "default": false
            },
            "descriptionText": {
                "type": String,
                "default": ""
            }
        },
        data () {
            var formatter = CurrencyFormatter.getDefault(this.currency)
            return {
                "checkedVar": false,
                "amount": {
                    "formatted": formatter.localize(),
                    "amount": formatter.getNumeric()
                },
                "typeVar": "cash",
                "descriptionTextVar": "",
                "amountErrorState": false
            }
        },
        created: function () {
            var formatter = CurrencyFormatter.getFromNumeric(this.currency, this.numeric)
            this.amount.formatted = formatter.localize()
            this.amount.amount = formatter.getNumeric()
            this.checkedVar = this.checked
            this.typeVar = this.type
            this.descriptionTextVar = this.descriptionText
            this.commit()
        },
        methods: {
            commit() {
                if(this.checkedVar && !this.amountErrorState) {
                    var result = {
                        "category": this.category,
                        "amount": this.amount.amount,
                        "currency": this.currency,
                        "type": this.typeVar
                    }
                    if(this.description) {
                        result["description"] = this.descriptionTextVar
                    }
                    this.$emit('input', result)
                } else if(!this.checkedVar && !this.amountErrorState) {
                    this.deselect()
                }
            },
            deselect() {
                this.$emit('deselect', this.category)
            },
            valid () {
                this.amountErrorState = false
                this.checkedVar = true
                this.commit()
            },
            invalid () {
                this.amountErrorState = true
                this.checkedVar = false
                this.commit()
            }
        }
    }
</script>

<style scoped lang="less">
    .category {
        display: flex;
        flex-direction: row;

        & > :first-child {
            margin-right: 1em;
        }
    }
</style>