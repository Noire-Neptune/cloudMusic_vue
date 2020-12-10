import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from "./views/index.vue"
import Play from './views/play.vue'
import Recommend from './views/recommend.vue'
import PlaylistDetail from './views/playlistDetail.vue'
import Search from './views/search.vue'
import SearchSuggestion from './views/searchSuggestion.vue'
import Personal from './views/personal.vue' //个人信息
import Album from './views/album.vue' //专辑页
import Competitive from './views/competitive.vue' //精选歌单页
import Login from './views/login.vue' //精选歌单页
Vue.use(VueRouter);
//屏蔽路由重复的报错,对项目无影响
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new VueRouter({

    routes: [{
        path: "/",
        name: "/",
        component: Index,
        children: [{
            path: '/', //以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
            name: 'recommend',
            component: Recommend
        }, {
            path: '/play',
            name: 'play',
            component: Play
        },
        {
            path: '/playlistDetail',
            name: 'playlistDetail',
            component: PlaylistDetail
        },
        {
            path: '/search',
            name: 'search',
            component: Search
        },
        {
            path: '/searchSuggestion',
            name: 'searchSuggestion',
            component: SearchSuggestion
        },
        {
            path: '/personal',
            name: 'personal',
            component: Personal
        },
        {
            path: '/album',
            name: 'album',
            component: Album
        },
        {
            path: '/competitive',
            name: 'competitive',
            component: Competitive
        }
        ]
    }, {
        path: "/login",
        name: "login",
        component: Login
    }]
})