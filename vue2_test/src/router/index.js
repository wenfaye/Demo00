import Vue from 'vue'
import VueRouter from 'vue-router'
import About from './About.vue'
import Home from './Home.vue'
import Message from './Message.vue'
import News from './News.vue'
import Detail from './Detail.vue'
import Detail2 from './Detail2.vue'
import Detail3 from './Detail3.vue'
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/about',
            component: About
        },
        {
            path: '/home',
            component: Home,
            children:[{
                path:'message',
                component:Message,
                children:[
                    {
                        path:'detail/:id',
                        component:Detail
                    },                  
                    {
                        path:'detail2/:id',
                        component:Detail2,
                        name:'xiangqing'
                    },
                    {
                        path:'detail3/:id',
                        component:Detail3,
                        name:'xiangqing1',
                        props(route){
                            const {id} = route.params;
                            const {title,content} = route.query;
                            return {id,title,content}
                        }
                    }
                ]
            },{
                path:'news',
                component:News
            }]
        }
    ]
})

export default router;