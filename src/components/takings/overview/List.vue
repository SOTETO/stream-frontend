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
          <p>{{$t('takings.table.popup.cash')}}: {{ scope.row.amount.cash }}</p>
          <p>{{$t('takings.table.popup.extern')}}: {{ scope.row.amount.extern }}</p>
          <div slot="reference" class="name-wrapper">
            {{ formatAmount(scope.row.amount.full)}}
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
          <DepositLights :donation="scope.row" />
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
                <p>{{$t('takings.table.popup.cash')}}: {{ scope.row.amount.cash }}</p>
                <p>{{$t('takings.table.popup.extern')}}: {{ scope.row.amount.extern }}</p>
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
import CurrencyFormatter from '@/utils/CurrencyFormatter'
import DepositLights from '@/components/deposit/DepositLights'
import DepositAdd from '@/components/deposit/DepositAdd'
import UserButton from '@/components/utils/UserButton'
import { Notification } from 'element-ui'

Vue.use(Notification)
Notification.closeAll()

export default {
  name: "List",
  components: {
    DepositLights, DepositAdd, UserButton
  },
  props: {
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
  created () {
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
      } else {
          this.init()
      }
  },
  methods: {
      ...mapActions('takings', [
          'init', // map `this.init()` to `this.$store.dispatch('donations/init')`
      ]),
      formatAmount(amount) {
          var formatter = CurrencyFormatter.getFromNumeric("EUR", amount) // Todo: select currency based on donation entry!
          return formatter.localize()
      },
      formatDate(date) {
          var d = new Date(date)
          return this.$d(d, 'short')
      },
      /*supporter (taking) {
          return [taking.author].concat(taking.supporter)
              .filter((value, index, self) => self.indexOf(value) === index)
      },
      teaserSupporter (taking) {
          return this.supporter(taking).slice(0, this.maximumTags)
      },
      hasAddtionalSupporter (taking) {
          return this.supporter(taking).length > this.maximumTags
      },*/
      editPage (uuid) {
        this.$router.push({name: 'takings-edit', params: {id: uuid}})
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
