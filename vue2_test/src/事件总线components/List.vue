<template lang="">
    <div>
        <h5>list组件</h5>
        <h5 v-show="listInfo.isFirst">欢迎━(*｀∀´*)ノ亻!</h5>
        <h5 v-show="listInfo.isLoading">isLoading。。。</h5>
        <h5 v-show="listInfo.errMsg">{{listInfo.errMsg}}</h5>
         <section v-show="listInfo.users.length" v-for="user in listInfo.users" :key="user.id">
            <ul>
                <li>name{{user.name}}</li>
                <li>name{{user.username}}</li>
                <li>name{{user.email}}</li>
            </ul>
         </section>
         
     </div>
</template>
<script>
export default {
    name: 'List',
    data() {
        return {
            listInfo: {
                users: [],
                isFirst: true,
                isLoading: false,
                errMsg: ''
            }
        }
    },
    methods: {
        saveData(dataObj) {
            this.listInfo = { ...this.listInfo, ...dataObj }
        }
    },
    mounted() {
        this.$bus.$on('get-list-data', this.saveData)
    },

}
</script>
<style lang="">
    
</style>

