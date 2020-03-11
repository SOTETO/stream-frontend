<template>
  <VcAFrame>
    <VcAColumn size="90%">
      <DepositOverview  class="box-card" />
    </VcAColumn>
  </VcAFrame>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  },

  computed: {
    ...mapGetters('deposits', {
      isError: 'isError',
      getErrorCode: 'getErrorCode',
    }),
  },

  updated () {
    if(this.isError) {
      switch(this.getErrorCode) {
        case 400:
          this.open(this.$t('errors.ajax.badRequest.header'), this.$t('errors.ajax.badRequest.msg'), 'error')
          break;
        case 403:
          this.open(this.$t('errors.ajax.forbidden.header'), this.$t('errors.ajax.forbidden.msg'), 'error')
          break;
        case 404:
          this.open(this.$t('errors.ajax.notFound.header'), this.$t('errors.ajax.notFound.msg'), 'error')
          break;
        default:
          if(this.getErrorCode > 404) {
            this.open(this.$t('errors.ajax.server.header'), this.$t('errors.ajax.server.msg'), 'error')
          }
      }
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
