<template>
  <div>
     {{ this.expense }}

  <el-form
    :label-position="top"
    :model="details"
    :rules="rules"
    :ref="details">

      <el-radio-group v-model="details.request">
        <el-radio-button :label="false">{{ $t('household.placeholder.request') }}</el-radio-button>
        <el-radio-button :label="true">{{ $t('household.placeholder.appliedFor') }}</el-radio-button>
      </el-radio-group>

    <el-form-item
        :label="$t('household.details.amount')"
        prop="amount">
        <el-col
        :span="10">
          <el-input
            v-model="details.amount"
            autocomplete="off">
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="details.currency">
            <el-option
              label="USD"
              value="USD"
            ></el-option>
            <el-option
             label="FR"
              value="FR"
            ></el-option>
            <el-option
             label="EUR"
             value="EUR"
            ></el-option>
          </el-select>
        </el-col>

    </el-form-item>

    <el-form-item
        :label="$t('household.details.name')"
        :label-width="formLabelWidth"
        prop="supporter">
        <el-input
          v-model="details.supporter"
          autocomplete="off">
        </el-input>
    </el-form-item>

      <!--
       <el-form-item :label="$t('household.details.organization')" :label-width="formLabelWidth">
        <el-select v-model="form.organization" >
          <el-option label="Viva con Agua" value="shanghai"></el-option>
          <el-option label="Other" value="beijing"></el-option>
        </el-select>
       </el-form-item>
       -->
      <el-form-item
        :label="$t('household.details.date')"
        :label-width="formLabelWidth"
        prop="date"
      >
        <el-date-picker
          v-model="expense.date.created"
          type="date">
        </el-date-picker>
        <el-input
          v-model="details.date"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('household.details.crew')"
        :label-width="formLabelWidth"
        prop="crew"
      >
        <el-input
          v-model="details.crew"
          autocomplete="off"
          disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('household.details.what')"
        :label-width="formLabelWidth"
        prop="what"
      >
        <el-input
          v-model="details.what"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('household.details.event')"
        :label-width="formLabelWidth"
        prop="wherefor"
      >
        <el-input
          v-model="expense.wherefor"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('household.details.iban')"
        :label-width="formLabelWidth"
      prop="iban"
      >
        <el-input
          v-model="details.iban"
          autocomplete="off"
          disabled="true"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "detailModal",
    components: {
    },
    props: {
      "expense": {
        "type": Object,
        "required": true
      }
    },
    computed: {
    },
    methods: {
    },

    data ()  {
      var now = this.$d(new Date(), 'short');

      return {
        formLabelWidth : 150,
       /* details: {
          amount: this.expense.amount.amount,
          supporter: '',
          adddress: '',
          organization: '',
          date: now,
          crew: '',
          what: this.expense.what,
          wherefor: this.expense.reason.wherefor,
          iban:''
        },*/

        details: {
          request: this.expense.request,
          amount: this.expense.amount[0].amount,
          currency: this.expense.amount[0].currency,
          supporter: this.expense.author,
          address: '',
          organization: '',
          date: now,
          what: this.expense.what,
          wherefor: this.expense.wherefor,
          iban: this.expense.iban
        },
        rules: {
          amount: [
            { required: true, message: this.$t('household.details..rules.amount'), trigger: 'blur' },
            ],
          supporter:[
            { required: true, message: this.$t('household.details.rules.supporter'), trigger: 'blur' },
            ],
          date:[
            { required: true, message: this.$t('household.details.rules.date'), trigger: 'blur' },
            ],
          what:[
            { required: true, message: this.$t('household.details.rules.what'), trigger: 'blur' },
            ],
          wherefor:[
            { required: true, message: this.$t('household.details.rules.wherefor'), trigger: 'blur' },
            ],
          iban:[
            { required: true, message: this.$t('household.details.rules.iban'), trigger: 'blur' },
            ]
        }
    }
    }
  }
</script>

<style scoped>
 /* @import '../../assets/less/general.less';
*/
 .el-form-item__label:after {
   margin-left: 0px !important;
 }
</style>