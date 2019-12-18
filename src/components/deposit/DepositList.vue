<template>
  <table class="deposits">
    <thead>
      <tr>
        <th>{{ $t("deposits.table.head.date") }}</th>
        <th>{{ $t("deposits.table.head.crew") }}</th>
        <th>{{ $t("deposits.table.head.amount") }}</th>
        <th>{{ $t("deposits.table.head.donations") }}</th>
        <th>{{ $t("deposits.table.head.supporter") }}</th>
        <th>{{ $t("deposits.table.head.confirmed") }}</th>
        <th>{{ $t("deposits.table.head.state") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="deposit in depositItems" :key="deposit.id" class="deposit">
        <td>
          <div class="dates">
            <span>{{ $t("deposits.table.hint.dates.received", { "date":  formatDate(deposit.date.received) }) }}</span>
            <span>{{ $t("deposits.table.hint.dates.created", { "date":  formatDate(deposit.date.created) }) }}</span>
          </div>
        </td>
        <td class="crew">
            <span class="vca-crew-name">
                <el-tag> {{ deposit.crew.name }} </el-tag>
            </span>
        <td>{{ formatAmount(deposit.amount) }}</td>
        <td>
          <ul class="actions">
            <li v-for="unit in deposit.actions" :key="unit.publicId" class="action">
              <span>{{ unit.description }}</span>
              <span>{{ formatAmount({ "amount": unit.amount.amount, "currency": unit.amount.currency }) }}</span>
            </li>
          </ul>
        </td>
        <td>
          <div class="supporter">
                <div class="supporter">
                    <span class="vca-user-name" v-for="s in deposit.supporter">
                      <UserButton :user="s" />
                    </span>
                </div>
          </div>
        </td>
        <td>
          <span v-if="!confirmed(deposit)"> {{ $t('deposits.table.hint.dates.unconfirmed') }} </span>
          <UserButton v-else :user="deposit.status.user" />
        </td>
        <td>
          <button v-if="!confirmed(deposit) && allowedToConfirm" class="vca-button-primary padding" @click="confirm(deposit)">{{ $t('deposits.table.hint.confirm') }}</button>
          <StateLight v-else-if="!confirmed(deposit) && !allowedToConfirm" :value="{ 'name': $t('deposits.table.hint.dates.unconfirmed'), 'state': 0 }" />
          <div v-else>
            <StateLight :value="{ 'name': $t('deposits.table.hint.dates.confirmed', { 'date':  formatDate(deposit.status.date) }), 'state': 1  }" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { CrewPlainName, Tag } from 'vca-widget-user'
  import StateLight from '@/components/utils/StateLight'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  import UserButton from '@/components/utils/UserButton'
  export default {
    name: "DepositList",
    components: { CrewPlainName, Tag, StateLight, UserButton},
    computed: {
      ...mapGetters('deposits', {
        depositItems: 'overview',
        donationName: 'donationName',
        isError: 'isError',
        getErrorCode: 'getErrorCode'
      }),
      ...mapGetters('user', {
          isEmployee: 'isEmployee',
          isAdmin: 'isAdmin'
      }),
      maximumTags () {
          return 2;
      },
      allowedToConfirm () {
        return this.isEmployee || this.isAdmin
      }
    },
    data () {
      return {
          "donations": []
      }
    },
    created () {
      this.init(this.$store)
    },
    methods: {
      ...mapActions('deposits', [
        'init', // map `this.init()` to `this.$store.dispatch('deposits/init')`
        'confirm'
      ]),
      formatAmount(amount) {
        var formatter = CurrencyFormatter.getFromNumeric(amount.currency, amount.amount)
        return formatter.localize()
      },
      formatDate(date) {
        var d = new Date(date)
        return this.$d(d, 'short')
      },
        supporter (deposit) {
            return deposit.supporter
                .filter((value, index, self) => self.indexOf(value) === index)
        },
        teaserSupporter (deposit) {
            return this.supporter(deposit).slice(0, Math.min(this.maximumTags, deposit.supporter.length))
        },
        hasAddtionalSupporter (deposit) {
            return this.supporter(deposit).length > this.maximumTags
        },
        donation (donationId) {
          var name = this.donationName(donationId)
          if(name === null) {
              name = this.$t('deposits.errors.takingsNotFound')
          }
          return name
        },
        confirmed(deposit) {
          return deposit.status !== "unconfirmed"
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

  .deposits {
    width: 100%;
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

  .deposit {
    & tr {
      padding: 0.5em 0.5em 0 0.15em;
    }
    & td {
      padding: 0.5em 0.5em 0.5em 0.5em;
      vertical-align: top;
    }
  }

  .actions {
    list-style: none;
    padding: 0.2em;
    font-size: 0.8em;
    max-width: 15em;
    .action {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .dates {
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

  .padding {
    padding-left: 1em;
    padding-right: 1em;
  }
</style>
