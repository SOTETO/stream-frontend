<template>
  <VcAFrame>
    <VcAColumn size="90%">
      <el-card class="box-card">
        <DepositFilter :query="query" v-on:refresh="refresh"/>
      </el-card>
      <el-card class="box-card tail">
        <DepositList :query="query" v-on:sort-change="sorting($event)"/>
        <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
          {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
        </button>
      </el-card>
    </VcAColumn>
  </VcAFrame>
</template>

<script>
  
import { VcAFrame, VcAColumn } from 'vca-widget-base'
import DepositFilter from '@/components/deposit/overview/DepositFilter'
import DepositList from '@/components/deposit/overview/DepositList'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "deposits",
  components: {
    VcAFrame, VcAColumn, DepositList, DepositFilter
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
  created () {
    this.init(this.query)
  },
  data () {
    return {
      query: this.queryString  
    }
  },
  computed: {
    ...mapGetters('deposits', {
      pageGet: 'page',
      taggableFilter: 'taggableFilter',
      filter: 'filter'
    }),
    hasPrevious () {
      return this.pageGet.previous > 0
    },
    hasNext () {
      return this.pageGet.next > 0
    },
  },
  methods: {
    ...mapActions('deposits', [
      'init',
      'page'
    ]),
    pageDown () {
      this.page(true)
    },
    pageUp () {
      this.page(false)
    },
    addState () {
      this.editable = JSON.parse(JSON.stringify(this.editableDefault))
    },
    refresh () {
      this.init(this.query)
    },
    sorting (sort) {
      console.logs(sort)
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
