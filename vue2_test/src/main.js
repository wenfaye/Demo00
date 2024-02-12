import Vue from 'vue'
import App from './App.vue';
import store from './vuex/store1';
import router from './router/index'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this;
  },
  store,
  router
}).$mount('#app')
