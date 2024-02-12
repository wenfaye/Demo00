<template lang="">
    <div>
        <form @submit.prevent="submit">
				账号：<input type="text" v-model="userInfo.account"> 
				<br/><br/>
				密码：<input type="password" v-model="userInfo.password">
				<br/><br/>
				性别：男<input type="radio" name="sex" v-model="userInfo.sex" value="male">
							女<input type="radio" name="sex" v-model="userInfo.sex" value="female">
				<br/><br/>
				爱好：抽烟 <input type="checkbox"  v-model="userInfo.hobby" value="smoke">
							喝酒 <input type="checkbox"  v-model="userInfo.hobby" value="drink">
							开车 <input type="checkbox"  v-model="userInfo.hobby" value="drive">
				<br/><br/>
				所属校区：
                <select v-model="userInfo.city">
                                        <option value="">请选择校区</option>
                                        <option value="beijing">北京</option>
										<option value="shanghai">上海</option>
										<option value="shenzhen">深圳</option>
										<option value="wuhan">武汉</option>
                </select>
				<br/><br/>
				其他信息：<textarea v-model="userInfo.other" cols="30" rows="10"></textarea>
				<br/><br/>
				<input v-model="userInfo.agree" type="checkbox">阅读并接受<a href="http://www.atguigu.com">《用户协议》</a>
				<br/><br/>
				<button>提交</button>
			</form>
    </div>
</template>
<script>
export default {
    name: 'HelloWorld2',
    data() {
        return {
            userInfo: {
                account: '',
                password: '',
                sex: '',
                hobby: [],
                city: '',
                other: '',
                agree: false,
            }
        }
    },
    methods: {
        submit() {
            console.log(this.userInfo)
        }
    },

}
</script>
<style lang="">
    
</style>