<template>
  <div>
    <el-select v-model="value" @input="commit">
      <el-option
        v-for="item in norms"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { Select } from 'element-ui'
  export default {
    name: "TakingsSelect",
    components: {
      "el-select": Select
    },
    data () {
      return {
        norms: [
          {value: 'DONATION', label: 'donation'},
          {value: 'ECONOMY', label: 'economy'}
        ],
        value: ''
      }
    },
    methods: {
      commit() {
        this.$emit("input", this.value)
      }
    }
  }
</script>
