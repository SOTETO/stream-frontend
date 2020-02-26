<template>
    <el-form-item
        class="vca-money-wrapper"
        :class="amountErrorState ? 'vca-error' : ''"
    >
        <el-input class="vca-input" v-model="displayAmount" @input="handleInput" :placeholder="label" :disabled="disabled" :size="size" @change="change"/>
        <div
                v-if="amountErrorState"
                class="el-form-item__error"
        >
            {{ errorMsg }}
        </div>
    </el-form-item>
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
        return Money.getString(this.amount.amount, this.amount.currency)
      //  let money = this.amount.amount.toString()
      //  console.log(money)
      //  if (money.length === 1) {
      //    return "0,0" + money
      //  } else if ( money.length === 2) {
      //    return "0," + money
      //  } else {
      //    let euro = money.substring(0, money.length -2)
          
      //    let cents = money.substring(money.length -2, money.length)
      //    return euro.replace(/(\d)(?=(\d{3})+?$)/g, "$1.") + "," + cents
      },
      set: function(value) {
        this.amount.amount = Money.getAmount(value)
     //   let cents = parseInt(value.replace(/,|\./g , ""))
     //           // Ensure that it is not NaN
     //   if(isNaN(cents)) {
     //     this.amount.amount = 0
     //   } else {
     //     this.amount.amount = cents
     //   }
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
    handleInput(e) {
      this.prevValue = e.target.value;
      let targetValue = unformat(e.target.value);
      this.position = e.target.selectionStart;
      this.formatedValue = formatNumber(targetValue)
      this.$emit("input", this.formatedValue);
    },
    change() {
      this.$emit("change", this.amount)
    }
  }
}

</script>

<style scoped>
    .vca-money-wrapper.vca-error {
        margin-bottom: 2em;
    }
</style>
