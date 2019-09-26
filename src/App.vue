<template>
  <div id="app">
    <WidgetTopNavigation />
    <div id="content">
      <router-view/>
    </div>
    <WidgetBottomNavigation />
  </div>
</template>

<script>
    import { WidgetTopNavigation, WidgetBottomNavigation } from 'vca-widget-navigation'
    export default {
        name: 'App',
        components: { WidgetTopNavigation, WidgetBottomNavigation }
    }
</script>

<style lang="less">
  @import "assets/less/form";
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: min-content;
  }
  #content {
    flex-grow: 1;
    display: flex;
    overflow: auto;
  }
</style>
