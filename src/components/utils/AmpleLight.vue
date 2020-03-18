<template>
    <div class="light" :class="color"></div>
</template>

<script>
    export default {
        name: "AmpleLight",
        props: {
            "color": {
                "type": String,
                "required": true,
                "validator": function (value) {
                    // The value must match one of these strings
                    return ["green", "yellow", "red"].indexOf(value) !== -1
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../../assets/less/general.less';

.light {
    display: inline-block;
    margin: 0 0.25em;
    width: 1em;
    height: 1em;
    border-radius: 0.2em;

    &.green {
        background-color: #3bc846;
    }

    &.yellow {
        background-color: #ffc100;
    }

    &.red {
        background-color: rgba(213, 0, 0, 1);
        color: #colors[secundary];
    }
}
</style>