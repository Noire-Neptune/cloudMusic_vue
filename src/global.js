import axios from 'axios'
import loadingComponent from './components/loadingComponent.vue'
import previewImageComponent from './components/previewImageComponent.vue'
export default {
    host: "http://49.232.0.103:3000",
    cookie: "",
    loadingAllPageHeight: 0, //loading铺满index内的子路由的高度
    userId: "",
    //获取带歌曲信息,传到play页面,以显示歌曲的歌词,歌手,专辑,码率等信息
    getMusic: function (id, msg) {
        this.music.id = id;
        this.music.msg = msg
    },
    likedMusic: [], //喜欢的音乐
    userPlayListIds: [], //收藏的歌单id
    music: {
        id: "",
        msg: {}
    },
    nextSong: {}, //存放下一首歌曲的信息
    prevSong: {}, //存放上一首歌曲的信息
    getNextSong: function (data) {
        this.nextSong = data;
    },
    getPrevSong: function (data) {
        this.prevSong = data;
    },
    getLikedMusic: function (data) {
        this.likedMusic = data;
    },
    axios: function (obj) {
        if (obj.url.indexOf("http://") == -1) {
            obj.url = this.host + obj.url
        }
        return new Promise((resolve, reject) => {
            if (!obj.params) obj.params = {};
            if (!obj.noCookie) obj.params.cookie = this.cookie
            axios(obj).then(res => {
                if (res.data.code == 200) {
                    resolve(res);
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    //找到正在播放的音乐
    findPlayingMusic: function (list, id) {
        for (var i = 0; i <= list.length - 1; i++) {
            list[i].playing = false;
            if (id == list[i].id) {
                list[i].playing = true;
            }
        }
    },
    // 全局引入组件
    install: function (Vue) {
        Vue.component('loadingComponent', loadingComponent);
        Vue.component('previewImageComponent', previewImageComponent);
    },
    print: function (title, msg) {
        console.log(title, JSON.parse(JSON.stringify(msg)))
    },
    p(val) {
        return JSON.parse(JSON.stringify(val))
    },
    secondToStr(second) {
        return Math.floor(second / 60) +
            ":" +
            (Math.floor(second % 60) >= 10
                ? Math.floor(second % 60)
                : "0" + Math.floor(second % 60));
    }
}