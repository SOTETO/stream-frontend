<template>
    <div class="context-form">
        <el-form-item :label="$t('donation.placeholder.context.label')" :required="true">
            <el-input :placeholder="$t('donation.placeholder.context.indicator')" v-model="context.description" @change="commit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('donation.placeholder.category')" :required="true" class="vca-categories">
            <table class="categoryChooser">
                <tr v-for="(group, i) in categories" class="vca-group" :key="i">
                    <td v-for="cat in group"  :key="cat">
                        <el-radio
                                v-model="context.category"
                                :label="cat"
                        >
                            {{ $t("donation.placeholder.categories." + cat) }}
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
        name: "TakingContext",
        props: {
           context: {
             type: Object,
             default: function () {
               return {
                  "description": "",
                  "category": ""
               }
             }
           }
        },
        components: {
            "el-input": Input,
            "el-radio": Radio,
            "el-form-item": FormItem
        },
        data () {
            if(typeof this.value !== "undefined" && this.value !== null) {
                if(this.value.hasOwnProperty("description")) {
                    description = this.value.description
                }
                if(this.value.hasOwnProperty("category")) {
                    category = this.value.category
                }
            }
            return {
                "categories": [
                    ["concert", "run4wash", "streetFestivals"],
                    ["festival", "school", "karaoke"],
                    ["stadium", "party", "kicker"]
                ]
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
