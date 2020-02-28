<template>
  <div>
    <el-card class="box-card">
      <TakingFilter v-on:update="updateFilter($event)" />
    </el-card>
    <el-card class="box-card tail">
      <TakingList :deposit="deposit" :depositAddView="depositAddView" v-on:page="updatePage($event)"/>
    </el-card>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import TakingFilter from "@/components/takings/overview/TakingFilter";
import TakingList from "@/components/takings/overview/TakingList";
export default {
  name: "TakingOverview",
  components: {
    TakingFilter,
    TakingList
  },
  props: {
    depositAddView : {
      type: Boolean,
      default: false
    },
    deposit: {
      type: Object,
      default: function () {
        return {
          full: {
            amount: 0,
            currency: "EUR"
          },
          depositUnits: [],
          dateOfDeposit: null
        }
      }
    }
  },
  data () {
    return {
      filter: {},
      sort:{},
      page:{
        size: 20,
        offset: 0
      }
    }
  },
  computed: {
    query () {
      return Object.assign(this.sort, this.page, this.filter)
    },
  },
  created () {
    this.init(this.query)
  },
  methods: {
    ...mapActions('takings', [
      'init', 
      'nextPage'// map `this.init()` to `this.$store.dispatch('donations/init')`
    ]),
    updateFilter(filter) {
      this.filter = filter
      this.init(this.query) 
    },
    updateSort(sort) {
      this.sort = sort
      this.init(this.query)
    },
    updatePage(page) {
      this.page = page
      this.nextPage(this.query)
    }
  }
}
</script>
<style lang="less">
    .box-card {
        width: 100%;
    }
    .box-card.tail {
        margin-top: 2em;
    }
</style>
