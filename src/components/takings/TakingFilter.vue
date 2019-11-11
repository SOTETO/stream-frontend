<template>
    <el-form
        :model="input"
        label-position="left"
        label-width="8em"
    >
        <el-form-item :label="$t('household.filter.what')" required>
            <button v-on:click="commitName()" class="paginate">
              +  
            </button>
        <el-input v-model="input.name"></el-input>
        <FilterTag v-for="tag in filter.name" :field="'name'" :value="tag" :key="tag.name" v-on:delete="deleteName($event)" />
        </el-form-item>
        <el-form-item :label="$t('household.filter.wherefor')" required>
            <el-input v-model="input.norms" @input="commitNorms"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    import { mapGetters, mapActions} from 'vuex'
    import { Input, InputNumber, Form, FormItem } from 'element-ui'
    import MoneyInput from "../utils/MoneyInput"
    import { CrewSelect } from 'vca-widget-user'
    import FilterTag from '@/utils/FilterTag'

    export default {
        name: "TakingFilter",
        components: {
            MoneyInput,
            'el-input': Input,
            'el-input-number': InputNumber,
            'el-form-item': FormItem,
            'el-form': Form,
            CrewSelect,
            FilterTag
        },
        props: {
            'currency': {
                'type': String,
                'default': "EUR"
            }
        },
        computed: {
            ...mapGetters("takings", {
                getFilter: 'filter'
            }),
            stateOptions () {
                return ["AppliedFor", "Requested", "Approved", "ToRepay", "Repaid", "Refused", "NotEditable"]
            },
            volunteerManagerOptions () {
                return ["Idle", "Knows", "KnowsNothing"]
            },
            employeeOptions () {
                return ["Start", "Free", "Refused"]
            },
            completeOptions () {
                return ["noSelection", "incomplete", "complete"]
            }
        },
        data () {
            return {
              'filter': null,
              'input': {
                    'name': "",
                    'norms': "",
              }
            }
        },
        created() {
            this.filter = this.getFilter
        },
        methods: {
            ...mapActions("takings", {
                setFilter: 'filter'
            }),
            commitName() {
              if(this.filter.name !== null) {
                this.filter.name.push(this.input.name)
              } else {
                this.filter.name = [this.input.name]
              }
              this.commit()
            },
            deleteName(value) {
              console.log(value)
              var index = this.filter.name.indexOf(value);
              if (this.filter.name.length === 1) {
                this.filter.name = null
              }
              else if (index > -1) {
                this.filter.name.splice(index, 1);
              }
              this.commit()
            },
            commitNorms() {
              this.filter.norms.push(this.input.norms)
              this.commit()
            },
            commit() {
                if(typeof this.filter.crew === "object" && this.filter.crew !== null && this.filter.crew.hasOwnProperty("id")) {
                    this.filter.crew = this.filter.crew.id
                }
                this.setFilter(JSON.parse(JSON.stringify(this.filter)))
                this.$emit("vca-filter-updated")
            },
            removeA(arr) {
              var what, a = arguments, L = a.length, ax;
              while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax= arr.indexOf(what)) !== -1) {
                  arr.splice(ax, 1);
                }
              }
              return arr;
            }
        }
    }
</script>

<style scoped>

</style>
