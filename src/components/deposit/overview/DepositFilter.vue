<template>
  <el-collapse >
    <el-collapse-item title="Filter">
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form
            :model="filter"
            label-position="left"
            label-width="8em"
            >
            <el-form-item :label=lang.crew.label required>
              <CrewSelect v-model="filter.crew" @input="commit" />
            </el-form-item>
            <el-form-item :label="lang.events.label" required>
              <FilterTags :lang="lang.events" v-on:commit="addEvent($event)" v-on:delete="deleteEvent($event)"/>
            </el-form-item>
           <el-form-item
              :label="lang.created.label"
              required
             >
             <DateFilter :from="query.crfrom" :to="query.crto" v-on:update="dateCreated($event)"/>
           </el-form-item>
           <el-form-item
             :label="lang.received.label"
             required
             >
             <DateFilter :from="query.payfrom" :to="query.payto" v-on:update="dateReceived($event)"/>
           </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form
            label-position="left"
            >
            <el-form-item
              :label="lang.confirmed.label"
              required
              >
              <FilterOption :lang="lang.confirmed" @change="setConfimed($event)"/>
            </el-form-item>
            <el-form-item
              :label="lang.confirmed_date.label"
              required
              >
              <DateFilter :from="query.cfrom" :to="query.cto" v-on:update="dateConfirmed($event)"/>
            </el-form-item>
          </el-form>
          <el-form>
            <el-form-item 
              :label="lang.amount.label"
              required
              >
              <FilterAmount @from="addAmountFrom($event)"  @to="addAmountTo($event)"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
    
import { CrewSelect } from 'vca-widget-user'
import DateFilter from '@/components/utils/FilterDate'
import FilterTags from '@/components/utils/FilterTags'
import FilterOption from '@/components/utils/FilterOption'
import FilterAmount from '@/components/utils/FilterAmount'

export default {
  name: "DepositFilter",
  components: {
    CrewSelect, DateFilter, FilterTags, FilterOption, FilterAmount
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
    },
    lang: {
      type: Object,
      default: function () {
        return {
          crew: {
            label: "Crew"
          },
          events: {
            label: "Event",
            new_tag: "+ New Event"
          },
          created: {
            label: "Created"
          },
          received: {
            label: "Received"
          },
          confirmed: {
            label: "Confirmed",
            label_true: "Confirmed",
            label_false: "Not Confirmed",
            label_null: "All"
          },
          confirmed_date: {
            label: "Confirmed Date"
          },
          amount: {
            label: "Amount"
          }
        }
      }
    }
  },
  data () {
    return {
      filter: this.query
    }
  },
  methods: {
    dateConfirmed(value) {
        this.query.cfrom = value.from
        this.query.cto = value.to
      this.refresh()
    },
    dateCreated(value) {
        this.query.crfrom = value.from
        this.query.crto = value.to
      this.refresh()
    },
    dateReceived(value) {
        this.query.payfrom = value.from
        this.query.payto = value.to
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
    addAmountFrom(value) {
      this.query.afrom = value
      this.refresh()
    },
    addAmountTo(value) {
      this.query.ato = value
      this.refresh()
    },
    setConfimed(value) {
      this.query.confirmed = value
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
  }

</style>
