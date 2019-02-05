<template>
    <el-form
            :model="expense"
            :rules="rules">
        <p v-html="$t('household.hints.expense')" />
        <MoneyInput
                v-model="expense.amount"
                currency="EUR"
                :label="$t('household.placeholder.amount')"
                :required="true" />
        <el-form-item
                :required="true"
        >
            <el-input v-model="expense.reason.what" :placeholder="$t('household.placeholder.what')"></el-input>
        </el-form-item>
        <el-form-item
                :required="true"
        >
            <el-input v-model="expense.reason.wherefor" :placeholder="$t('household.placeholder.wherefor')"></el-input>
        </el-form-item>
        <el-form-item
                :required="false"
        >
            <el-input v-model="expense.iban" :placeholder="$t('household.placeholder.iban')"></el-input>
        </el-form-item>
        <el-form-item
                :required="false"
        >
            <el-input v-model="expense.bic" :placeholder="$t('household.placeholder.bic')"></el-input>
        </el-form-item>
        <el-form-item
                :label="$t('household.placeholder.request')"
                :required="true"
        >
            <el-checkbox v-model="expense.request"></el-checkbox>
        </el-form-item>
        <button
                class="vca-button-primary vca-full-width"
                @click.prevent="submitForm">
            {{ $t("household.buttons.save") }}
        </button>
    </el-form>
</template>

<script>
    import { Form, Input, Checkbox, FormItem } from 'element-ui'
    import MoneyInput from '@/components/utils/MoneyInput'

    export default {
        name: "ExpenseForm",
        components: {
            "el-form": Form,
            "el-input": Input,
            "el-form-item": FormItem,
            "el-checkbox": Checkbox,
            "MoneyInput": MoneyInput
        },
        props: {
            "value": {
                "type": Object,
                "required": false
            }
        },
        data () {
            var defaultExpense = {
                "amount": {
                    "amount": 0,
                    "formatted": "0,00"
                },
                "reason": {
                    "what": "",
                    "wherefor": ""
                },
                "iban": "",
                "bic": "",
                "request": false
            }

            var expense = defaultExpense
            if(typeof this.value !== "undefined" && this.value !== null) {
                expense = this.value
            }
            return {
                "expense": expense,
                "default": defaultExpense,
                "rules": {}
            }
        },
        methods: {
            commit () {
                this.$emit("input", this.expense)
            },
            clear () {
                this.expense = this.default
            },
            submitForm () {
                this.commit()
                this.clear()
            }
        }
    }
</script>

<style scoped>

</style>