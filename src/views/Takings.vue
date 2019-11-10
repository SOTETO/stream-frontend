<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('takings.head.table')">
                <ListMenu :fields="sortFields" store="takings" />
                <button v-if="hasPrevious" v-on:click="pageDown()" class="paginate">
                    {{ $tc('pagination.previous', pageGet.previous, { 'number': pageGet.previous }) }}
                </button>
                <List />
                <button v-if="hasNext" v-on:click="pageUp()" class="paginate">
                    {{ $tc('pagination.next', pageGet.next, { 'number': pageGet.next }) }}
                </button>
            </VcABox>
        </VcAColumn>
        <VcAColumn size="20%">
            <VcABox :first="true" :title="$t('takings.head.add')">
                <router-link class="vca-button-primary vca-full-width" to="/takings/add">
                  {{ $t('takings.buttons.donation') }}
                </router-link>
                <router-link class="vca-button-primary vca-full-width" to="/economic/add">
                  {{ $t('takings.buttons.economic') }}
                </router-link>
            </VcABox>
            <VcABox :title="$t('takings.head.deposit')">
              <TakingDeposit takings="takings" ></TakingDeposit>
            </VcAbox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import List from '@/components/takings/List'
    import ListMenu from '../components/utils/ListMenu'
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'
    import TakingDeposit from '@/components/takings/TakingDeposit' 
    export default {
        name: "takings",
        components: {
            VcAFrame, VcAColumn, VcABox, List, ListMenu, TakingDeposit
        },
        computed: {
            ...mapGetters('takings', {
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
                        "value": "taking.description",
                        "label": this.$t("taking.header.table.title")
                    },
                    {
                        "value": "taking.created",
                        "label": this.$t("taking.header.table.date")
                    }
                ]
            }
        },
        methods: {
            ...mapActions('takings', [
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
