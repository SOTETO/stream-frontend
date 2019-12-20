<template>
    <tr class="source">
        <td>
            <div class="category">
                  <span> {{$t("donation.placeholder.source." + source.category) }}</span>
                <el-form-item class="category-description">
                    <el-input v-model="source.description" :placeholder="$t('donation.placeholder.source.description')"></el-input>
                </el-form-item>
            </div>
        </td>
        <td>
            <MoneyInput
                    v-model="source.amount"
                    v-bind:amount="source.amount"
                    @vca-money-validationError="invalid"
            />
        </td>
        <td>
            <el-form-item>
                <el-radio v-model="source.typeOfSource.category" label="cash">&nbsp;</el-radio>
            </el-form-item>
        </td>
        <td>
            <el-form-item>
                <el-radio v-model="source.typeOfSource.category" label="extern" >&nbsp;</el-radio>
            </el-form-item>
        </td>
        <td>
          <el-button type="danger" icon="el-icon-delete" :disabled="disableDelete" @click="deleteSource"></el-button>
        </td>
    </tr>
</template>

<script>
    import CurrencyFormatter from '@/utils/CurrencyFormatter'
    import MoneyInput from '@/components/takings/edit/MoneyInput'

    // Todo: Should use new component utils.MoneyInput!
    export default {
        name: "TakingSource",
        components: {
            "MoneyInput": MoneyInput
        },
        props: {
          disableDelete:{
            type: Boolean,
            default: false
          },
          source: {
            type: Object,
            default: function () {
              return {
                "amount": {
                  "amount": 0,
                  "currency": "EUR"
                },
                "category": "",
                "description": "",
                "typeOfSource": {
                  "category": ""
                }
              }
            }
          },
        },
        data () {
            var formatter = CurrencyFormatter.getDefault(this.source.amount.currency)
            return {
                "checkedVar": false,
                "amount": {
                    "formatted": formatter.localize(),
                    "amount": formatter.getNumeric()
                },
                "typeVar": "cash",
                "descriptionTextVar": "",
                "amountErrorState": false
            }
        },
        created: function () {
            var formatter = CurrencyFormatter.getFromNumeric(this.source.amount.currency, this.numeric)
            this.amount.formatted = formatter.localize()
            this.amount.amount = formatter.getNumeric()
            this.checkedVar = this.checked
            this.typeVar = this.type
            this.descriptionTextVar = this.descriptionText
        },
        methods: {
            commit() {
                if(this.checkedVar && !this.amountErrorState) {
                    var result = {
                        "category": this.category,
                        "amount": this.source.amount.amount,
                        "currency": this.source.amount.currency,
                        "type": this.typeVar
                    }
                    if(this.descriptionText) {
                        result["description"] = this.descriptionTextVar
                    }
                    this.$emit('input', result)
                } else if(!this.checkedVar && !this.amountErrorState) {
                    this.deselect()
                }
            },
            deleteSource() {
                this.$emit('delete')
            },
            deselect() {
                this.$emit('deselect', this.category)
            },
            valid () {
                this.amountErrorState = false
                this.checkedVar = true
                this.commit()
            },
            invalid () {
                this.amountErrorState = true
                this.checkedVar = false
                this.commit()
            }
        }
    }
</script>

<style scoped lang="less">

    .category-description {
        width: 65%;
    }
    .category {
        display: flex;
        flex-direction: row;

        & > :first-child {
            margin-right: 1em;
        }
    }
    .category span {
        margin-top: 9px;
        width: 30%;
    }
</style>
