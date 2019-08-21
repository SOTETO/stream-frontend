<template>
    <div class="listMenu">
        <v-select v-bind:value="field" @input="commit" :options="fields" :clearable="false"></v-select>
        <button v-bind:value="dir" @click="commitDir" :title="$t('household.buttons.sorting.' + dir)">
            <img svg-inline v-if="isASC" src="../../assets/images/sort-alpha-down.svg" />
            <img svg-inline v-if="isDESC" src="../../assets/images/sort-alpha-up.svg" />
        </button>
    </div>
</template>

<script>
    // import { mapGetters, mapActions } from 'vuex'
    import vSelect from 'vue-select'

    export default {
        name: "ListMenu",
        components: { vSelect },
        props: {
            "fields": {
                "type": Array,
                "required": true
            },
            "store": {
                "type": String,
                "required": true
            }
        },
        data () {
            return {
                "field": null,
                "dir": "ASC"
            }
        },
        computed: {
            sort () {
                return this.$store.getters[this.store + "/sort"]
            },
            isASC () {
                return this.sort.dir === "ASC"
            },
            isDESC () {
                return this.sort.dir === "DESC"
            }
        },
        created () {
            this.field = this.fields.find(f => f.value === this.sort.field)
            this.dir = this.sort.dir
        },
        methods: {
            sortAction (sorting) {
                this.$store.dispatch(this.store + '/sort', sorting)
            },
            commit: function (event) {
                this.field = event
                var sorting = {
                    "field": this.field.value,
                    "dir": this.dir
                }
                this.sortAction(sorting)
            },
            commitDir: function (event) {
                if (event.target.value === "ASC") {
                    this.dir = "DESC"
                } else {
                    this.dir = "ASC"
                }
                var sorting = {
                    "field": this.field.value,
                    "dir": this.dir
                }
                this.sortAction(sorting)
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/less/general";

    .listMenu {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: stretch;
        margin-bottom: 1em;

        .v-select {
            min-width: 13em;
            /*<!--@media @phone-down {-->*/
                /*<!--flex-grow: 1;-->*/
            /*<!--}-->*/
        }

        & button {
            .svgButton()
        }
    }

</style>