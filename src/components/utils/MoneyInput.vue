<template>
    <el-input class="vca-input" ref="ta" v-model="displayAmount" :placeholder="label" :disabled="disabled" :size="size" @change="change">
      <el-select v-model="amount.currency"  slot="append" :size="size">
        <el-option label="€" value="EUR"></el-option>
        <el-option label="$" value="USD"></el-option>
        <el-option label="Fr" value="CHF"></el-option>
      </el-select>
    </el-input>
</template>

<script>
    
import Money from '@/utils/Money'
export default {
  name: "MoneyInput",
  props: {
    amount: {
      type: Object,
      default: function () {
        return {
          "amount": 1233,
          "currency": "EUR"
        }
      }
    },
    rules: {
      type: Array,
      default: () => [{
        validator: (numericValue) => false,
        msg: ""
      }]
    },
    label: {
      "type": String,
      "default": ""
    },
    disabled: {
      "type": Boolean,
      "default": false
    },
    size: {
      type: String,
      default: "medium"
    }
  },
  data () {
    return {
      "amountErrorState": false,
      "errorMsg": this.$t('donation.hints.error.amount.pattern'),
    }
  },
  computed: {
    displayAmount: {
      get: function () { 
        return Money.getInputString(this.amount.amount, this.amount.currency)
      },
      set: function(value) {
        this.amount.amount = Money.getAmount(value)
      }
    }
  },
  methods: {
    internalValidation(numeric) {
      return this.rules.reduce((acc, rule) => {
        var res = acc
        if(rule.validator(numeric)) {
          res = {
            "valid": false,
            "msg": rule.msg
          }
        }
        return res
      }, {
        "valid": true
      })
    },
    change() {
      this.$emit("change", this.amount)
    }
  }
}

</script>

<style scoped>
  .el-select {
    width: 60px;
  }
    .vca-money-wrapper.vca-error {
        margin-bottom: 2em;
    }
</style>
