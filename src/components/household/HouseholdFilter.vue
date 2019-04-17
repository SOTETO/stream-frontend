<template>
    <el-form
        :model="filter"
        label-position="left"
        label-width="8em"
    >
        <el-form-item :label="$t('household.filter.what')" required>
            <el-input v-model="filter.what" @input="commit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('household.filter.wherefor')" required>
            <el-input v-model="filter.wherefor" @input="commit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('household.filter.amount')" required>
            <MoneyInput v-model="filter.amount"
                        :currency="currency"
                        @input="commit"
            />
        </el-form-item>
        <el-form-item :label="$t('household.filter.state.general')" required>
            <el-form-item :label="$t('household.filter.state.complete')" required>
                <el-checkbox-group v-model="filter.state.complete" @change="commit" :max="1">
                    <el-checkbox-button v-for="state in completeOptions" :label="state" :key="state">{{ $t('household.filter.options.complete.' + state) }}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('household.filter.state.repayment')" required>
                <el-select v-model="filter.state.repayment" placeholder="Select" @change="commit">
                    <el-option
                            v-for="item in stateOptions"
                            :key="item"
                            :label="$t('household.states.' + item)"
                            :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('household.filter.state.volunteerManager')" required>
                <el-select v-model="filter.state.volunteerManager" placeholder="Select" @change="commit">
                    <el-option
                            v-for="item in volunteerManagerOptions"
                            :key="item"
                            :label="$t('household.process.VolunteerManager.' + item)"
                            :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('household.filter.state.employee')" required>
                <el-select v-model="filter.state.employee" placeholder="Select" @change="commit">
                    <el-option
                            v-for="item in employeeOptions"
                            :key="item"
                            :label="$t('household.process.Employee.' + item)"
                            :value="item"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form-item>
    </el-form>
</template>

<script>
    import { mapGetters, mapActions} from 'vuex'
    import { Input, InputNumber, Form, FormItem } from 'element-ui'
    import MoneyInput from "../utils/MoneyInput";

    export default {
        name: "HouseholdFilter",
        components: {
            MoneyInput,
            'el-input': Input,
            'el-input-number': InputNumber,
            'el-form-item': FormItem,
            'el-form': Form
        },
        props: {
            'currency': {
                'type': String,
                'default': "EUR"
            }
        },
        computed: {
            ...mapGetters("household", {
                getFilter: 'filter'
            }),
            stateOptions () {
                return ["AppliedFor", "Requested", "Approved", "ToRepay", "Repaid", "Refused", "NotEditable"]
            },
            volunteerManagerOptions () {
                return ["Idle", "Knows", "KnowsNothing"]
            },
            employeeOptions () {
                return ["Idle", "Freed", "Blocked"]
            },
            completeOptions () {
                return ["incomplete", "complete"]
            }
        },
        data () {
            return {
                'filter': {
                    'what': "",
                    'wherefor': "",
                    'amount': {
                        "formatted": "",
                        "amount": 0.00
                    },
                    'state': {
                        'complete': [],
                        'repayment': "",
                        'volunteerManager': "",
                        'employee': ""
                    }
                }
            }
        },
        created() {
            this.filter = this.getFilter
        },
        methods: {
            ...mapActions("household", {
                setFilter: 'filter'
            }),
            commit() {
                this.setFilter(JSON.parse(JSON.stringify(this.filter)))
            }
        }
    }
</script>

<style scoped>

</style>