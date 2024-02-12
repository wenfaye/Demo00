<template lang="">
    <div>
        <h1>我是app组件</h1>
  <h1>我叫{{ name }}, {{ age }}岁</h1>
  <button @click="sayHello">hello!!</button>
  <h3>msg: {{ vue2 }}</h3>
  <p>数据冲突该怎么办？{{ a }}</p>
  <button @click="test1">测试一下在vue2中去读取vue3的配置</button>
  <button @click="test2">测试一下在vue3的setup中去读取vue2的配置</button> 
    </div>
</template>
<script>
export default {
    name: 'Test00',
    data() {
        return {
            vue2: 'still can use vue2 in vue3 code',
            a: 1
        }
    },
    methods:{
    //vue2配置方法的方式
    test1(){
      console.log(this.vue2);
      console.log(this.name);
      console.log(this.sayHello);
      this.sayHello();
    }
  },
    setup() {
        let name = 'py';
        let age = 21;
        let a = 300;

        //方法 methods
        function sayHello() {
            alert(`My name is ${name}, ${age} ${age === 1 ? 'year' : 'years'} old`);
        }
        //在vue3的配置里去读取vue2的属性
        function test2() {
            console.log(name);
            console.log(age);
            console.log(sayHello);
            console.log(this.vue2);
            console.log(this.test1);
        }


        //返回一个对象
        return {
            name,
            age,
            sayHello,
            test2,
            a
        }
    }

}
</script>
<style>

</style>