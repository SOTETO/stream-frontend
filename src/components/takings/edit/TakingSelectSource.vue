<template>
    <el-select v-model="val" @input="commit">
      <el-option
        v-for="item in sourceSelect"
        :key="item.id"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled">
      </el-option>
    </el-select>
</template>

<script>

import {FormItem, Select, Option } from 'element-ui'

export default {
  name: 'TakingSelectSource',
  components: {
    'el-select': Select,
    'el-option': Option
  },
  data () {
    return {
      "val": "",
      "sourceSelect": [
        {
          'label': this.$t('donation.placeholder.source.unknown'), 
          'disabled': false,
          'value' : {
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "unknown", 
            "norms": "DONATION",
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.can'),
          'disabled': false,
          'value' : {
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "can", 
            "norms": "DONATION",
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.box'),
          'disabled': false,
          'value' : { 
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "box", 
            "norms": "DONATION",
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.gl'),
          'disabled': false,
          'value' : { 
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "gl", 
            "norms": "DONATION",
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.other'),
          'disabled': false,
          'value' : { 
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "other", 
            "norms": "DONATION",
            "desc": true
          }
        }
      ]
    }
  },
  methods: {
    commit() {
      this.$emit("input", this.val);
      console.log(this.val.amount);
      Object.entries(this.sourceSelect).forEach(([key, val]) => {
        if (this.val.category == val.value.category) {
          this.sourceSelect[key].disabled=true;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
  .el-select {
    display: block;
  }
</style>