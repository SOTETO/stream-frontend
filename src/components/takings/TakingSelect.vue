<template>
    <el-form-item
            class="vca-form">
        <el-select
                v-model="donations.selected"
                multiple
                filterable
                remote
                reserve-keyword
                :placeholder="$t('takings.placeholder.searchDonation')"
                :remote-method="callOptions"
                :loading="donations.loading"
                @input="commit"
                @remove-tag="remove">
            <el-option
                    v-for="item in donations.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </el-form-item>
</template>

<script>
    import { FormItem, Select } from 'element-ui'
    import DonationEndpoints from '@/backend-endpoints/DonationEndpoints'

    export default {
        name: "DonationSelect",
        components: {
            "el-form-item": FormItem,
            "el-select": Select
        },
        data () {
            return {
                "donations": {
                    "selected": [],
                    "options": [],
                    "loading": false,
                    "error": null
                }
            }
        },
        methods: {
            callOptions (query) {
                if (query !== '') {
                    this.donations.loading = true;
                    var endpoint = new DonationEndpoints()
                    endpoint.getByQuery(
                        (donations) => {
                            this.donations.loading = false
                            this.donations.options = donations.data.data.map(donation => {
                                return {
                                    "value": donation.id,
                                    "label": donation.context.description
                                }
                            })
                        },
                        (error) => {
                            this.donations.loading = false
                            this.donations.error = error
                        },
                        query
                    )
                } else {
                    this.donations.options = [];
                }
            },
            commit (selectedOption) {
                var donation = this.donations.options.find(d => d.value === selectedOption[selectedOption.length - 1])
                if(typeof donation !== "undefined") {
                    this.$emit('vca-select-donation', donation)
                }
            },
            remove (removedOption) {
                this.$emit('vca-deselect-donation', removedOption)
            }
        }
    }
</script>

<style scoped>

</style>
