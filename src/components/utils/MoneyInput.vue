<template>
    <el-form-item
        class="vca-money-wrapper"
        :class="amountErrorState ? 'vca-error' : ''"
    >
        <el-input class="vca-input" v-model="displayAmount" :placeholder="label" :disabled="disabled" :size="size" @change="change"/>
        <div
                v-if="amountErrorState"
                class="el-form-item__error"
        >
            {{ errorMsg }}
        </div>
    </el-form-item>
</template>

<script>
    
import CurrencyFormatter from '@/utils/CurrencyFormatter'
export default {
  name: "MoneyInput",
  props: {
    amount: {
      type: Object,
      default: function () {
        return {
          "amount": 0.0,
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
      "errorMsg": this.$t('donation.hints.error.amount.pattern')
    }
  },
  computed: {
    displayAmount: {
      get: function () {
        var formatter = CurrencyFormatter.getFromNumeric(this.amount.currency, this.amount.amount)
        return formatter.localize()
      },
      set: function(value) {
        if (value === "") {
          this.amount.amount = 0.0
        } else {
          var formatter = new CurrencyFormatter(this.amount.currency, value)
          var internal = this.internalValidation(formatter.getNumeric())
          if (formatter.match() && internal.valid) {
            this.amount.currency = formatter.selectedCurrency
            this.amount.amount = formatter.getNumeric()
            this.numericAmount = formatter.getNumeric()
          } else if(!formatter.match()) {
            this.amountErrorState = true
          } else if(!internal.valid) {
            this.amountErrorState = true
            this.errorMsg = internal.msg
          }
        }
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
    .vca-money-wrapper.vca-error {
        margin-bottom: 2em;
    }
</style>
