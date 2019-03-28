<template>
    <span class="light" :class="classes">
        {{ value.name }}
    </span>
</template>

<script>
    export default {
        name: "StateLight",
        props: {
            "value": {
                "type": Object,
                "required": true
            },
            "color-disabled-on-no-error": {
                "type": Boolean,
                "default": false
            },
            "small": {
                "type": Boolean,
                "default": false
            }
        },
        computed: {
            color () {
                var res = "nothing"
                switch (this.value.state) {
                    case 0:
                        res = "red"
                        break
                    case 1:
                        if(!this.colorDisabledOnNoError) {
                            res = "green"
                        }
                        break
                    case 2:
                        res = "yellow"
                        break
                }
                return res
            },
            classSmall () {
                var res = ""
                if(this.small && (!this.colorDisabledOnNoError || this.value.state !== 1 )) {
                    res = "small"
                }
                return res
            },
            classes () {
                return this.color + " " + this.classSmall
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../assets/less/general";

    .light:not(.nothing) {
        padding: 0.2em 0.5em;
        border-radius: @radius;
        display: inline-block;
        text-align: center;

        &.small {
            font-size: 0.8em;
        }
    }

    .green {
        background-color: #3bc846;
    }

    .yellow {
        background-color: #ffc100;
    }

    .red {
        background-color: rgba(213, 0, 0, 1);
        color: #colors[secundary];
    }

</style>a