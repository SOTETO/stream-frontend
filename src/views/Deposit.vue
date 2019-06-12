<template>
  <VcAFrame>
    <VcAColumn size="90%">
      <VcABox>
        <DepositList/>
      </VcABox>
    </VcAColumn>
  </VcAFrame>
</template>

<script>
  import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
  import DepositList from '@/components/deposit/DepositList'
  export default {
    name: "deposits",
    components: {
      VcAFrame, VcAColumn, VcABox, DepositList
    }
  }
</script>
