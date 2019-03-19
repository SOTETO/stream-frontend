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
                :disabled="!isEditable"
                :key="expense.amount.amount"
        />
        <el-form-item
                :required="true"
        >
            <el-input v-model="expense.reason.what" :placeholder="$t('household.placeholder.what')" :disabled="!isEditable"></el-input>
        </el-form-item>
        <el-form-item
                :required="true"
        >
            <el-input v-model="expense.reason.wherefor" :placeholder="$t('household.placeholder.wherefor')" :disabled="!isEditable"></el-input>
        </el-form-item>
        <el-form-item
                :required="false"
        >
            <el-input v-model="expense.iban" :placeholder="$t('household.placeholder.iban')" :disabled="!isEditable"></el-input>
        </el-form-item>
        <el-form-item
                :required="false"
        >
            <el-input v-model="expense.bic" :placeholder="$t('household.placeholder.bic')" :disabled="!isEditable"></el-input>
        </el-form-item>
        <el-form-item
                :label="$t('household.placeholder.request')"
                :required="true"
        >
            <el-checkbox v-model="expense.request" :disabled="!allowedRequestChange || !isEditable"></el-checkbox>
        </el-form-item>
        <button
                class="vca-button-primary vca-full-width"
                :disabled="!isEditable"
                @click.prevent="submitForm">
            {{ $t("household.buttons.save") }}
        </button>
    </el-form>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
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
            "uuid": {
                "type": String,
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

            return {
                "expense": JSON.parse(JSON.stringify(defaultExpense)),
                "default": defaultExpense,
                "rules": {}
            }
        },
        computed: {
            ...mapGetters('household', {
                stateById: 'stateById',
                byId: 'byId'
            }),
            value () {
                var res = null
                if(typeof this.uuid !== "undefined" && this.uuid !== null) {
                    res = this.byId(this.uuid)
                }
                return res
            },
            isUpdate () {
                return typeof this.value !== "undefined" && this.value !== null // alternative: this.expense.hasOwnProperty("id") ??
            },
            allowedRequestChange () {
                var res = true
                if(this.isUpdate) {
                    var state = this.stateById(this.expense.id)
                    res = state.allowedTo("request") || state.allowedTo("apply")
                }
                return res
            },
            isEditable () {
                var res = true
                if(this.isUpdate) {
                    var state = this.stateById(this.expense.id)
                    res = state.isEditable()
                }
                return res

            }
        },
        created () {
            if(this.isUpdate) {
                this.expense = JSON.parse(JSON.stringify(this.value))
            }
        },
        methods: {
            ...mapActions('household', [
                'add', 'update' // -> this.foo()
            ]),
            commit () {
                this.setDate()
                if(this.isUpdate) {
                    this.update(this.expense)
                    this.$emit("vca-expense-update", this.expense)
                } else {
                    this.add(this.expense)
                    this.$emit("vca-expense-create", this.expense)
                }
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