<template>
  <el-form
    :model="deposit"
    :rules="rules"
    :key="reloadKey">
    <MoneyInput v-model="deposit.full" currency="EUR" :label="$t('deposit.placeholder.amount')" />
    <div>
      <span v-if="visibleUnassignedDeposit">{{ $t("deposit.hint.openDeposit", { "amount": unassignedDeposit.localize() }) }}</span>
    </div>
    <DonationSelect @vca-select-donation="selectDonation" @vca-deselect-donation="removeDepositUnit" />
    <DonationDepositAssignment
            v-for="donation in donations"
            :key="donation.value"
            :id="donation.value"
            :label="donation.label"
            :currency="deposit.full.currency"
            :max="deposit.full.amount"
            @vca-add-depositUnit="addDepositUnit"
            @vca-remove-depositUnit="removeDepositUnit"
    />
    <el-form-item
      class="vca-form"
      :required="true">
      <el-date-picker
        v-model="deposit.dateOfDeposit"
        type="date"
        :placeholder="$t('deposit.placeholder.dateOfDeposit')"
        format="dd. MMM. yyyy"
        value-format="timestamp"
        :clearable="false">
      </el-date-picker>
    </el-form-item>
    <button
            class="vca-button-primary vca-full-width"
            @click.prevent="commit">
      {{ $t("deposit.buttons.save") }}
    </button>
  </el-form>
</template>

<script>
  import { FormItem, Input, Form, DatePicker} from 'element-ui'
  import MoneyInput from '@/components/utils/MoneyInput'
  import DonationDepositAssignment from '@/components/DonationDepositAssignment'
  import DonationSelect from '@/components/donations/DonationSelect'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: "DonationDeposit",
    components: {
      "el-form": Form,
      "el-form-item": FormItem,
      "el-input": Input,
      "el-date-picker": DatePicker,
      "MoneyInput": MoneyInput,
      "DonationDepositAssignment": DonationDepositAssignment,
      "DonationSelect": DonationSelect
    },
    data () {
      return {
        "reloadKey": 1,
        "deposit": {
            "full": {
                "amount": 0,
                "currency": "EUR"
            },
            "depositUnits": [],
            "dateOfDeposit": null
        },
        "donations": [],
        "rules": {}
      }
    },
    computed: {
        unassignedDeposit () {
            var amount = this.deposit.full.amount - this.deposit.depositUnits.reduce((acc, unit) => acc + unit.deposit.amount, 0)
            var formatter = CurrencyFormatter.getFromNumeric(this.deposit.full.currency, amount)
            return formatter
        },
        visibleUnassignedDeposit () {
            return this.deposit.full.amount > 0 && this.unassignedDeposit.numeric() > 0
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
        var indexDonation = this.donations.findIndex((donation) => donation.value === donationId)
        this.deposit.depositUnits.splice(indexUnit, 1)
        this.donations.splice(indexDonation, 1)
      },
      selectDonation (donation) {
          this.donations.push(donation)
          this.addDepositUnit({
              "deposit": {
                  "amount": 0,
                  "currency": "EUR"
              },
              "donation": donation.value
          })
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