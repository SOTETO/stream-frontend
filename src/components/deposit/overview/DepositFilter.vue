<template>
  <el-collapse title="Filter">
    <el-collapse-item title="Filter">
      <el-row :gutter="50">
        <el-col :span="12">

      <el-cascader v-model="filter"  @change=""  placeholder=""  expand-trigger="click"/>
          <el-form :model="filter" label-position="left" label-width="8em">
            <el-form-item :label="lang.events.label" required>
              <FilterTags
                :lang="lang.events"
                v-on:commit="addEvent($event)"
                v-on:delete="deleteEvent($event)"
              />
            </el-form-item>
            <el-form-item :label="lang.crews.label" required>
              <FilterTags
                :lang="lang.crews"
                v-on:commit="addCrew($event)"
                v-on:delete="deleteCrew($event)"
              />
            </el-form-item>
            <el-form-item :label="lang.created.label" required>
              <DateFilter
                :from="filter.crfrom"
                :to="filter.crto"
                v-on:update="dateCreated($event)"
              />
            </el-form-item>
            <el-form-item :label="lang.received.label" required>
              <DateFilter
                :from="filter.payfrom"
                :to="filter.payto"
                v-on:update="dateReceived($event)"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form label-position="left">
            <el-form-item :label="lang.confirmed.label" required>
              <FilterOption :lang="lang.confirmed" @change="setConfimed($event)" />
            </el-form-item>
            <el-form-item :label="lang.confirmed_date.label" required>
              <DateFilter
                :from="filter.cfrom"
                :to="filter.cto"
                v-on:update="dateConfirmed($event)"
              />
            </el-form-item>
          </el-form>
          <el-form>
            <el-form-item :label="lang.amount.label" required>
              <FilterAmount @from="addAmountFrom($event)" @to="addAmountTo($event)" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { CrewSelect } from "vca-widget-user";
import DateFilter from "@/components/utils/FilterDate";
import FilterTags from "@/components/utils/FilterTags";
import FilterOption from "@/components/utils/FilterOption";
import FilterAmount from "@/components/utils/FilterAmount";

export default {
  name: "DepositFilter",
  components: {
    CrewSelect,
    DateFilter,
    FilterTags,
    FilterOption,
    FilterAmount
  },
  props: {
    lang: {
      type: Object,
      default: function() {
        return {
          crew: {
            label: "Crew"
          },
          events: {
            label: "Event",
            new_tag: "+ New Event"
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
        };
      }
    }
  },
  data() {
    return {
      filter: {
        publicId: null,
        takingsId: null,
        crew: null,
        name: null,
        confirmed: null,
        cby: null,
        cfrom: null,
        cto: null,
        payfrom: null,
        payto: null,
        crfrom: null,
        crto: null,
        crewname: null
      }
    };
  },
  methods: {
    dateConfirmed(value) {
      this.filter.cfrom = value.from;
      this.filter.cto = value.to;
      this.update();
    },
    dateCreated(value) {
      this.filter.crfrom = value.from;
      this.filter.crto = value.to;
      this.update();
    },
    dateReceived(value) {
      this.filter.payfrom = value.from;
      this.filter.payto = value.to;
      this.update();
    },

    addEvent(value) {
      if (this.filter.name !== null) {
        this.filter.name = this.filter.name + " %" + value + "%";
      } else {
        this.filter.name = " %" + value + "%";
      }
      this.update();
    },
    deleteEvent(value) {
      var replace = " %" + value + "%";
      this.filter.name = this.filter.name.replace(replace, "");
      if (this.filter.name === "") {
        this.filter.name = null;
      }
      this.update();
    },

    addAmountFrom(value) {
      this.filter.afrom = value;
      this.update();
    },
    addAmountTo(value) {
      this.filter.ato = value;
      this.update();
    },
    addCrew(value) {
      if (this.filter.crewname !== null) {
        this.filter.crewname = this.filter.crewname + " %" + value + "%";
      } else {
        this.filter.crewname = " %" + value + "%";
      }
      this.update();
    },
    deleteCrew(value) {
      var replace = " %" + value + "%";
      this.filter.crewname = this.filter.crewname.replace(replace, "");
      if (this.filter.crewname === "") {
        this.filter.crewname = null;
      }
      this.update();
    },
    setConfimed(value) {
      this.filter.confirmed = value;
      this.update();
    },
    commit() {
      if (
        typeof this.filter.crew === "object" &&
        this.filter.crew !== null &&
        this.filter.crew.hasOwnProperty("id")
      ) {
        this.filter.crew = this.filter.crew.id;
      }
      this.setFilter(JSON.parse(JSON.stringify(this.filter)));
      this.$emit("vca-filter-updated");
    },
    update() {
      this.$emit("update", this.filter);
    }
  }
};
</script>

<style scoped>
.el-collapse {
  border-top: 1px;
  border-bottom: 1px;
}
</style>
