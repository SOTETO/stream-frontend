<template>
    <el-select v-model="val" @input="commit">
      <el-option-group
        v-for="group in sourceGroups"
        :key="group.label"
        :label="group.label">
          <el-option
            v-for="item in group.sourceSelect"
            :key="item.id"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
      </el-option-group>
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
      "sourceGroups": [
        {
          "label": this.$t('donation.placeholder.source.group.donations'),
          "sourceSelect":
          [
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
                "typeOfSource": {},
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
                "typeOfSource": {},
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
                "typeOfSource": {},
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
                "typeOfSource": {},
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
                "typeOfSource": {},
                "desc": true
              }
            }
          ]
        },{
          "label": this.$t('donation.placeholder.source.group.economic'),
          "sourceSelect": [
            {
              'label': this.$t('donation.placeholder.source.merch'),
              'disabled': false,
              'value' : {
                "amount": {
                  "amount": 0,
                  "currency": "EUR"
                },
                "category": "merch",
                "norms": "ECONOMIC",
                "typeOfSource": {},
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
                "category": "other_ec",
                "norms": "ECONOMIC",
                "typeOfSource": {},
                "desc": false
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    commit() {
      this.$emit("input", this.val);
      Object.entries(this.sourceGroups).forEach(([groupKey, groupVal]) => {
        Object.entries(groupVal.sourceSelect).forEach(([key, val]) => {
          if (this.val.category == val.value.category) {
            this.sourceGroups[groupKey].sourceSelect[key].disabled=true;
          }
        });
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
