<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('household.header.box.list')">
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
                    <HouseholdFilter @vca-filter-updated="addState" />
                </Collapse>
                <ListMenu :fields="sortFields" store="household" />
                <button v-if="hasPrevious" v-on:click="pageDown()" class="paginate">
                    {{ $tc('pagination.previous', pageGet.previous, { 'number': pageGet.previous }) }}
                </button>
                <ExpenseList @vca-edit-expense="editState" />
                <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
                    {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
                </button>
            </VcABox>
        </VcAColumn>
        <VcAColumn size="20%">
             <VcABox :first="true" :title="$t('household.header.box.expense')">
              <div slot="header" v-if="isEditState">
                    <button class="vca-button-default" @click.prevent="addState">
                        {{ $t("household.buttons.cancel") }}
                    </button>
                </div>
                <ExpenseForm v-if="!isEditState" :key="editable.key" />
                <ExpenseForm v-if="isEditState" :uuid="editable.key" :key="editable.key" @vca-expense-update="addState" />
            </VcABox>
            <VcABox :title="$t('household.header.box.transitions')" v-if="isEditState">
                <div slot="header" v-if="isEditState">
                    <button class="vca-button-default" @click.prevent="addState">
                        {{ $t("household.buttons.cancel") }}
                    </button>
                </div>
                <ExpenseStateTransition :uuid="editable.key" />
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox, VcAFilterTag } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import ExpenseForm from '../components/household/ExpenseForm'
    import ExpenseStateTransition from '../components/household/ExpenseStateTransition'
    import ExpenseList from '../components/household/ExpenseList'
    import ListMenu from '../components/utils/ListMenu'
    import HouseholdFilter from "../components/household/HouseholdFilter";
    import Collapse from "../components/utils/Collapse";
    // import HouseholdFilterTag from "../components/household/HouseholdFilterTag";
    import CurrencyFormatter from '@/utils/CurrencyFormatter'
    import { CrewPlainName } from 'vca-widget-user'
    import StateMessageInterpreter from '@/utils/StateMessageInterpreter'

    export default {
        name: "Household",
        components: {
            // HouseholdFilterTag,
            "Collapse": Collapse,
            "HouseholdFilter": HouseholdFilter,
            "VcAFrame": VcAFrame,
            "VcAColumn": VcAColumn,
            "VcABox": VcABox,
            "ExpenseForm": ExpenseForm,
            "ExpenseStateTransition": ExpenseStateTransition,
            "ExpenseList": ExpenseList,
            "ListMenu": ListMenu,
            "VcAFilterTag": VcAFilterTag,
            "CrewPlainName": CrewPlainName
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
            ...mapGetters('household', {
                byId: 'byId',
                pageGet: 'page',
                taggableFilter: 'taggableFilter'
            }),
            isEditState () {
                return typeof this.editable.value !== "undefined" && this.editable.value !== null
            },
            hasPrevious () {
                return this.pageGet.previous > 0
            },
            hasNext () {
                return this.pageGet.next > 0
            },
            hasCrewTag() {
                return this.taggableFilter.filter(field => field.name === "crew").length > 0
            },
            sortFields() {
                return [
                    {
                        "value": "household_version.reason_what",
                        "label": this.$t("household.header.table.what")
                    },
                    {
                        "value": "household_version.reason_wherefor",
                        "label": this.$t("household.header.table.wherefor")
                    },
                    {
                        "value": "household_version.crew",
                        "label": this.$t("household.header.table.crew")
                    },
                    {
                        "value": "household_version.amount",
                        "label": this.$t("household.header.table.amount")
                    },
                    {
                        "value": "household_version.created",
                        "label": this.$t("household.header.table.created")
                    },
                    {
                        "value": "household_version.updated",
                        "label": this.$t("household.header.table.updated")
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
          isEditable () {
            var res = true
            if(this.isUpdate) {
              var state = this.stateById(this.expense.id)
              res = StateMessageInterpreter.isEditable(state)
            }
            return res

          }
        },
        methods: {
            ...mapActions('household', {
                page: 'page'
            }),
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