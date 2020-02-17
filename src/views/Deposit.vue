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
    props: {
  query: {
    type: Object,
    default : function () {
      return {
    
        size: 0,
    
        offset: 0,
    
        sortby: null,
    sortdir: "ASC",
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

    },
    created () {
      this.init(this.query)
    },
    data () {
            var editableDefault = {
                "value": null,
                "key": -1
            }
            return {
                "editableDefault" : editableDefault,
                "editable": JSON.parse(JSON.stringify(editableDefault)),
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
            'init',
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
