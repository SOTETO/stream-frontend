<template>
    <VcAFrame>
        <VcAColumn size="70%">
            <VcABox :first="true" :title="$t('donation.header.box.list')">
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
            <VcABox :first="true" :title="$t('donation.header.box.list-methods')">
                <router-link class="vca-button-primary vca-full-width" to="/donations/add">{{ $t('donation.buttons.add') }}</router-link>
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import List from '@/components/donations/List'
    import ListMenu from '../components/utils/ListMenu'
    import { mapGetters, mapActions } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'

    export default {
        name: "donations",
        components: {
            VcAFrame, VcAColumn, VcABox, List, ListMenu
        },
        computed: {
            ...mapGetters('donations', {
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
                        "value": "donation.description",
                        "label": this.$t("donation.header.table.title")
                    },
                    {
                        "value": "donation.created",
                        "label": this.$t("donation.header.table.date")
                    }
                ]
            }
        },
        methods: {
            ...mapActions('donations', [
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