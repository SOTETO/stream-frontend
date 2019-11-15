<template>
    <div ref="collapse" class="vca-collapse collapsed">
        <div class="state">
            <span>{{ $t('household.filter.title') }}</span>
            <div class="status-bar">
                <slot name="status"></slot>
            </div>
            <button @click="collapse">{{ buttonLabel }}</button>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Collapse",
        props: {
            "label": {
                "type": String,
                "required": true
            }
        },
        data () {
            return {
                "buttonLabel": this.$t("collapse.button.show")
            }
        },
        methods: {
            collapse() {
                if(this.$refs.collapse.classList.contains("collapsed")) {
                    this.$refs.collapse.classList.remove("collapsed")
                    this.$refs.collapse.classList.add("non-collapsed")
                    this.buttonLabel = this.$t("collapse.button.hide")
                } else if(this.$refs.collapse.classList.contains("non-collapsed")) {
                    this.$refs.collapse.classList.remove("non-collapsed")
                    this.$refs.collapse.classList.add("collapsed")
                    this.buttonLabel = this.$t("collapse.button.show")
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .vca-collapse {
        margin-bottom: 1em;
        padding: 0.4em 1em;
        border-radius: 0.4em;
        background-color: #efefef;
    }

    .state {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 2.5em;

        span {
            font-weight: bold;
        }
        .status-bar {
            flex-grow: 1;
        }
        button {
            border: 1px solid rgba(60, 60, 60, 0.26);
            border-radius: 4px;
            margin-left: 1em;
            background: none;
        }
    }

    .content {
        padding-top: 0.4em;
    }

    .collapsed {
        .content {
            display: none;
        }
    }

    .non-collapsed {
        .content {
            display: block;
        }
    }

</style>
