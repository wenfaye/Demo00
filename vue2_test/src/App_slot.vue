<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
   
    <SlotComponent title="测试">
      <template slot="cate1">
       <img src="./assets/pic/01.png" />
      </template>
      <template slot="cate2">
       <img src="./assets/pic/03.png" />
      </template>
    </SlotComponent>
    <!-- <CountComponent/> -->
  </div>
</template>

<script>
import SlotComponent from './components/SlotComponent.vue'
// import CountComponent from './components/Count.vue'

export default {
  name: 'App',
  components: {
    SlotComponent,
    // CountComponent
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
