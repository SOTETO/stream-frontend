<template>
  <el-row :gutter=20>
    <el-col :span="6">
      <MoneyInput
        size="small"
        v-model="amount_data.from"
        v-bind:amount="amount_data.from"
        @change="setFrom($event)"
        />
    </el-col>
    <el-col :span="6">
      <MoneyInput
        size="small"
        v-model="amount_data.to"
        v-bind:amount="amount_data.to"
        v-on:change="setTo($event)"
        />
    </el-col>
    <el-button type="danger" icon="el-icon-delete" @click="reset" circle size="small"></el-button>
  </el-row>
</template>
<script>
import MoneyInput from '@/components/utils/MoneyInput'
export default {
  name: "FilterAmount",
  components: {
    MoneyInput
  },
  props: {
    amount: {
      type: Object,
      default: function () {
        return {
          from: 0,
          to: 0
        }
      }
    },
    lang: {
      type: Object,
      default: function () {
        return {
          from: "von",
          to: "bis"
        }
      }
    }
  },
  data () {
    return {
      amount_data: {
        from: {
          amount: 0,
          currency: "EUR"
        },
        to: {
          amount: 0,
          currency: "EUR"
        }
      }
    } 
  },
  methods: {
    setFrom: function (value) {
      this.$emit('from', this.amount_data.from.amount)
    },
    setTo: function (value) {
      this.$emit('to', this.amount_data.to.amount)
    },
    reset: function() {
      this.amount_data.from.amount = 0
      this.amount_data.to.amount = 0
      this.$emit('from', null)
      this.$emit('to', null)
    }
  }
}
</script>
<style lang="less">
  .filter-amount {
    display: inline-block;
    width: 130px;
  }
</style>
