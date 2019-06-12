<template>
  <el-form
    :model="depositStub"
    :rules="rules">
    <el-form-item>
      <el-input :placeholder="$t('deposit.box.amount')" v-model="description" ></el-input>
    </el-form-item>
    <el-form-item>
      <div v-if="depositUnits.length">
        <li :v-for="deposit in depositUnits">
          {{ deposit.name }} 
          <el-input :placeholder="$t('deposit.box.amount')" v-model="description" ></el-input>
        </li>
      </div>
    </el-form-item>
    <el-form-item>
      <el-select v-model="value" change="handleSelect(value)">
        <el-option
          v-for="item in donations" 
          :key="item.name"
          :label="item.name"
          :value="item">
    </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      class="vca-form"
      :required="true"
      :label="$t('donation.placeholder.received')">
      <el-date-picker
        v-model="received"
        type="date"
        :placeholder="$t('donation.placeholder.received')"
        format="dd. MMM. yyyy"
        value-format="timestamp"
        :clearable="false"
        :picker-options="datePickerOptions" >
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
  import { FormItem, Input, Form, Select, DatePicker} from 'element-ui'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: "DonationDeposit",
    components: {
      "el-form": Form,
      "el-form-item": FormItem,
      "el-select": Select,
      "el-input": Input,
      "el-date-picker": DatePicker
    },
    computed: {
            ...mapGetters('donations', {
                donations: 'overview',
                isError: 'isError',
                getErrorCode: 'getErrorCode',
            }),
            maximumTags () {
                return 2;
            }
        },
    created () {
      this.init()
    },
    data () {
      return {
        description: "",
        depositUnits: [],
        depositUnitStub: {
          received: "",
          amount: "",
          created:""
        },
        depositStub: {
          amount: [
          ]
          
        },

        rules: {}

      }
    },
    methods: {
      ...mapActions('donations', [
        'init', // map `this.init()` to `this.$store.dispatch('donations/init')`
      ]),
      handleSelect (value) {
       let depositUnit = {
          id: value.id,
          name: value.name,
          received: "",
          amount: "",
          created: ""
        };
        this.depositUnits.append(depositUnit)
      }

    }
  }
</script>
