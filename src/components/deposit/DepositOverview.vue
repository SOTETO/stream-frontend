<template>
  <div>
    <el-card class="box-card">
      <DepositFilter v-on:update="updateFilter($event)"/>
    </el-card>
    <el-card class="box-card tail">
      <DepositList v-on:page="updatePage($event)"/>
    </el-card>
  </div>
</template>
<script>
import {mapActions } from 'vuex'
import DepositFilter from '@/components/deposit/overview/DepositFilter'
import DepositList from '@/components/deposit/overview/DepositList'

export default {
  name: 'DepositOverview',
  components: {
    DepositList, DepositFilter
  },
  data () {
    return {
      filter: {},
      sort:{
        sortby: "deposit.created",
        sortdir: "DESC"
      },
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
    this.count(this.query)
    this.init(this.query)
  },
  methods: {
    ...mapActions('deposits', [
      'init', 
      'count',
      'nextPage'
    ]),
    updateFilter(filter) {
      this.filter = filter
      this.count(this.query)
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
