<template lang="">
    <div class="wrap">
        <div class="btn-box">
            <img src="../assets/image/687474703a2f2f692e696d6775722e636f6d2f503463525567442e706e67.png"/>
        </div>
        <div class="btn-box">
            <img src="../assets/image/687474703a2f2f692e696d6775722e636f6d2f503463525567442e706e67.png"/>
        </div>
    </div>
    <div>
        <div>{{name1}}</div>
        <button @click="add">点击增加</button>
        <div>{{obj1.name2}}</div>
        <button @click="add2">点击对象增加</button>
    </div>
</template>

<script>
import { ref, reactive,onMounted,onBeforeMount,onUpdated,onBeforeUpdate,watchEffect,toRef,toRefs } from 'vue'
export default {
    name: 'NitaiButton',
    setup(props) {
        console.log('setup');
        // let name1 = 0;
        let name1 = ref(0);
        let obj1 = reactive({
            name2: 10
        })
        function add() {
            name1.value += 1;
        }

        const add2 = () => {
            obj1.name2 += 1;
            console.log(obj1.name2)
        }

        const person = reactive({
      name: '张三',
      age: 18,
      job:{
        j1:{
          salary: 20
        }
      }
    });

    //ref类型的值在模板里使用是不需要.value来取的
    const name3 = person.name //注意输出字符串，并不是响应式的数据
    console.log('@@@@@', name3);
    const name4 = toRef(person,name); //RefImpl 这里的name2与person.name是完全一模一样的(你改这里的name2与你改person.name是一码事),且数据还是响应式的
    console.log('####', name4);

    const x = toRefs(person);
    console.log(x);

        onBeforeMount(() => { console.log('----beforeMount----'); });
        onMounted(() => { console.log('-----mounted-----'); });
        onBeforeUpdate(() => { console.log('-----beforeUpdate-----') });
        onUpdated(() => { console.log('-----updated-----'); });

        watchEffect(()=>{
            const a = name1.value;
            const b = obj1.name2;
            console.log('watchEffect执行了');
        })

        return {
            name1,
            add2,
            add,
            obj1
        }
    }

}
</script>

<style>
.wrap {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.btn-box {
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    box-shadow: 18px 18px 30px #00000020,
        -18px -18px 30px #ffffff;
}

.btn-box:hover {
    cursor: pointer;
    box-shadow: 0px 0px 0px #00000020,
        0px 0px 0px #ffffff80, inset 18px 18px 30px #00000010,
        inset -18px -18px 30px #ffffff;
}

.btn-box img {
    width: 100px;
    height: 100px;
    transition: all .2s linear;
}

.btn-box:hover img {
    width: 95px;
    height: 95px;
}</style>