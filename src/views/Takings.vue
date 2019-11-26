<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('takings.head.table')">

                    <TakingFilter @vca-filter-updated="addState" />

                <ListMenu :fields="sortFields" store="takings" />
                <button v-if="hasPrevious" v-on:click="pageDown()" class="paginate">
                    {{ $tc('pagination.previous', pageGet.previous, { 'number': pageGet.previous }) }}
                </button>
                <List />
                <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
                    {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
                </button>
            </VcABox>
        </VcAColumn>
        <VcAColumn size="20%">
            <VcABox :first="true" :title="$t('takings.head.add')">
                <router-link class="vca-button-primary vca-full-width" to="/donations/add">
                  {{ $t('takings.buttons.donation') }}
                </router-link>
                <router-link class="vca-button-primary vca-full-width" to="/takings/edit">
                  {{ $t('takings.buttons.economic') }}
                </router-link>
            </VcABox>
            <VcABox :title="$t('takings.head.deposit')">
              <TakingDeposit takings="takings" ></TakingDeposit>
            </VcAbox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
  import Collapse from "../components/utils/Collapse";
  import List from '@/components/takings/List'
  import ListMenu from '../components/utils/ListMenu'
  import { mapGetters, mapActions } from 'vuex'
  import { VcAFrame, VcAColumn, VcABox, VcAFilterTag } from 'vca-widget-base'
  import 'vca-widget-base/dist/vca-widget-base.css'
  import TakingDeposit from '@/components/takings/TakingDeposit' 
  import TakingFilter from "../components/takings/TakingFilter"
  import { CrewPlainName } from 'vca-widget-user'
  export default {
    name: "takings",
    components: {
      VcAFrame, VcAColumn, VcABox, List, ListMenu, TakingDeposit, Collapse, VcAFilterTag, CrewPlainName, TakingFilter
    },
    data () {
      var editableDefault = {
        "value": null,
        "key": -1
      }
      return {
        "editableDefault" : editableDefault,
        "editable": JSON.parse(JSON.stringify(editableDefault))
      }
    },
    computed: {
      ...mapGetters('takings', {
        pageGet: 'page',
        taggableFilter: 'taggableFilter'
      }),
      hasPrevious () {
        return this.pageGet.previous > 0
      },
      hasNext () {
        return this.pageGet.next > 0
      },
      sortFields() {
        return [
          { 
            "value": "taking.norms",
            "label": this.$t("takings.table.sort.norms")
          },
          { 
            "value": "taking.fullamount",
            "label": this.$t("takings.table.sort.amount")
          },
          {
            "value": "taking.description",
            "label": this.$t("takings.table.sort.title")
          },
          {
            "value": "taking.created",
            "label": this.$t("takings.table.sort.date")
          }
        ]
      },
      filterCrewTags () {
        return JSON.parse(JSON.stringify(this.taggableFilter.filter(field => field.name === "crew"))).map(crewTag => {
          crewTag.name = this.$t('household.filter.tag.crew')
          return crewTag
        })
      },   
      filterCrewTag () {
        return [{'name': 'name', 'value': 'value'}]
      },
      filterTags () {
        return [{'name': 'norms', 'value': 'value'}]
      },
      filterTag () {
        return this.taggableFilter.reduce((fields, field) => {
          var translate = f => {
            if(f.name === "publicId") {
              f.value = this.$t("household.filter.tag.values." + f.name + "." + f.value)
            } else if(f.name === "crew") {
              f.value = this.$t('household.states.' + f.value)
            } else if(f.name === "name") {
              f.value = this.$t('household.process.VolunteerManager.' + f.value)
            } else if(f.name === "norms") {
              f.value = this.$t('household.process.Employee.' + f.value)
            }
          }
          var res = fields
          if((field.name !== "complete" || field.value !== "noSelection") && field.name !== "crew") {
            if(Array.isArray(field.value)) {
              res = res.concat(field.value.map(v => {
                return translate({
                  "name": field.name,
                  "value": v
                })
              }))
            } else {
              res.push(translate(field))
            }
          }
          return res
        }, [])
      }
    },
    methods: {
      ...mapActions('takings', [
        'page'
      ]),
      editState (expense) {
        this.editable.value = this.byId(expense.id)
        this.editable.key = expense.id
      },
      addState () {
        this.editable = JSON.parse(JSON.stringify(this.editableDefault))
      },
      pageDown () {
        this.page(true)
      },
      pageUp () {
        this.page(false)
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
</style>
