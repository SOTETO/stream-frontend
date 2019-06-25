<template>
    <span>
        <i18n v-if="immediately" path="takings.hints.deadline.prefix" tag="span" for="takings.hints.deadline.date">
            <span class="deadline">{{ $t('takings.hints.deadline.immediately') }}</span>
        </i18n>
        <i18n v-else path="takings.hints.deadline.prefix" tag="span" for="takings.hints.deadline.date">
            <span class="deadline">{{ $t('takings.hints.deadline.date', { "deadline": deadline }) }}</span>
        </i18n>
    </span>
</template>

<script>
    export default {
        name: "TakingsDeadline",
        props: {
            "received": {
                "type": Number,
                "required": true
            }
        },
        computed: {
            deadline () {
                var deadline = this.calculator()
                return this.$d(deadline.date, 'short')
            },
            immediately () {
                var deadline = this.calculator()
                return deadline.immediately
            }
        },
        methods: {
            calculator() {
                var deadline = new Date(this.received)
                deadline.setDate(deadline.getDate() + 28)
                var result = {
                    "date": deadline,
                    "immediately": false
                }
                if(deadline <= Date.now()) {
                    result.immediately = true
                }
                return result
            }
        }
    }
</script>

<style scoped>
    .deadline {
        font-weight: bold;
    }
</style>