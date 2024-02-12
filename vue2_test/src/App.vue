<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
   <Search/>
    <List/>
  </div>
</template>

<script>
import Search from './事件总线components/Search.vue'
import List from './事件总线components/List.vue'
// import Entrance from './router/Entrance.vue'

export default {
  name: 'App',
  components: {
    Search,
    List
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
