<template>
    <button type="success" icon="el-icon-check" circle></button>
</template>
<script>
import {Form} from 'element-ui'
import MoneyInput from '@/components/utils/MoneyInput'
export default {
  name: "DepositAdd",
  components: {
    "el-form": Form,
    "MoneyInput": MoneyInput
  },
  data () {
    return {
      "unit": {
        "amount": ""
      }
    }
  }

}
</script>
