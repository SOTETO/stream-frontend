<template>
  <VcAFrame title="Home">
    <VcAColumn>
      <VcABox :first="true" title="Logo">
        <img alt="Vue logo" src="../assets/logo.png">
      </VcABox>
    </VcAColumn>
    <VcAColumn>
      <VcABox :first="true" title="Welcome">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
      </VcABox>
    </VcAColumn>
  </VcAFrame>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { VcAFrame, VcAColumn, VcABox } from 'vca-widget-base'
import 'vca-widget-base/dist/vca-widget-base.css'

export default {
  name: 'home',
  components: {
    HelloWorld, VcAFrame, VcAColumn, VcABox
  }
}
</script>
