<template>
    <VcAFrame>
        <VcAColumn>
            <VcABox :first="true" size="90%" title="Donations">
                <ul class="donations">
                    <li v-for="donation in donations">
                        {{ donation.comment }}
                    </li>
                </ul>
            </VcABox>
        </VcAColumn>
        <VcAColumn>
            <VcABox :first="true" title="Edit">
                <router-link class="vca-button-primary vca-full-width" to="/donations/add">Spende hinzufügen</router-link>
            </VcABox>
        </VcAColumn>
    </VcAFrame>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'
    import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
    import 'vca-widget-base/dist/vca-widget-base.css'

    export default {
        name: "donations",
        components: {
            VcAFrame, VcAColumn, VcABox
        },
        computed: {
            // ...mapState({
            //     checkoutStatus: state => state.cart.checkoutStatus
            // }),
            // ...mapGetters({
            //     donations: 'all'
            // })
            donations () {
                return this.$store.state.donations.items
            }
        },

    }
</script>

<style scoped>

</style>