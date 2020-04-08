<template>
    <el-autocomplete
        class="inline-input"
        v-model="state2"
        :fetch-suggestions="querySearch"
        placeholder="Please Input"
        :trigger-on-focus="false"
        @select="handleSelect"
        >
    </el-autocomplete>
</template>
<script>

import axios from 'axios'
export default {
    name: 'CrewSelect',

    data() {
        return {
            links: [],
            state1: '',
            state2: '',
            requestQuery: {
                query: "crew.name.1.LIKE",
                values: {
                    crew: {
                        name: {
                            1: "%"
                        }
                    }
                },
                sort: {
                    dir: "DESC",
                    attributes: [
                        "Crew_id"
                    ]
                },
                offset: 0,
                limit: 5,
            }
        }
    },
    methods: {
        querySearch(queryString, cb) {
            this.links = []
            this.requestQuery.values.crew.name = { 1: queryString + "%"}
            axios.post(
                '/drops/webapp/crew/list', 
                this.requestQuery, 
                { 'headers': 
                    { 
                        'Content-Type': 'application/json' 
                    },
                }
            )
                .then((response) => {
                    var result = response.data.additional_information.forEach(
                        crew => this.links.push({"value": crew.name, "id": crew.id})
                    )
                    cb(this.links)
                })
        },
        createFilter(queryString) {
            return (link) => {
                return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            this.$emit("crew", {"uuid": item.id, "name": item.value})
        }
    }
}
</script>
<style lang="less" scoped>

</style>
