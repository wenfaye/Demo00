import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    sum: 0,
    name:"测试"
}

const actions = {
    jia(context, value) {
        context.commit('JIA', value)
    }
}

const mutations = {
    JIA(state, value) {
        state.sum += value;
    }
}

const getters = {
    bigSum(){
        state.sum*100
    }
}


const store = new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})

export default store;