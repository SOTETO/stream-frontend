<template>
  <el-collapse >
    <el-collapse-item title="Filter">
    <el-form
        :model="filter"
        label-position="left"
        label-width="8em"
    >
    <el-form-item :label="$t('household.filter.crew')" required>
      <CrewSelect v-model="filter.crew" @input="commit" />
    </el-form-item>
    <el-form-item label="Event">
      <FilterTags v-on:commit="addEvent($event)" v-on:delete="deleteEvent($event)"/>
    </el-form-item>
    </el-form>

    <el-form inline="true">
    <el-form-item
      label="Confirmed">
      <FilterOption/>
    </el-form-item>
    <el-form-item
      label="Confirmed">
      <DateFilter :from="query.cfrom" :to="query.cto" v-on:update="dateConfirmed($event)"/>
    </el-form-item>
    <el-form-item
      label="Created">
      <DateFilter :from="query.crfrom" :to="query.crto" v-on:update="dateConfirmed($event)"/>
    </el-form-item>
    <el-form-item
      label="PayDay">
      <DateFilter :from="query.payfrom" :to="query.payto" v-on:update="dateConfirmed($event)"/>
    </el-form-item>
    </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
    
import { mapGetters, mapActions} from 'vuex'

import { CrewSelect } from 'vca-widget-user'
import DateFilter from '@/components/utils/DateFilter'
import FilterTags from '@/components/utils/FilterTags'
import FilterOption from '@/components/utils/FilterOption'

export default {
  name: "DepositFilter",
  components: {
    CrewSelect, DateFilter, FilterTags, FilterOption
  },
  props: {
      query: {
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
      filter: this.query
    }
  },
  computed: {
    ...mapGetters("deposits", {
      getFilter: 'filter'
    })
  },
  methods: {
    ...mapActions("deposits", {
      setFilter: 'filter'
    }),
    dateConfirmed(dates) {
      if(dates !== null && dates.length > 0) {
        this.query.cfrom = Date.parse(dates[0])
        this.query.cto = Date.parse(dates[1])
      } else {
        this.query.cfrom = null
        this.query.cto = null
      }
      this.refresh()
    },
    addEvent(value) {
      if (this.query.name !== null) {
        this.query.name = this.query.name + " " +"%" + value +"%"
      } else {
        this.query.name = "%" + value + "%"
      }
      this.refresh()
    },
    deleteEvent(value) {
      var replace = "%"+ value + "%"
      this.query.name = this.query.name.replace(replace, '')
      if (this.query.name === '') {
        this.query.name = null
      }
      this.refresh()
    },
    commit() {
      if(typeof this.filter.crew === "object" && this.filter.crew !== null && this.filter.crew.hasOwnProperty("id")) {
        this.filter.crew = this.filter.crew.id
      }
      this.setFilter(JSON.parse(JSON.stringify(this.filter)))
      this.$emit("vca-filter-updated")
    },
    refresh () {
      this.$emit("refresh")
    }
  }
}
</script>

<style scoped>
  .el-collapse {
    border-top: 1px;
    border-bottom: 1px;
    background-color: #909399;
  }

</style>
