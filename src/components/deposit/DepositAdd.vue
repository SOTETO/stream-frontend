<template>
  <div>
  <div class="unit unsubmitted" v-if="!submitted && !stateConfirmed && !stateUnConfirmed">
    <el-input class="money-input" v-model="unit.amount.amount" size="mini">
      <template class="currency" slot="append">€</template>
    </el-input>
    <el-button @click="submit" type="success" icon="el-icon-check" size="mini"></el-button>
  </div>
  <div class="unit submitted" v-if="submitted">
    <span class="formatAmount">{{ formatAmount(unit.amount) }}</span>
    <el-button @click="pop" type="danger" icon="el-icon-delete" size="mini"></el-button>
  </div>
  </div>
</template>

<script>
import {Button} from 'element-ui'
import CurrencyFormatter from '@/utils/CurrencyFormatter'
export default {
  name: "DepositAdd",
  components: {
    "el-button": Button
  },
  props: {
    taking: {
      type: Object,
      "required": true
    },
    depositUnit: {
      type: Array,
      default: function () {
        return []
      }
    },
    amount: {
      type: Number,
      default: 0
    },
    takingId: {
      type: String,
      default: ""
    }
  },
  created () {
    this.unit.amount.amount = this.amount
    this.unit.takingId = this.takingId
  },
  data () {
    return {
      //"submitted": false,
      "unit": {
        "takingId": "",
        "amount": {
          "amount": 0,
          "currency": "EUR"
        },
        "created": Date.now()
      }
    }
  },
  computed: {
    deleteUnit () {
      return this.depositUnit.filter(unit => unit.takingId !== this.unit.takingId)
    },
    submitted () {
      var i
      for (i = 0; i < this.depositUnit.length; i++) {
        if (this.depositUnit[i] === this.unit) {
          return true
        }
      }
      return false
    },
    confirmedAmount () {
        var confirmed = 0
        if(this.taking.deposited.confirmed.hasOwnProperty("EUR")) {
            confirmed = this.taking.deposited.confirmed.EUR
        }
        return confirmed
    },
    stateConfirmed () {
        return (this.confirmedAmount >= this.taking.amount)
    },
    unconfirmedAmount () {
        var unconfirmed = 0
        if(this.taking.deposited.unconfirmed.hasOwnProperty("EUR")) {
            unconfirmed = this.taking.deposited.unconfirmed.EUR
        }
        return unconfirmed
    },
    stateUnConfirmed () {
        return (this.unconfirmedAmount >= this.taking.amount)
    }
  },
  methods: {
    submit () {
      this.depositUnit.push(this.unit)
      //this.submitted = true
    },
    formatAmount(unit) {
      var formatter = CurrencyFormatter.getFromNumeric(unit.currency, unit.amount)
      return formatter.localize()
    },
    pop () {
      var index = this.depositUnit.indexOf(this.unit)
      this.depositUnit.splice(index, 1)
      //this.submitted = false
    }
  }
}
</script>
<style lang="less">
.formatAmount {
  margin-right: 5px;
  font-weight: bold;
}
.dunit {
  display: inline-block;
}
.money-input {
  width: 30%;
}
.money-input input {
  min-width: 75px;
}
.currency {
  width: 30%;
}
</style>
