<template>
  <el-radio-group v-model="confirmed" style="small" v-on:change="change">
    <el-radio :label=true>{{ lang.label_true}}</el-radio>
    <el-radio :label=false>{{ lang.label_false}}</el-radio>
    <el-radio :label=null>{{ lang.label_null}}</el-radio>
  </el-radio-group></template>
<script>
export default {
  name: "FilterOption",
  props: {
    lang: {
      type: Object,
      default: function () {
        return {
          label_true: "Confirmed",
          label_false: "Not Confirmed",
          label_null: "All"
        }
      }
    }
  },
  data () {
    return {
      confirmed: null
    }
  },
  methods: {
    change() {
      this.$emit("change", this.confirmed)
    }
  }
}
</script>
