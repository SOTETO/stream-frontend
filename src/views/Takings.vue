<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('takings.header.box.list')">
                <ListMenu :fields="sortFields" store="donations" />
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
            <VcABox :first="true" :title="$t('takings.header.box.list-methods')">
                <router-link class="vca-button-primary vca-full-width" to="/takings/add">{{ $t('takings.buttons.add') }}</router-link>
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import List from '@/components/takings/List'
    import ListMenu from '../components/utils/ListMenu'
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'

    export default {
        name: "takings",
        components: {
          VcAFrame,
          VcAColumn,
          VcABox,
          List,
          ListMenu
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
                        "value": "takings.description",
                        "label": this.$t("takings.header.table.title")
                    },
                    {
                        "value": "takings.created",
                        "label": this.$t("takings.header.table.date")
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