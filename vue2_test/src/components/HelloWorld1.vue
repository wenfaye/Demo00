<template lang="">
    <div>
        <ul>
            <li v-for="(p,index) in persons" :key="p.id">
                {{p.name}}-- {{p.age}}-- {{index}}
            </li>
        </ul>
        {{text1}}
        <div>
            <a :href="url"> {{text1}}</a>
        </div>
        <!-- <button @click="show1">点我提示：信息1（@绑定）</button> -->
        <button @click="show1">点我提示：信息1（@绑定）</button><br>
        <button @click="show2($event,11)">点我提示：信息2（@绑定）</button>
        <input type="text" @keyup.enter="show3">
        <div>
            姓：<input type="text" v-model="firstName"> <br/><br/>
			名：<input type="text" v-model="lastName"><br/><br/>
            <span>全名:{{fullName}}</span><br/><br/>
			全名: <input type="text" v-model="fullName">
            <div><span>全名:</span>{{fullName1}}</div>
        </div>
        <button @click="isShow=!isShow">切换</button>
        <div :class="[a,b]" v-show="isShow"></div>
    </div>
</template>
<script>
export default {
    name: 'HelloWorld1',
    data() {
        return {
            text1: 'helloworld',
            url: 'http://www.atguigu.com',
            firstName: '张',
            lastName: '三',
            a: 'classA',
            b: 'classB',
            isShow: true,
            persons: [
                { id: '001', name: '老刘', age: 20, sex: '男' },
                { id: '002', name: '老李', age: 19, sex: '女' },
                { id: '003', name: '老王', age: 18, sex: '男' },
                { id: '004', name: '老张', age: 17, sex: '女' },
            ],
            car: {
                name: '奔驰c63',
                price: '60万',
                color: '灰色'
            },
            str: 'abcde',
        }
    },
    methods: {
        show1(event) {
            console.log(event);
        },
        show2(event, num) {
            console.log(num);
        },
        show3(event) {
            console.log(event.target.value);
        }
    },
    computed: {
        fullName() {
            return `${this.firstName}-${this.lastName}`
        }
    },
    watch: {
        lastName(newVal) {
            this.fullName1 = `${this.firstName}-${newVal}`
        }
    }
}
</script>
<style scoped>
.classA {
    width: 300px;
    height: 300px;
}

.classB {
    background-color: #396;
}
</style>