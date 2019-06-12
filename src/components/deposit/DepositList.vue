<template>
  <table>
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
      <tr v-for="deposit in deposits" :key="deposit.id">
        <td>
          <div class="dates">
            <span>{{ $t("deposit.hints.dates.received", { "date":  formatDate(deposit.date.received) }) }}</span>
            <span>{{ $t("deposit.hints.dates.created", { "date":  formatDate(deposit.date.created) }) }}</span>
          </div>
        </td>
        <td><Tag :uuid="deposit.author" :crew="true" /></td>
        <td>{{ formatAmount(deposit.amount) }}</td>
        <td>{{ deposit.actions }} </td>
        <td>
          <div class="supporter">
            <Tag :uuid="donation.author" :key="donation.author" />
            <Tag v-for="uuid in donation.supporter" :uuid="uuid" :key="uuid" />
          </div>
        </td>
        <td> {{ deposit.status }} </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
  export default {
    name: "depositList",
    computed: {
      ...mapGetters('deposits', {
        deposits: 'overview',
        isError: 'isError',
        getErrorCode: 'getErrorCode'
      })
    },
    methods: {
      ...mapActions('donations', [
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
