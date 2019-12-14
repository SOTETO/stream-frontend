<template>
  <div>
    <div class="header">
      <h3>Crew Name</h3>
    </div>
    <div class="evaluation">
      <span class="part">{{ $t('donation.hints.total.cash', { 'total': 20 }) }}</span>
      <span class="part">{{ $t('donation.hints.total.extern', { 'total': 30 }) }}</span>
      <span class="all">{{ $t('donation.hints.total.all', { 'total': 50 }) }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CrewDetail',
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.evaluation {
  border-top: 1px solid rgb(220, 223, 230);
  display: flex;
  flex-direction: column;
  padding-top: 1em;
  margin-top: 1em;
  .part {

  }
  .all {
    font-weight: bold;
    font-size: 1.2em;
  }
}
</style>
