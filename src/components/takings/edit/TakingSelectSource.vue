<template>
  <el-form-item>
    <el-select v-model="val" @input="commit">
      <el-option
        v-for="item in sourceSelect"
        :key="item.id"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script>
import {FormItem, Select, Option } from 'element-ui'
export default {
  name: 'TakingSelectSource',
  components: {
    'el-form-iteam': FormItem,
    'el-select': Select,
    'el-option': Option
  },
  data () {
    return {
      "val": "",
      "sourceSelect": [
        {
          'label': this.$t('donation.placeholder.source.unknown'), 
          'value' : {
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "unknown", 
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.can'), 
          'value' : {
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "can", 
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.box'), 
          'value' : { 
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "box", 
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.gl'), 
          'value' : { 
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "gl", 
            "desc": false
          }
        },
        {
          'label': this.$t('donation.placeholder.source.other'), 
          'value' : { 
            "amount": {      
              "amount": 0,
              "currency": "EUR"
            },
            "category": "other", 
            "desc": true
          }
        }
      ]
    }
  },
  methods: {
    commit() {
      this.$emit("input", this.val)
    }
  }
}
</script>
