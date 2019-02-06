<template>
    <el-form
            :model="expense"
            :rules="rules">
        <p v-html="$t('household.hints.expense')" />
        <MoneyInput
                v-model="expense.amount"
                currency="EUR"
                :label="$t('household.placeholder.amount')"
                :required="true"
                :key="expense.amount.amount"
        />
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
            var now = Date.now()
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
                "request": false,
                "created": now,
                "updated": now
            }

            var expense = JSON.parse(JSON.stringify(defaultExpense))
            if(this.isUpdate) {
                expense = JSON.parse(JSON.stringify(this.value))
            }
            return {
                "expense": expense,
                "default": defaultExpense,
                "rules": {}
            }
        },
        computed: {
            isUpdate () {
                return typeof this.value !== "undefined" && this.value !== null
            }
        },
        methods: {
            commit () {
                this.setDate()
                this.$emit("input", this.expense)
            },
            clear () {
                this.expense = this.default
                this.$forceUpdate()
            },
            submitForm () {
                this.commit()
                this.clear()
            },
            setDate () {
                if(this.isUpdate) {
                    this.expense.updated = Date.now()
                } else {
                    var now = Date.now()
                    this.expense.created = now
                    this.expense.updated = now
                }
            }
        }
    }
</script>

<style scoped>

</style>