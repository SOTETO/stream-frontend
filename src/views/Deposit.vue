<template>
  <VcAFrame>
    <VcAColumn size="90%">
      <DepositOverview  class="box-card" />
    </VcAColumn>
  </VcAFrame>
</template>

<script>
  
import { VcAFrame, VcAColumn } from 'vca-widget-base'
import 'vca-widget-base/dist/vca-widget-base.css'
import DepositOverview from '@/components/deposit/DepositOverview'
export default {
  name: "deposits",
  components: {
    VcAFrame, VcAColumn, DepositOverview
  },
  props: {
    queryString: {
      type: Object,
      default: function () {
        return {
          publicId: null, 
          takingsId: null,
          crew: null,
          name: null,
          confirmed: null,
          cby: null,
          cfrom: null,
          cto: null,
          payfrom: null,
          payto:null,
          crfrom: null,
          crto:null
        }
      }
    }
  },
  data () {
    return {
      query: this.queryString  
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/general.less';
    .tags {
        margin: 0 1em;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

  .paginate {
    width: 100%;
    height: 2.5em;
    .inputElement();
    cursor: pointer;
    background: none;
  }
    .box-card {
        width: 100%;
    }
    .box-card.tail {
        margin-top: 2em;
    }
    .box-card.expand {
        flex-grow: 1;
    }
    .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .title > h2 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0;
    }
</style>
