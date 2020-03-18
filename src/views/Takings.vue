<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <TakingOverview class="box-card" ref="overview" :deposit="deposit" :depositAddView="depositAddView"/>
        </VcAColumn>
        <VcAColumn size="20%">
            <el-card class="box-card">
                <router-link class="vca-button-primary vca-full-width" to="/takings/add">
                  {{ $t('takings.buttons.add') }}
                </router-link>
                <button v-if="!depositAddView" class="vca-button-primary vca-full-width" v-on:click.prevent="depositAdd">
                    {{ this.$t('takings.buttons.depositAdd') }}
                </button>
                <button v-if="depositAddView" class="vca-button-warn vca-full-width" v-on:click.prevent="depositAdd">
                    {{ $t('takings.buttons.abort') }}
                </button>
              <p class="info"><i class="el-icon-info"></i> {{ this.$t("takings.info") }} <a href="https://pool2.vivaconagua.org/wiki/index.php/How_to_Finanzen">How to Finanzen</a> </p>
            </el-card>
            <el-card v-if="depositAddView" :deposit="deposit" class="box-card tail">
              <TakingDeposit :deposit="deposit" v-on:resetDepositAddView="resetDepositAddView" v-on:submit="depositSubmit"></TakingDeposit>
            </el-card>
            <!--el-card class="box-card tail">
              <CrewDetail />
            </el-card-->
        </VcAColumn>
    </VcAFrame>
</template>

<script>
  //import List from '@/components/takings/overview/TakingList'
  import ListMenu from '../components/utils/ListMenu'
  import { Card} from 'element-ui'
  import { mapGetters, mapActions } from 'vuex'
  import { VcAFrame, VcAColumn} from 'vca-widget-base'
  import 'vca-widget-base/dist/vca-widget-base.css'
  import TakingDeposit from '@/components/takings/overview/TakingDeposit' 
  import TakingFilter from "../components/takings/overview/TakingFilter"
  import CrewDetail from '@/components/takings/overview/CrewDetail'
  import TakingOverview from '@/components/takings/TakingOverview'
  export default {
    name: "takings",
    components: {
      VcAFrame, VcAColumn, TakingOverview, ListMenu, TakingDeposit, TakingFilter, 'el-card': Card, CrewDetail
    },
    data () {
      var editableDefault = {
        "value": null,
        "key": -1
      }
      return {
        "editableDefault" : editableDefault,
        "editable": JSON.parse(JSON.stringify(editableDefault)),
        "depositAddView": false,
        "deposit": {
          "full": {
            "amount": 0,
            "currency": "EUR"
          },
          "depositUnits": [],
          "dateOfDeposit": null
      }
    }
  },
  computed: {
    ...mapGetters('deposits', {
      isError: 'isError',
      getErrorCode: 'getErrorCode',
    }),
  },
  methods: {
    ...mapActions('takings', [
      'page'
    ]),
    resetDepositAddView() {
      this.depositAddView = false;
    },
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
    },
    depositAdd () {
      if (this.depositAddView === true) {
        this.depositAddView = false
      } else {
        this.depositAddView = true
    
      }
    },
    depositSubmit () {
      this.$refs.overview.refresh()
    }
  },
  updated () {
    if(this.isError) {
      switch(this.getErrorCode) {
        case 400:
          this.open(this.$t('errors.ajax.badRequest.header'), this.$t('errors.ajax.badRequest.msg'), 'error')
          break;
        case 403:
          this.open(this.$t('errors.ajax.forbidden.header'), this.$t('errors.ajax.forbidden.msg'), 'error')
          break;
        case 404:
          this.open(this.$t('errors.ajax.notFound.header'), this.$t('errors.ajax.notFound.msg'), 'error')
          break;
        default:
          if(this.getErrorCode > 404) {
            this.open(this.$t('errors.ajax.server.header'), this.$t('errors.ajax.server.msg'), 'error')
          }
      }
    }
  }
}
</script>

<style scoped lang="less">
    @import '../assets/less/general.less';

    .info {
      font-size: smaller;
      color: grey;
      font-style: italic;

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
