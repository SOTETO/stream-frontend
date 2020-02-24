<template>
  <div>
  <span> Übersicht Einnahmen </span>
  <span> Gesamt: </span>
  <p>{{ amount.full}}</p>
  <span> Davon: </span>
  <p>{{$t('takings.table.popup.cash')}}: {{ amount.cash }}</p>
  <p>{{$t('takings.table.popup.extern')}}: {{ amount.extern }}</p>
  </div>        
</template>
<script>
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
  }
}
</script>
