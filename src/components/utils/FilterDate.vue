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
  name: "FilterDate",
  props: ['from', 'to'],
  data () {
    return {
      dates: [],
      result: {
        from: null,
        to: null
      }
    }
  },
  methods: {
    setDate: function() {
      if (this.dates !== null && this.dates.length > 1) {
        this.result.from = Date.parse(this.dates[0])
        this.result.to = Date.parse(this.dates[1]) + (24 * 3600 * 1000) - 1
      }else{
        this.result.from = null
        this.result.to = null
      }
      this.$emit('update', this.result)
    }
  }
}
</script>

