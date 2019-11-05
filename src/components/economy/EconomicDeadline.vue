<template>
    <span>
        <i18n v-if="immediately" path="economic-deadline.prefix" tag="span" for="economic-deadline.date">
            <span class="deadline">{{ $t('economic-deadline.immediately') }}</span>
        </i18n>
        <i18n v-else path="economic-deadline.prefix" tag="span" for="economic-deadline.date">
            <span class="deadline">{{ $t('economic-deadline.date', { "deadline": deadline }) }}</span>
        </i18n>
    </span>
</template>

<script>
    export default {
        name: "EconomicDeadline",
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
