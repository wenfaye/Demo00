<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
   <Entrance/>
  
  </div>
</template>

<script>
import Entrance from './router/Entrance.vue'

export default {
  name: 'App',
  components: {
    Entrance
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
