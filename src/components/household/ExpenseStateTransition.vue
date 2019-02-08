<template>
    <div>
        <button
                class="vca-button-primary vca-full-width"
                @click="markAsKnown">
            Ich weiß davon
        </button>
        <button
                class="vca-button-primary vca-full-width"
                @click="markAsUnknown">
            Ich weiß davon nichts
        </button>
        <button
                class="vca-button-primary vca-full-width"
                @click="markAsFreed">
            Freigeben
        </button>
        <button
                class="vca-button-primary vca-full-width"
                @click="markAsBlocked">
            Verwehren
        </button>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: "ExpenseStateTransition",
        props: {
            "expense": {
                "type": Object,
                "required": true
            }
        },
        methods: {
            ...mapActions('household', [
                'isKnown', 'isUnknown', 'free', 'block' // -> this.foo()
            ]),
            markAsKnown() {
                this.isKnown(this.expense)
            },
            markAsUnknown() {
                this.isUnknown(this.expense)
            },
            markAsFreed() {
                this.free(this.expense)
            },
            markAsBlocked() {
                this.block(this.expense)
            }
        }
    }
</script>

<style scoped>

</style>