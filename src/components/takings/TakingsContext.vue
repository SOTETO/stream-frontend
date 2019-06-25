<template>
    <div class="context-form">
        <el-form-item :label="$t('takings.placeholder.context.label')" :required="true">
            <el-input :placeholder="$t('takings.placeholder.context.indicator')" v-model="description" @change="commit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('takings.placeholder.category')" :required="true" class="vca-categories">
            <table class="categoryChooser">
                <td v-for="(group, i) in categories" class="vca-group" :key="i">
                  <tr v-for="cat in group"  :key="cat">
                    <td>
                      <el-radio
                                v-model="category"
                                :label="cat"
                                @change="commit"
                        >
                            {{ $t("takings.placeholder.categories." + cat) }}
                      </el-radio>
                    </td>
                    <td>
                      <el-input :placeholder="$t('takings.placeholder.categories.description')" id="info" clearable size="small"></el-input>
                    </td>
                  </tr>
                </td>
            </table>
        </el-form-item>
    </div>
</template>

<script>
    import { Input, FormItem, Radio } from 'element-ui'

    export default {
        name: "TakingsContext",
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
            var description = "";
            var category = "";
            var info = "";
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
                    ["selling", "service", "other"]
                ],
                "info": info
            }
        },
        methods: {
            commit () {
                this.$emit("input", {
                    "description": this.description,
                    "category": this.category,
                    "info": this.info,
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