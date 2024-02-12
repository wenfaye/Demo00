<template>
    <div>
        <h2 class="title">安藤なつ妃</h2>
        <select v-model.number="n">
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
		</select>&nbsp;
        <p>{{sum}}</p>
        <p>{{name}}</p>
        <p>{{bigSum}}</p>
        <div>
            <button @click="JIA(n)">click</button>
            <button @click="jia(n)">click</button>
        </div>
    </div>
</template>
<script>

import {mapActions,mapGetters,mapMutations,mapState} from 'vuex';
let id;
export default {
    name:'CountComponent',
    data() {
        return {
            n:1
        }
    },
    mounted() {
     id = requestAnimationFrame(log);
    },
    computed: {
        ...mapState(['sum','name']),
        ...mapGetters(['bigSum'])
    },
    methods: {
        ...mapMutations(['JIA']),
        ...mapActions(['jia'])
    },
    beforeDestroy(){
        cancelAnimationFrame(id);
    }
}
function log(){
    console.log(44);
}
</script>
<style>
    .title{
        background-image: var(--app-background-gradient-blue_to_violet);
    }
</style>