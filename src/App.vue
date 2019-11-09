<template>
  <div id="app">
    <PageLogin />
  </div>
</template>

<script>
import PageLogin from '@/components/PageLogin'

export default {
  name: 'app',
  components: {
    PageLogin
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
