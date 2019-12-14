<template>
  <el-form
    :model="deposit"
    :rules="rules"
    :key="reloadKey">

    <div style="display: table; width: 100%;">
      <div class="depositRow" v-for="unit in deposit.depositUnits" :key="unit.id">
        <div class="depositCell depositName">
          {{ takingName(unit.takingId) }}
        </div>
        <div class="depositCell depositAmount">
          {{ formatAmount(unit.amount) }}
        </div>
        <div class="depositOption">
          <el-button class="depositCell depositButton" @click="pop" type="danger" icon="el-icon-delete" size="mini"></el-button>
        </div>
      </div>
      <div class="depositTotal depositRow" v-if="deposit.depositUnits && deposit.depositUnits.length > 0">
          <div class="depositCell">{{ $t('takings.placeholder.amount') }}</div>
          <div class="depositCell">{{ formatTotal(deposit.depositUnits) }}</div>
          <div class="depositCell"></div>
      </div>
    </div><br/>
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
            :disabled="!isValid"
            class="vca-button-primary vca-full-width"
            @click.prevent="commit">
      {{ $t("takings.buttons.depositAdd") }}
    </button>
  </el-form>
</template>

<script>
  import { FormItem, Form, DatePicker} from 'element-ui'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: "TakingDeposit",
    components: {
      "el-form": Form,
      "el-form-item": FormItem,
      "el-date-picker": DatePicker
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
        "takings": [],
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
        isValid() {
            return (this.deposit.depositUnits && this.deposit.depositUnits.length > 0) && 
                   (this.deposit.dateOfDeposit !== null)
        },
        inErrorState () {
            return this.errorState.length > 0
        },
        ...mapGetters('takings', {
           getById: 'getById',
        })
    },
    methods: {
        ...mapActions(
          "deposits", {
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
        var indexTaking = this.takings.findIndex((donation) => donation.value === donationId)
        this.deposit.depositUnits.splice(indexUnit, 1)
        this.takings.splice(indexTaking, 1)
      },
      selectTaking (donation) {
          this.takings.push(donation)
          this.addDepositUnit({
              "deposit": {
                  "amount": donation.amount,
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
          this.$emit("resetDepositAddView")
          this.reloadKey += 1
      },
      commit () {
        this.save(this.deposit)
        this.reset()
      },
      formatAmount(unit) {
        var formatter = CurrencyFormatter.getFromNumeric(unit.currency, unit.amount)
        return formatter.localize()
      },
      formatTotal() {
        let total = [];
        var currency = "EUR";

        Object.entries(this.deposit.depositUnits).forEach(([key, val]) => {
          total.push(val.amount.amount) // the value of the current key.
          currency = val.amount.currency
        });

	var unit = {
          "amount": total.reduce(function(total, num){ return total + num }, 0),
          "currency": currency
        }

        return this.formatAmount(unit)
      },
      takingName(id) {
        var taking = this.getById(id)
        return taking.context.description
      },
      pop () {
        var index = this.deposit.depositUnits.indexOf(this.unit)
        this.deposit.depositUnits.splice(index, 1)
      }
    }
  }
</script>
<style scoped lang="less">
  .depositTotal .depositCell {
    font-weight: bold;
    border-top: solid thin black;
  }
  .depositRow {
    display: table-row;
  }
  .depositCell {
    display: table-cell;
    vertical-align: middle;
    padding: 5px;
  }
  .depositName {
    width: 60%;
  }
  .depositButton {
      float: right;
  }
  .depositAmount {
  }
</style>
