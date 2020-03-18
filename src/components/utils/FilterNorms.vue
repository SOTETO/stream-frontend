<template>
  <el-radio-group v-model="norms" style="small" v-on:change="change">
    <el-radio label="ECONOMIC">{{ lang.label_ECO}}</el-radio>
    <el-radio label="DONATION">{{ lang.label_DON}}</el-radio>
    <el-radio :label=null>{{ lang.label_null}}</el-radio>
  </el-radio-group></template>
<script>
export default {
  name: "FilterNorms",
  props: {
    lang: {
      type: Object,
      default: function () {
        return {
          label_ECO: "Wirtschafts Einnahme",
          label_DON: "Spende",
          label_null: "All"
        }
      }
    }
  },
  data () {
    return {
      norms: null
    }
  },
  methods: {
    change() {
      this.$emit("change", this.norms)
    }
  }
}
</script>
