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
          
            <el-form-item :label="lang.events.label" required>
              <FilterTags :lang="lang.events" v-on:commit="addEvent($event)" v-on:delete="deleteEvent($event)"/>
            </el-form-item>
             <el-form-item
              :label="lang.confirmed.label"
              required
              >
              <FilterOption :lang="lang.confirmed" @change="setConfimed($event)"/>
            </el-form-item>           <el-form-item
              :label="lang.unconfirmed.label"
              required
              >
              <FilterOption :lang="lang.unconfirmed" @change="setUnConfimed($event)"/>
            </el-form-item>
            <el-form-item
              :label="lang.open.label"
              required
              >
              <FilterOption :lang="lang.open" @change="setOpen($event)"/>
            </el-form-item>
           <el-form-item
              :label="lang.created.label"
              required
             >

             <DateFilter :from="filter.crfrom" :to="filter.crto" v-on:update="dateCreated($event)"/>
           </el-form-item>
           <el-form-item
             :label="lang.received.label"
             required
             >
             <DateFilter :from="filter.payfrom" :to="filter.payto" v-on:update="dateReceived($event)"/>
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
              <DateFilter :from="filter.cfrom" :to="filter.cto" v-on:update="dateConfirmed($event)"/>
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
  name: "TakingFilter",
  components: {
    FilterTags, DateFilter, FilterOption, FilterAmount
  },
  props: {
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
           unconfirmed: {
            label: "Unconfirmed",
            label_true: "Unconfirmed",
            label_false: "Not Unconfirmed",
            label_null: "All"
          }, 
          open: {
            label: "open",
            label_true: "Open",
            label_false: "Not Open",
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
      filter: {
        publicId: null, 
        name: null,
        crew: null,
        ato: null,
        afrom: null,
        exto: null,
        exfrom: null,
        cashto: null,
        cashfrom: null,
        confirmed: null,
        unconfirmed: null,
        open: null,
        payfrom: null,
        payto:null,
        crfrom: null,
        crto:null
      }
    }
  },
  methods: {
    addEvent(value) {
      if (this.filter.name !== null) {
        this.filter.name = this.filter.name + " " +"%" + value +"%"
      } else {
        this.filter.name = "%" + value + "%"
      }
      this.update()
    },
    deleteEvent(value) {
      var replace = "%"+ value + "%"
      this.filter.name = this.filter.name.replace(replace, '')
      if (this.filter.name === '') {
        this.filter.name = null
      }
      this.update()
    },
    update () {
      this.$emit("update", this.filter)
    }
  }
}
</script>

<style scoped lang="less">
    .filter {
      display: inline;
    }
    .tags {
        margin: 0 1em;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .vca-collapse {
        margin-bottom: 1em;
        padding: 0.4em 1em;
        border-radius: 0.4em;
        background-color: #efefef;
    }

    .state {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 2.5em;

        span {
            font-weight: bold;
        }
        .status-bar {
            flex-grow: 1;
        }
        button {
            border: 1px solid rgba(60, 60, 60, 0.26);
            border-radius: 4px;
            margin-left: 1em;
            background: none;
        }
    }

    .content {
        padding-top: 0.4em;
    }

    .collapsed {
        .content {
            display: none;
        }
    }

    .non-collapsed {
        .content {
            display: block;
        }
    }
    .el-collapse {
    border-top: 1px;
border-collapse: 1px;
    border-bottom: 1px;
  }

</style>

