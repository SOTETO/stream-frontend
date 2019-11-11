<template>
    <div class="tag">
        <div class="content">
            <span class="field">{{ $t('household.filter.tag.' + field) }}</span>
            <span class="value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HouseholdFilterTag",
        props: {
            "field": {
                "type": String,
                "required": true
            },
            "value": {
                "type": String,
                "required": false
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../../assets/less/general.less';

    .tag {
        margin: 0.2em;
        padding: 0.2em 0.8em;
        /*min-width: 5em;*/
        display: flex;
        flex-direction: row;
        align-items: center;

        border-radius: @radius;
        background-color: #colors[primaryDeactivated];
        color: #colors[secundary];

        .content {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: stretch;
            flex-grow: 1;
        }

        .field {
            font-size: 0.7em;
        }

        .value {
            flex-grow: 1;
            font-size: 1em;
            font-weight: bold;
        }

        &:hover {
            box-shadow: #shadow[primary];
            background-color: #colors[primary];
            /*padding: 0.3em 0.3em 0.3em 0.8em;*/
        }
    }

</style>