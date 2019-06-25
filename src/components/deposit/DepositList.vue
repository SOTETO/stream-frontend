<template>
  <table class="deposits">
    <thead>
      <tr>
        <th>{{ $t("deposit.table.head.date") }}</th>
        <th>{{ $t("deposit.table.head.crew") }}</th>
        <th>{{ $t("deposit.table.head.amount") }}</th>
        <th>{{ $t("deposit.table.head.donations") }}</th>
        <th>{{ $t("deposit.table.head.supporter") }}</th>
        <th>{{ $t("deposit.table.head.state") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="deposit in depositItems" :key="deposit.id" class="deposit">
        <td>
          <div class="dates">
            <span>{{ $t("deposit.hint.dates.received", { "date":  formatDate(deposit.date.received) }) }}</span>
            <span>{{ $t("deposit.hint.dates.created", { "date":  formatDate(deposit.date.created) }) }}</span>
          </div>
        </td>
        <td class="crew"><Tag :uuid="deposit.supporter[0]" :crew="true" /></td>
        <td>{{ formatAmount(deposit.amount) }}</td>
        <td>
          <ul class="actions">
            <li v-for="unit in deposit.actions" :key="unit.publicId" class="action">
              <span>{{ donation(unit.donationId) }}</span>
              <span>{{ formatAmount({ "amount": unit.amount, "currency": unit.currency }) }}</span>
            </li>
          </ul>
        </td>
        <td>
          <div class="supporter">
            <Tag v-for="uuid in teaserSupporter(deposit)" :uuid="uuid" :key="'sup-' + uuid" />
            <span v-if="hasAddtionalSupporter(deposit)">...</span>
          </div>
        </td>
        <td>
          <button v-if="!confirmed(deposit) && allowedToConfirm" class="vca-button-primary padding" @click="confirm(deposit)">Confirm</button>
          <StateLight v-else-if="!confirmed(deposit) && !allowedToConfirm" :value="{ 'name': $t('deposit.hint.dates.unconfirmed'), 'state': 0 }" />
          <StateLight v-else :value="{ 'name': $t('deposit.hint.dates.confirmed', { 'date':  formatDate(deposit.status) }), 'state': 1  }" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Tag } from 'vca-widget-user'
  import StateLight from '@/components/utils/StateLight'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  export default {
    name: "DepositList",
    components: { Tag, StateLight },
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
              name = this.$t('deposit.errors.donationNotFound')
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

    & .deposit:nth-child(even) {
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