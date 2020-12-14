import Vue from 'vue';
import vuex from 'vuex'
Vue.use(vuex);
const store = new vuex.Store({//创建store对象,对象中存放可全局共享的数据
    state: {//state中存放的就是需要全局共享的数据
        musicMsg: {}
    },
    mutations: {
        setMusicMsg(state, payload) {
            state.musicMsg = payload
        }
    }
})
export default store;