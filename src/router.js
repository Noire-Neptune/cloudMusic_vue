import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from "./views/index.vue"
import Play from './views/play.vue'
Vue.use(VueRouter);
export default new VueRouter({

    routes: [
        {
            path: "/", name: "/", component: Index,
             children: [{
                path: '/',//以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
                name: '/',
                component: Play
            }]
        }
    ]
})