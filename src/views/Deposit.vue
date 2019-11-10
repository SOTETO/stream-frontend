<template>
  <VcAFrame>
    <VcAColumn size="90%">
      <VcABox :first="true"  :title="$t('deposits.header.box')">
        <Collapse :label="$t('household.filter.title')">
          <template slot="status">
            <div  class="tags">
              <!--<VcAFilterTag v-if="hasCrewTag" v-for="tag in filterCrewTag" :field="tag.name" :key="tag.name">-->
              <VcAFilterTag v-for="tag in filterCrewTag" :field="tag.name" :key="tag.name">
              <CrewPlainName :id="tag.value" />
              </VcAFilterTag>
              <VcAFilterTag v-for="tag in filterTags" :field="tag.name" :value="tag.value" :key="tag.name" />
            </div>
          </template>
          <DepositFilter @vca-filter-updated="addState" />
        </Collapse>
        <ListMenu :fields="sortFields" store="deposits" />
        <button v-if="hasPrevious" v-on:click="pageDown()" class="paginate">
          {{ $tc('pagination.previous', pageGet.previous, { 'number': pageGet.previous }) }}
        </button>
        <DepositList/>
        <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
          {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
        </button>
      </VcABox>
    </VcAColumn>
  </VcAFrame>
</template>

<script>
  import { CrewPlainName } from 'vca-widget-user'
  import { VcAFrame, VcAColumn, VcABox, VcAFilterTag } from 'vca-widget-base'
  import DepositFilter from '@/components/deposit/DepositFilter'
  import DepositList from '@/components/deposit/DepositList'
  import ListMenu from '../components/utils/ListMenu'
  import { mapGetters, mapActions } from 'vuex'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  import Collapse from "../components/utils/Collapse"
  export default {
    name: "deposits",
    components: {
      VcAFrame, VcAColumn, VcABox, DepositList, ListMenu, Collapse, VcAFilterTag, CrewPlainName, DepositFilter
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
        ...mapGetters('deposits', {
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
                    "value": "deposit.created",
                    "label": this.$t("deposits.table.head.created")
                },
                {
                    "value": "deposit.date_of_deposit",
                    "label": this.$t("deposits.table.head.date")
                },
                {
                    "value": "deposit.full_amount",
                    "label": this.$t("deposits.table.head.amount")
                },
                {
                    "value": "deposit.confirmed",
                    "label": this.$t("deposits.table.head.state")
                },
                {
                    "value": "deposit.crew",
                    "label": this.$t("deposits.table.head.crew")
                }
            ]
        },
        filterCrewTag () {
                return JSON.parse(JSON.stringify(this.taggableFilter.filter(field => field.name === "crew"))).map(crewTag => {
                    crewTag.name = this.$t('household.filter.tag.crew')
                    return crewTag
                })
            },
            filterTags () {
                return this.taggableFilter.reduce((fields, field) => {
                    var translate = f => {
                        if(f.name === "complete") {
                            f.value = this.$t("household.filter.tag.values." + f.name + "." + f.value)
                        } else if(f.name === "repayment") {
                            f.value = this.$t('household.states.' + f.value)
                        } else if(f.name === "volunteerManager") {
                            f.value = this.$t('household.process.VolunteerManager.' + f.value)
                        } else if(f.name === "employee") {
                            f.value = this.$t('household.process.Employee.' + f.value)
                        } else if(f.name === "amount") {
                            var formatter = CurrencyFormatter.getFromNumeric(f.value.currency, f.value.amount)
                            f.value = formatter.localize()
                        }
                        f.name = this.$t('household.filter.tag.' + field.name)
                        return f
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
            },
    },

    methods: {
        ...mapActions('deposits', [
            'page'
        ]),
        pageDown () {
            this.page(true)
        },
        pageUp () {
            this.page(false)
        },
        editState (expense) {
          this.editable.value = this.byId(expense.id)
          this.editable.key = expense.id
        },
      addState () {
        this.editable = JSON.parse(JSON.stringify(this.editableDefault))
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
