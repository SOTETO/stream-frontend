<template>
  <el-radio-group v-model="confirmed" style="small">
    <el-radio :label="lang.label1"></el-radio>
    <el-radio :label="lang.label2"></el-radio>
    <el-radio :label="lang.label3"></el-radio>
  </el-radio-group></template>
<script>
export default {
  name: "FilterOption",
  props: {
    lang: {
      type: Object,
      default: function () {
        return {
          label1: "Confirmed",
          label2: "Not Confirmed",
          label3: "All"
        }
      }
    }
  },
  data () {
    return {
      confirmed: ''
    }
  }
}
</script>
