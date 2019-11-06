<template>
  <VcAFrame>
    <VcAColumn size="90%">
      <VcABox :first="true"  :title="$t('deposit.header.box')">
        <ListMenu :fields="sortFields" store="deposits" />
        <button v-if="hasPrevious" v-on:click="pageDown()" class="paginate">
          {{ $tc('pagination.previous', pageGet.previous, { 'number': pageGet.previous }) }}
        </button>
        <DepositList/>
        <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
          {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
        </button>
      </VcABox>
    </VcAColumn>
  </VcAFrame>
</template>

<script>
  import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
  import DepositList from '@/components/deposit/DepositList'
  import ListMenu from '../components/utils/ListMenu'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: "deposits",
    components: {
      VcAFrame, VcAColumn, VcABox, DepositList, ListMenu
    },
    computed: {
        ...mapGetters('deposits', {
            pageGet: 'page'
        }),
        hasPrevious () {
            return this.pageGet.previous > 0
        },
        hasNext () {
            return this.pageGet.next > 0
        },
        sortFields() {
            return [
                {
                    "value": "deposit.created",
                    "label": this.$t("deposit.table.head.created")
                },
                {
                    "value": "deposit.date_of_deposit",
                    "label": this.$t("deposit.table.head.date")
                },
                {
                    "value": "deposit.full_amount",
                    "label": this.$t("deposit.table.head.amount")
                },
                {
                    "value": "deposit.confirmed",
                    "label": this.$t("deposit.table.head.state")
                },
                {
                    "value": "deposit.crew",
                    "label": this.$t("deposit.table.head.crew")
                }
            ]
        }
    },
    methods: {
        ...mapActions('deposits', [
            'page'
        ]),
        pageDown () {
            this.page(true)
        },
        pageUp () {
            this.page(false)
        }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/less/general.less';

  .paginate {
    width: 100%;
    height: 2.5em;
    .inputElement();
    cursor: pointer;
    background: none;
  }
</style>
