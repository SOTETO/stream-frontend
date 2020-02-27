<template>
    <el-table
      :data="takings"
      style="width: 100%">

      <el-table-column
        prop="name"
        :label='$t("takings.table.head.title")'
        >
      </el-table-column>

      <el-table-column
        prop="crew"
        :label='$t("takings.table.head.crew")'
        >
        <template slot-scope="scope">
            <div class="vca-crew-name" v-for="c in scope.row.crew" :key="c.id">
              <el-tag> {{ c.name }} </el-tag>
            </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="amount"
        :label='$t("takings.table.head.amount")'
        >
        <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>{{$t('takings.table.popup.cash')}}: {{ formatAmount(scope.row.amount.cash) }}</p>
          <p>{{$t('takings.table.popup.extern')}}: {{ formatAmount(scope.row.amount.extern) }}</p>
          <div slot="reference" class="name-wrapper">
            {{ formatAmount(scope.row.amount.full)}}
            <i v-if="isExtern(scope.row.amount.extern)" class="el-icon-bank-card"></i>
          </div>
        </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop=""
        :label='$t("takings.table.head.deposited")'
        width="210"
        >
        <template slot-scope="scope">
          <DepositLights :taking="scope.row" />
          <DepositAdd 
            v-if="depositAddView" 
            :depositUnit="deposit.depositUnits" 
            :taking="scope.row" 
            :amount="scope.row.amount.full" 
            :takingId="scope.row.id" />
        </template>
      </el-table-column>

      <el-table-column
        prop=""
        :label='$t("takings.table.head.date")'
        width="210"
        >
        <template slot-scope="scope">
          <div class="dates">
          <span>{{ $t("takings.table.dates.received", { "date":  formatDate(scope.row.date.received) }) }}</span>
          <span>{{ $t("takings.table.dates.created", { "date":  formatDate(scope.row.date.created) }) }}</span>
          </div>
        </template>
      </el-table-column>

 
      <el-table-column
        prop="supporter"
        :label='$t("takings.table.head.supporter")'
        >
        <template slot-scope="scope">
          <div class="vca-crew-name" v-for="s in scope.row.supporter" :key="s.uuid">
            <UserButton :user="s" />
          </div>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="formatAmount(amount)"
        :label='$t("takings.table.head.edit")'
        >
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <el-popover trigger="click" placement="top">
                <TakingsDetails :amount="scope.row.amount" />
                <div slot="reference" class="name-wrapper">
                  <el-button type="primary" icon="el-icon-search" size="mini">
                  </el-button>
                </div>
              </el-popover>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPage(scope.row.id)">
              </el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Money from '@/utils/Money'
import DepositLights from '@/components/deposit/DepositLights'
import DepositAdd from '@/components/deposit/DepositAdd'
import UserButton from '@/components/utils/UserButton'
import TakingsDetails from '@/components/takings/overview/TakingsDetails'
import { Notification } from 'element-ui'

Vue.use(Notification)
Notification.closeAll()

export default {
  name: "TakingList",
  components: {
    DepositLights, DepositAdd, UserButton, TakingsDetails
  },
  props: {
    filter: {
      type: Object,
      default: function () {
        return {}
      }
    },
    depositAddView : {
      type: Boolean,
      default: false
    },
    deposit: {
      type: Object,
      default: function () {
        return {
          "full": {
            "amount": 0,
            "currency": "EUR"
          },
          "depositUnits": [],
          "dateOfDeposit": null
        }
      }
    }
  },
  data () {
    return {
      sortPage: {
        sortby: null,
        sort: null,
        page: 0,
        offset: 4
      }
    }
  },
  computed: {
    ...mapGetters(
      'takings', {
        takings: 'overview',
        isError: 'isError',
        getErrorCode: 'getErrorCode',
        getById: 'getById',
      },
    ),

    maximumTags () {
      return 2;
    },
    isEployee () {
      return this.$store.getters['user/is'](["Admin", "Employee"]);
    },
  },
  methods: {
      formatAmount(amount) {
          return Money.getString(amount, "EUR" )
      },
      formatDate(date) {
          var d = new Date(date)
          return this.$d(d, 'short')
      },
      editPage (uuid) {
        this.$router.push({name: 'takings-edit', params: {id: uuid}})
      },
      isExtern (value) {
        if(value > 0) {
          return true
        } else {
          return false
        }
      },
      open(title, message, type) {
          Notification({
              title:  title,
              message: message,
              type: type
          });
      }
  }
}
</script>

<style scoped lang="less">
    @import '../../../assets/less/general.less';

    .takings {
        width: 100%;

        & .takings:nth-child(even) {
            background-color: #colors[primaryDeactivated];
        }

        & th {
            .colorProfilePrimary();
            font-weight: bold;
            padding: 0.25em 0;
            &:first-child {
                padding-left: 0.5em;
            }
            &:last-child {
                padding-right: 0.5em;
            }
        }
    }

    .taking {
        & tr {
            padding: 0.5em 0.5em 0 0.15em;
        }
        & td {
            padding: 0.5em 0.5em 0.5em 0.5em;
            vertical-align: top;
        }
    }

    .dates, .deposit {
        display: flex;
        flex-direction: column;
        padding: 0.2em;
        font-size: 0.8em;
    }
    .crew, .supporter {
        display: flex;
        flex-direction: row;
        & /deep/ .tag {
            margin-right: 0.5em;
        }
    }
</style>
