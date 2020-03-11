<template>
  <div>
    <h4> {{$t('takings.table.popup.header')}} </h4>
    <span> {{$t('takings.table.popup.full')}} </span>
  <p>{{ formatAmount(amount.full)}}</p>
  <span> {{$t('takings.table.popup.split')}} </span>
  <p>{{$t('takings.table.popup.cash')}}: {{ formatAmount(amount.cash) }}</p>
  <p>{{$t('takings.table.popup.extern')}}: {{ formatAmount(amount.extern) }}</p>
  </div>        
</template>
<script>
import Money from '@/utils/Money'
export default {
  name: "TakingsDetails",
  props: {
    amount: {
      type: Object,
      default: function () {
        return {
          "full": 0,
          "cash": 0,
          "extern": 0,
          "fullDon": 0,
          "donCash": 0,
          "donExtern": 0,
          "fullEC": 0,
          "ecCash": 0,
          "ecExtern": 0
        }
      }
    }
  },
  methods: {
    formatAmount(amount) {
        return Money.getString(amount, "EUR" )
    },
  }
}
</script>
