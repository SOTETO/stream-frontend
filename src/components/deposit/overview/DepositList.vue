<template>

  <el-table
    :data="depositItems"
    style="width: 100%"
    @sort-change="updateSort"
    >
    <el-table-column
      prop="date"
      :label='$t("deposits.table.head.date")'
      sortable="custom"

      @sort-change="sorting($event)"
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
      sortable="custom"
      :label='$t("deposits.table.head.crew")'
      >
      <template slot-scope="scope">
        <span class="vca-crew-name" v-for="crew in scope.row.crew" :key="crew.uuid">
          <el-tag> {{ crew.name }} </el-tag>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="amount"
      sortable="custom"
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
            <span class="action-description">{{ unit.description }}</span>
            <span>{{ formatAmount({ "amount": unit.amount.amount, "currency": unit.amount.currency }) }}</span>
          </li>
        </ul>
      </template>
    </el-table-column>
    <el-table-column
      prop="supporter.name"
      sortable="custom"
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
      :label='$t("deposits.table.head.state")'
      >
      <template slot-scope="scope">
        <button v-if="!confirmed(scope.row) && allowedToConfirm" class="vca-button-primary padding" @click="confirmAndRefresh(scope.row)">{{ $t('deposits.table.hint.confirm') }}</button>
        <StateLight v-else-if="!confirmed(scope.row) && !allowedToConfirm" :value="{ 'name': $t('deposits.table.hint.dates.unconfirmed'), 'state': 0 }" />
        <div v-else>
          <StateLight :value="{ 'name': $t('deposits.table.hint.dates.confirmed', { 'date':  formatDate(scope.row.status.date) }), 'state': 1  }" />
        </div>
      </template>
    </el-table-column>
    <template slot="append">
      <div>
        <el-button class="load" type="info" plain @click="updatePage">{{ loadButton }}</el-button>
      </div>
    </template>
  </el-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StateLight from '@/components/utils/StateLight'
import Money from '@/utils/Money'
import UserButton from '@/components/utils/UserButton'
export default {
  name: "DepositList",
  components: { StateLight, UserButton },
  computed: {
    ...mapGetters('deposits', {
      depositItems: 'overview',
      donationName: 'donationName',
      count: 'count',
      isError: 'isError',
      getErrorCode: 'getErrorCode'
    }),

    ...mapGetters('user', {
        isEmployee: 'isEmployee',
        isAdmin: 'isAdmin'
    }),
    allowedToConfirm () {
      return this.isEmployee || this.isAdmin
    },
    loadButton () {
      if (this.count > this.page.offset) {
        return this.$t('deposits.table.load.more')
      } else { 
        return this.$t('deposits.table.load.finish')
      }
    }
  },
  data () {
    return {
      sort: {
        sortby: null,
        sortdir: null,
      },  
      page: {
        size: 20,
        offset: 0
      }
    }
  },
  methods: {
    ...mapActions('deposits', [
        'confirm'
    ]),
    formatAmount(amount) {
      return Money.getString(amount.amount, amount.currency)
    },
    formatDate(date) {
      var d = new Date(date)
      return this.$d(d, 'short')
    },
    confirmAndRefresh(value) {
      this.confirm(value)
      this.$emit("refresh")
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
      updatePage () {
        this.page.offset= this.page.offset + this.page.size
        this.$emit("update-page", this.page)
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
    updateSort (value) {
      if (value.order === 'descending') {
        this.sort.sortdir= 'DESC'
      } else {
        this.sort.sortdir = 'ASC'
      }

      if (value.prop === 'date' ) {
        this.sort.sortby = 'deposit.created'
      }
      if (value.prop === 'crew.name') {
        this.sort.sortby = 'deposit.crew'
      }
      if (value.prop === 'amount') {
        this.sort.sortby = 'deposit.full_amount'
      }
      if (value.prop === 'supporter.name') {
        this.sort.sortby = 'deposit.supporter'
      }
      
      this.$emit('update-sort', this.sort)
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
    width: 100%;
    .action {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .actions .action-description {
    width: 60%;
    word-break: normal;
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
  .load {
    width: 100%
  }
</style>
