<template>
    <table class="takings">
        <thead>
        <tr>
            <th>{{ $t("takings.table.head.title") }}</th>
            <th>{{ $t("takings.table.head.crew") }}</th>
            <th>{{ $t("takings.table.head.amount") }}</th>
            <th>{{ $t("takings.table.head.deposited") }}</th>
            <th>{{ $t("takings.table.head.date") }}</th>
            <th>{{ $t("takings.table.head.supporter") }}</th>
            <th v-if="isEployee">{{ $t("takings.table.head.norms") }} </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="taking in takings" :key="taking.id" class="taking">
            <td>{{ taking.name }}</td>
            <td class="crew">
              <span class="vca-crew-name" v-for="c in taking.crew">
                <el-tag> {{ c.name }} </el-tag>
              </span>
            </td>
            <td>{{ formatAmount(taking.amount) }}</td>
            <td>
                <DepositLights :donation="taking" />
                <DepositAdd v-if="depositAddView" :depositUnit="deposit.depositUnits" :amount="taking.amount" :takingId="taking.id" />
            </td>
            <td>
                <div class="dates">
                    <span>{{ $t("takings.table.dates.received", { "date":  formatDate(taking.date.received) }) }}</span>
                    <span>{{ $t("takings.table.dates.created", { "date":  formatDate(taking.date.created) }) }}</span>
                </div>
            </td>
            <td>
                <div class="supporter">
                    <span class="vca-user-name" v-for="s in taking.supporter">
                      <el-button type="primary" size="mini" @click="userPage(s.uuid)"> {{ s.name }} </el-button>
                    </span>
                </div>
            </td>
            <td v-if="isEployee">
              <router-link class="vca-button-primary vca-full-width" :to="{name: 'takings-edit', params: {id: taking.id}}">
                  {{ $t('takings.buttons.edit') }}
                </router-link>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Tag, CrewPlainName } from 'vca-widget-user'
import CurrencyFormatter from '@/utils/CurrencyFormatter'
import DepositLights from '@/components/takings/DepositLights'
import DepositAdd from '@/components/deposit/DepositAdd'
import { Notification } from 'element-ui'

Vue.use(Notification)
Notification.closeAll()

export default {
  name: "List",
  components: {
    Tag, CrewPlainName, DepositLights, DepositAdd
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
      supporter (donation) {
          return [donation.author].concat(donation.supporter)
              .filter((value, index, self) => self.indexOf(value) === index)
      },
      teaserSupporter (donation) {
          return this.supporter(donation).slice(0, this.maximumTags)
      },
      hasAddtionalSupporter (donation) {
          return this.supporter(donation).length > this.maximumTags
      },
      userPage (uuid) {
        window.location.href = '/arise/#/user/' + uuid
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
    @import '../../assets/less/general.less';

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
