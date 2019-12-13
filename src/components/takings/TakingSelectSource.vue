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
import { Select, Option } from 'element-ui'
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
        {'label': this.$t('donation.placeholder.source.unknown'), 'value' : {
          "category": "unknown", "desc": false}
        },
        {'label': this.$t('donation.placeholder.source.can'), 'value' : { 
          "category": "can", "desc": false}
        },
        {'label': this.$t('donation.placeholder.source.box'), 'value' :
        { "category": "box", "desc": false}},
        {'label': this.$t('donation.placeholder.source.gl'), 'value' : 
         { "category": "gl", "desc": false}
        },
        {'label': this.$t('donation.placeholder.source.other'), 'value' :
          { "category": "other", "desc": true}
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
