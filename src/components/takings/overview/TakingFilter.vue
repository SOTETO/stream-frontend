<template>
  <div ref="collapse" class="vca-collapse collapsed">
    <div class="state">
       <span>{{ $t('household.filter.title') }}</span>
       <div class="status-bar">
         <slot name="status"></slot>
       </div>
       <button @click="collapse">{{ buttonLabel }}</button>
    </div>
    <div class="content">
      <slot>
    <el-form
        :model="input"
        label-position="left"
        label-width="8em">
        <el-form-item  class="filter" :label="$t('takings.filter.name')" required>
            <FilterTags v-on:commit="commitName($event)" v-on:delete="deleteName($event)" />
            <FilterTags v-on:commit="commitNorms($event)" v-on:delete="deleteNorms($event)" />
        </el-form-item>
    </el-form>
    </slot>
    </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions} from 'vuex'
    import FilterTags from '@/components/utils/FilterTags'

    export default {
        name: "TakingFilter",
        components: {
            FilterTags
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
              },
              'buttonLabel': this.$t('collapse.button.show')

            }
        },
        created() {
            this.filter = this.getFilter
        },
        methods: {
            ...mapActions("takings", {
                setFilter: 'filter'
            }),
            collapse() {
                if(this.$refs.collapse.classList.contains("collapsed")) {
                    this.$refs.collapse.classList.remove("collapsed")
                    this.$refs.collapse.classList.add("non-collapsed")
                    this.buttonLabel = this.$t("collapse.button.hide")
                } else if(this.$refs.collapse.classList.contains("non-collapsed")) {
                    this.$refs.collapse.classList.remove("non-collapsed")
                    this.$refs.collapse.classList.add("collapsed")
                    this.buttonLabel = this.$t("collapse.button.show")
                }
            },
            commitName(value) {
              if(this.filter.name !== null) {
                this.filter.name.push(value)
              } else {
                this.filter.name = [value]
              }
              this.commit()
            },
            commitNorms(value) {
              if(this.filter.norms !== null) {
                this.filter.norms.push(value)
              } else {
                this.filter.norms = [value]
              }
              this.commit()
            },
            deleteNorms(value) {
              var index = this.filter.norms.indexOf(value)
              if (this.filter.norms.length === 1 ) {
                this.filter.norms = null
              } else if (index > -1) {
                this.filter.norms.splice(index, 1)
              }
              this.commit()
            },
            deleteName(value) {
              var index = this.filter.name.indexOf(value);
              if (this.filter.name.length === 1) {
                this.filter.name = null
              }
              else if (index > -1) {
                this.filter.name.splice(index, 1);
              }
              this.commit()
            },
            commit() {
                if(typeof this.filter.crew === "object" && this.filter.crew !== null && this.filter.crew.hasOwnProperty("id")) {
                    this.filter.crew = this.filter.crew.id
                }
                this.setFilter(JSON.parse(JSON.stringify(this.filter)))
                this.$emit("vca-filter-updated")
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

</style>
