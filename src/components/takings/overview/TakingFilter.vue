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
            <el-form-item :label="lang.crews.label" required>
              <FilterTags :lang="lang.crews" v-on:commit="addCrew($event)" v-on:delete="deleteCrew($event)"/>
            </el-form-item>
           <el-form-item
              :label="lang.external.label"
              required
              >
              <FilterOption :lang="lang.external" @change="setExternal($event)"/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">

          <el-form
            label-position="left"
            >
           <el-form-item
             :label="lang.received.label"
             required
             >
             <DateFilter :from="filter.payfrom" :to="filter.payto" v-on:update="dateReceived($event)"/>
           </el-form-item>
            <el-form-item
              :label="lang.created.label"
              required
             >

             <DateFilter :from="filter.crfrom" :to="filter.crto" v-on:update="dateCreated($event)"/>
           </el-form-item>

           <el-form-item
              :label="lang.norms.label"
              required
              >
              <FilterNorms :lang="lang.norms" @change="setNorms($event)"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>

</template>

<script>
    
import DateFilter from '@/components/utils/FilterDate'
import FilterTags from '@/components/utils/FilterTags'
import FilterOption from '@/components/utils/FilterOption'
import FilterNorms from '@/components/utils/FilterNorms'

export default {
  name: "TakingFilter",
  components: {
    FilterTags, DateFilter, FilterOption, FilterNorms
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
            label: "Aktion",
            new_tag: "+ New Aktion"
          },
          crews: {
            label: "Crews",
            new_tag: "+ add Crew"
          },
          created: {
            label: "Created"
          },
          received: {
            label: "Received"
          },
          norms: {
            label: "Art der Einzahlung",
            label_ECO: "Wirtschaftlich",
            label_DON: "Spende",
            label_null: "All"
          },
           external: {
            label: "Bar/Extern",
            label_true: "Extern",
            label_false: "Bar",
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
        open: true,
        payfrom: null,
        payto:null,
        crfrom: null,
        crto:null,
        crewname:null,
        norms:null,
        external:null
      }
    }
  },
  methods: {
    addEvent(value) {
      if (this.filter.name !== null) {
        this.filter.name = this.filter.name + " %" + value + "%"
      } else {
        this.filter.name = " %" + value + "%"
      }
      this.update()
    },
    deleteEvent(value) {
      var replace = " %"+ value + "%"
      this.filter.name = this.filter.name.replace(replace, '')
      if (this.filter.name === '') {
        this.filter.name = null
      }
      this.update()
    },
    addCrew(value) {
      if (this.filter.crewname !== null) {
        this.filter.crewname = this.filter.crewname + " %" + value + "%"
      } else {
        this.filter.crewname = " %" + value + "%"
      }
      this.update()
    },
    deleteCrew(value) {
      var replace = " %"+ value + "%"
      this.filter.crewname = this.filter.crewname.replace(replace, '')
      if (this.filter.crewname === '') {
        this.filter.crewname = null
      }
      this.update()
    },
    dateCreated(value) {
        this.filter.crfrom = value.from
        this.filter.crto = value.to
      this.update()
    },
    dateReceived(value) {
        this.filter.payfrom = value.from
        this.filter.payto = value.to
      this.update()
    },
    setNorms(value) {
      this.filter.norms = value
      this.update()
    },
    setExternal(value) {
      this.filter.external = value
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

