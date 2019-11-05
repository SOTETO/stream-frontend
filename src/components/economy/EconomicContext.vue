<template>
    <div class="context-form">
        <el-form-item :label="$t('economic-context.description.label')" :required="true">
            <el-input :placeholder="$t('economic-context.description.indicator')" v-model="description" @change="commit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('economic-context.category.label')" :required="true" class="vca-categories">
            <table class="categoryChooser">
                <tr v-for="(group, i) in categories" class="vca-group" :key="i">
                    <td v-for="cat in group"  :key="cat">
                        <el-radio
                                v-model="category"
                                :label="cat"
                                @change="commit"
                        >
                            {{ $t("economic-context.category.categories." + cat) }}
                        </el-radio>
                    </td>
                </tr>
            </table>
        </el-form-item>
    </div>
</template>

<script>
    import { Input, FormItem, Radio } from 'element-ui'

    export default {
        name: "EconomicContext",
        props: {
           "value": {
             "type": Object
           }
        },
        components: {
            "el-input": Input,
            "el-radio": Radio,
            "el-form-item": FormItem
        },
        data () {
            var description = ""
            var category = ""
            if(typeof this.value !== "undefined" && this.value !== null) {
                if(this.value.hasOwnProperty("description")) {
                    description = this.value.description
                }
                if(this.value.hasOwnProperty("category")) {
                    category = this.value.category
                }
            }
            return {
                "description": description,
                "category": category,
                "categories": [
                    ["selling", "service", "other"],
                  ]
            }
        },
        methods: {
            commit () {
                this.$emit("input", {
                    "description": this.description,
                    "category": this.category
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .categoryChooser {
        width: 100%;
        line-height: 1em;
    }
</style>
