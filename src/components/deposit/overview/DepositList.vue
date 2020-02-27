<template>

  <el-table
    :data="depositItems"
    style="width: 100%"
    @sort-change="sorting()"
    >
    <el-table-column
      prop="date"
      :label='$t("deposits.table.head.date")'
      sortable
      >
      <template slot-scope="scope">
        <div class="dates">
          <span>{{ $t("takings.table.dates.received", { "date":  formatDate(scope.row.date.received) }) }}</span>
          <span>{{ $t("takings.table.dates.created", { "date":  formatDate(scope.row.date.created) }) }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="crew.name"
      sortable
      :label='$t("deposits.table.head.crew")'
      >
      <template slot-scope="scope">
        <span class="vca-crew-name">
          <el-tag> {{ scope.row.crew.name }} </el-tag>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      sortable
      :label='$t("deposits.table.head.amount")'
      >
      <template slot-scope="scope">
        {{ formatAmount(scope.row.amount) }}
      </template>
    </el-table-column>
    <el-table-column
      :label='$t("deposits.table.head.donations")'
      >
      <template slot-scope="scope">
        <ul class="actions">
          <li v-for="unit in scope.row.actions" :key="unit.publicId" class="action">
            <span>{{ unit.description }}</span>
            <span>{{ formatAmount({ "amount": unit.amount.amount, "currency": unit.amount.currency }) }}</span>
          </li>
        </ul>
      </template>
    </el-table-column>
    <el-table-column
      prop="supporter.name"
      sortable
      :label='$t("deposits.table.head.supporter")'
      >
      <template slot-scope="scope">
        <span class="vca-user-name" v-for="s in scope.row.supporter">
          <UserButton :user="s" />
        </span>
      </template>
    </el-table-column>
    <el-table-column
      :label='$t("deposits.table.head.confirmed")'
      >
      <template slot-scope="scope">
        <span v-if="!confirmed(scope.row)"> {{ $t('deposits.table.hint.dates.unconfirmed') }} </span>
        <UserButton v-else :user="scope.row.status.user" />
      </template>
    </el-table-column>
    <el-table-column
      prop="status.date"
      sortable
      :label='$t("deposits.table.head.state")'
      >
      <template slot-scope="scope">
        <button v-if="!confirmed(scope.row) && allowedToConfirm" class="vca-button-primary padding" @click="confirm(scope.row)">{{ $t('deposits.table.hint.confirm') }}</button>
        <StateLight v-else-if="!confirmed(scope.row) && !allowedToConfirm" :value="{ 'name': $t('deposits.table.hint.dates.unconfirmed'), 'state': 0 }" />
        <div v-else>
          <StateLight :value="{ 'name': $t('deposits.table.hint.dates.confirmed', { 'date':  formatDate(scope.row.status.date) }), 'state': 1  }" />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { CrewPlainName, Tag } from 'vca-widget-user'
  import StateLight from '@/components/utils/StateLight'
  import CurrencyFormatter from '@/utils/CurrencyFormatter'
import Money from '@/utils/Money'
  import UserButton from '@/components/utils/UserButton'
  export default {
    name: "DepositList",
    components: { CrewPlainName, Tag, StateLight, UserButton},
    props:["query"],
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

    watch:{
      query: function(newVal, oldVal) {
        console.log(this.query)
        this.init(this.query)
      }
    },
    updated () {
      //this.init(this.query)
    },
    methods: {
      ...mapActions('deposits', [
        'confirm'
      ]),
      sorting(column, event) {
        console.log(JSON.stringify(column))
      },
      formatAmount(amount) {
        var formatter = CurrencyFormatter.getFromNumeric(amount.currency, amount.amount)
        return Money.getString(amount.amount, amount.currency)
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
  .deposits {
    width: 100%;
    & th {
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
