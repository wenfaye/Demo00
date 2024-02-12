import { defineStore } from 'pinia';
import { UserState } from '../interface'

export const useUserStore = defineStore('geeker-user', {
    state: (): UserState => ({
        token: "demo", 
        userInfo: { name: "Geeker" },
    }),
    getters: {

    },
    actions: {
        setToken(token: string) {
            this.token = token
        },
        setUserInfo(userInfo:UserState.userInfo){
            this.userInfo = userInfo
        }
    },
});

