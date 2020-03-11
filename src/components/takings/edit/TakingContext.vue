<template>
    <div class="context-form">
      <el-form :rules="rules" :model="context">
        <el-form-item :label="$t('donation.placeholder.context.label')" prop="description">
            <el-input :placeholder="$t('donation.placeholder.context.indicator')"  v-model="context.description"></el-input>
        </el-form-item>
        <el-form-item :label="$t('donation.placeholder.category')" class="vca-categories" prop="category">
          <el-checkbox-group v-model="dataForm.category">
            <table class="categoryChooser">
                <tr v-for="(group, i) in categories" class="vca-group" :key="i">
                    <td v-for="cat in group" :key="cat">
                        <el-checkbox @change="createCategoryString" :label="cat">{{ $t("donation.placeholder.categories." + cat) }}</el-checkbox>
                    </td>
                </tr>
            </table>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
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
        watch: {
            context: function(context, oldContext) {
                this.dataForm.description = context.description
                this.dataForm.category = (context.category !== "") ? context.category.split(",") : [];
            }
        },
        components: {
            "el-input": Input,
            "el-radio": Radio,
            "el-form-item": FormItem
        },
        data () {
            return {
                "categories": [
                    ["concert", "run4wash", "streetFestivals"],
                    ["festival", "school", "karaoke"],
                    ["stadium", "party", "kicker"],
                    ["other"]
                ],

                dataForm: {
                  description: "",
                  category: [],
                },

                rules: {
                  description: [
                    { required: true, message: this.$t('takings.validations.description'), trigger:'blur' }
                  ],
                  category: [
                    { required: true, message: this.$t('takings.validations.category'), trigger:'change' }
                  ],
              },
            }
        },
        methods: {
            createCategoryString() {
                this.context.category = this.dataForm.category.join(",")
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
