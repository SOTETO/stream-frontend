<template>
  <div>
  <div class="unit unsubmitted" v-if="!submitted">
    <el-input class="money-input" v-model="unit.amount" size="mini">
      <template class="currency" slot="append">€</template>
    </el-input>
    <el-button @click="submit" type="success" icon="el-icon-check" size="mini"></el-button>
  </div>
  <div class="unit submitted" v-if="submitted">
    <span>{{unit.amount}}</span>
    <el-button @click="pop" type="danger" icon="el-icon-delete" size="mini"></el-button>
  </div>
  </div>
</template>

<script>
import {Form, Button} from 'element-ui'
import MoneyInput from '@/components/deposit/MoneyInput'
export default {
  name: "DepositAdd",
  components: {
    "el-form": Form,
    "el-button": Button,
    "MoneyInput": MoneyInput
  },
  props: {
    depositUnit: {
      type: Array,
      default: []
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
    this.unit.amount = this.amount
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
    }

  },
  methods: {
    submit () {
      this.depositUnit.push(this.unit)
      //this.submitted = true
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
.dunit {
  display: inline-block;
}
.money-input {
  width: 30%;
}
.currency {
  width: 30%;
}
</style>
