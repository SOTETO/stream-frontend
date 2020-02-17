<template>
    <el-date-picker
      v-model="dates"
      size="mini"
      @change="setDate"
      type="daterange"
      range-separator="-"
      start-placeholder="Start date"
      end-placeholder="End date">
    </el-date-picker>
</template>
<script>
export default {
  name: "DateFilter",
  props: ['from', 'to'],
  data () {
    return {
      dates: [],
    }
  },
  methods: {
    setDate: function() {
      this.$emit('update', this.dates)
    }
  }
}
</script>

