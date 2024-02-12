<template lang="">
   <section>
    <h5>search组件</h5>
    <div>
        <input type="text" v-model="keyWord"/>
        <button @click="search">search</button>
    </div>
   </section>
</template>
<script>
import axios from 'axios'
export default {
    name: 'Search',
    data() {
        return {
            keyWord: 'microsoft'
        }
    },
    methods: {
        async search() {
            this.$bus.$emit('get-list-data', { isFirst: false, isLoading: true });
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                // const { items } = response.data;
                this.$bus.$emit('get-list-data', { isLoading: false, users: response.data })

            } catch (error) {
                this.$bus.$emit('get-list-data', { isLoading: false, users: [], errMsg: error.message })
            }
        }
    },

}
</script>
<style lang="">
    
</style>


