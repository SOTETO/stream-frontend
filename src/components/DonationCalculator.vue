<template>
    <div class="collector">
        <el-form-item
            class="vca-form"
            :label="$t('donation.placeholder.received')">
            <el-date-picker
                v-model="received"
                type="date"
                :placeholder="$t('donation.placeholder.received')"
                :picker-options="datePickerOptions">
            </el-date-picker>
        </el-form-item>
        <table class="sources">
            <thead>
                <tr>
                    <th>{{ $t('donation.header.donationSource.sourceSelect') }}</th>
                    <th>{{ $t('donation.header.donationSource.sum') }}</th>
                    <th>{{ $t('donation.header.donationSource.sourceType.cash') }}</th>
                    <th>{{ $t('donation.header.donationSource.sourceType.extern') }}</th>
                </tr>
            </thead>
            <tbody>
                <DonationSource v-for="category in sources" :category="category" :key="category" />
            </tbody>
        </table>
    </div>
</template>

<script>
    import { DatePicker, FormItem } from 'element-ui'
    import DonationSource from '@/components/DonationSource.vue'

    export default {
        name: "DonationCalculator",
        components: {
            "el-date-picker": DatePicker,
            "el-form-item": FormItem,
            "DonationSource": DonationSource
        },
        data () {
            return {
                "datePickerOptions": {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                "sources": [
                    "can", "box", "gl"
                ],
                "received": new Date()
            }
        }
    }
</script>

<style scoped lang="less">
    .vca-form .el-input {
        width: 100%;
    }

    .sources {
        width: 100%;
        & /deep/ th:not(:first-child), & /deep/ td:not(:first-child) {
            padding-left: 1em;
        }
    }

</style>