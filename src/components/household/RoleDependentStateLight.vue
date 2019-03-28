<template>
    <StateLight v-model="light" :small="true" />
</template>

<script>
    import { mapGetters } from 'vuex'
    import StateLight from './StateLight'

    export default {
        name: "RoleDependentStateLight",
        components: { StateLight },
        props: {
            "value": {
                "type": Object,
                "required": true
            }
        },
        computed: {
            ...mapGetters('user', {
                hasRole: 'is'
            }),
            state () {
                var res = this.value.attentionLights.Supporter
                if(this.hasRole(["Employee"])) {
                    res = this.value.attentionLights.Employee
                } else if(this.hasRole(["VolunteerManager"])) {
                    res = this.value.attentionLights.VolunteerManager
                }
                return res
            },
            light () {
                return {
                    "name": this.value.name,
                    "state": this.state
                }
            }
        }
    }
</script>

<style scoped>

</style>