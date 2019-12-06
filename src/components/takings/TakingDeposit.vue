<template>
  <el-form
    :model="deposit"
    :rules="rules"
    :key="reloadKey">
    <MoneyInput v-model="deposit.full" currency="EUR" :label="$t('takings.placeholder.amount')" @vca-money-validationError="setErrorState('general')" @input="removeErrorState('general')" />
    <el-form-item
      class="vca-form"
      :required="true">
      <el-date-picker
        v-model="deposit.dateOfDeposit"
        type="date"
        :placeholder="$t('takings.placeholder.dateOfDeposit')"
        format="dd. MMM. yyyy"
        value-format="timestamp"
        :clearable="false">
      </el-date-picker>
    </el-form-item>
    <button
            :disabled="inErrorState"
            class="vca-button-primary vca-full-width"
            @click.prevent="commit">
      {{ $t("takings.buttons.depositAdd") }}
    </button>
  </el-form>
</template>

<script>
  import { FormItem, Input, Form, DatePicker} from 'element-ui'
  import MoneyInput from '@/components/utils/MoneyInput'
  import TakingDepositAssignment from '@/components/takings/TakingDepositAssignment'
  import TakingSelect from '@/components/takings/TakingSelect'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: "TakingDeposit",
    components: {
      "el-form": Form,
      "el-form-item": FormItem,
      "el-input": Input,
      "el-date-picker": DatePicker,
      "MoneyInput": MoneyInput,
      "TakingDepositAssignment": TakingDepositAssignment,
      "TakingSelect": TakingSelect
    },
    props: {
      deposit: {
        type: Object,
        default: function () {
          return {
            "full": {
                "amount": 0,
                "currency": "EUR"
            },
            "depositUnits": [],
            "dateOfDeposit": null
          }
        }
      }
    },
    data () {
      return {
        "reloadKey": 1,
        "donations": [],
        "rules": {},
        "errorState": []
      }
    },
    computed: {
        unassignedDeposit () {
            var amount = this.deposit.full.amount - this.deposit.depositUnits.reduce((acc, unit) => acc + unit.deposit.amount, 0)
            var formatter = CurrencyFormatter.getFromNumeric(this.deposit.full.currency, amount)
            return formatter
        },
        inErrorState () {
            return this.errorState.length > 0
        }
    },
    methods: {
        ...mapActions("deposits", {
            "save": "add"
        }),
      addDepositUnit (depositUnit) {
        var index = this.deposit.depositUnits.findIndex((unit) => unit.donation === depositUnit.donation)
        if(index !== -1) {
            this.deposit.depositUnits.splice(index, 1, depositUnit)
        } else {
            this.deposit.depositUnits.push(depositUnit)
        }
      },
      removeDepositUnit (donationId) {
        var indexUnit = this.deposit.depositUnits.findIndex((unit) => unit.donation === donationId)
        var indexTaking = this.donations.findIndex((donation) => donation.value === donationId)
        this.deposit.depositUnits.splice(indexUnit, 1)
        this.donations.splice(indexTaking, 1)
      },
      selectTaking (donation) {
          this.donations.push(donation)
          this.addDepositUnit({
              "deposit": {
                  "amount": 0,
                  "currency": "EUR"
              },
              "donation": donation.value
          })
      },
      setErrorState (donationId) {
          this.errorState.push(donationId)
      },
      removeErrorState (donationId) {
          this.errorState = this.errorState.filter(id => id !== donationId)
      },
      reset () {
          Object.assign(this.$data, this.$options.data.apply(this))
          this.reloadKey += 1
      },
      commit () {
        this.save(this.deposit)
        this.reset()
      }
    }
  }
</script>
<style scoped lang="less">
  .vca-form /deep/ .el-select, .vca-form /deep/ .el-date-editor {
    width: 100%;
  }
</script>
