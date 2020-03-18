<template>
   <el-button type="primary" size="mini" @click="userPage(user.uuid)"> {{ user.name }} </el-button>
</template>
<script>
export default {
  name: 'UserButton',
  props: {
    user: {
      type: Object,
      default: function () {
        return {
          "uuid": "",
          "name": ""
        }
      }
    }
  },
  methods: {
    userPage (uuid) {
      window.location.href = '/arise/#/user/' + uuid
    }
  }
}
</script>
