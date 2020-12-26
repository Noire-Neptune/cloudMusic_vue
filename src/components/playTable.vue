<template>
  <div class="comp-content">
    <preview-image-component ref="preview"></preview-image-component>
    <div class="playlist">
      <!-- 歌单封面,介绍区域 -->
      <!-- <div class="playlist-titleContent clearfix" v-if="isGeDanShow">
        <div
          class="maoboli"
          :style="{ backgroundImage: 'url(' + playTitle.img + ')' }"
        ></div>
        <div
          class="playlist-titleContent-img"
          :style="{ backgroundImage: 'url(' + playTitle.img + ')' }"
          @click="preview"
        ></div>
        <div class="playlist-titleContent-title">
          <div>{{ playTitle.name }}</div>
          <div class="collect">
            <img
              class="userImg"
              v-lazy="collectUser.avatarUrl"
              alt="用户头像"
              @click="enterUserDetail"
            />
            <span class="nickName" @click="enterUserDetail">{{
              collectUser.nickname
            }}</span>
            <div class="collectBtn" @click="collect">
              <img
                :src="
                  isCollect
                    ? require('../img/like.png')
                    : require('../img/unlike.png')
                "
              /><span>收藏</span>
            </div>
          </div>
          <div>{{ playTitle.description }}</div>
        </div>
      </div> -->
      <div class="playlist-list">
        <!-- 歌曲列表按钮区域(搜索,排序等) -->
        <div class="play-list-setting clearfix">
          <div
            class="tab-item"
            :style="{ borderBottom: tabActive == 1 ? '2px solid pink' : '0' }"
            @click="tab(1)"
          >
            歌曲列表
          </div>
          <div
            class="tab-item"
            :style="{ borderBottom: tabActive == 2 ? '2px solid pink' : '0' }"
            @click="tab(2)"
          >
            评论({{ commentCount }})
          </div>
          <div
            class="tab-item"
            :style="{ borderBottom: tabActive == 3 ? '2px solid pink' : '0' }"
            @click="tab(3)"
          >
            相似歌单
          </div>
          <button class="searchBtn" @click="search"></button>
          <input
            type="text"
            class="searchInput"
            placeholder="搜索歌单内的歌名..."
            v-model="searchVal"
          />
        </div>
        <!-- 歌曲列表 -->
        <table v-show="tabActive == 1">
          <thead>
            <tr>
              <td>序号</td>
              <td>操作</td>
              <td>歌曲名</td>
              <td>歌手</td>
              <td>专辑</td>
              <td>时长</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) of songList"
              :key="i"
              :class="{ playingAnimate: item.playing }"
              @click="getSong(item.id, item.ar, item.al.name, i)"
            >
              <td>{{ i + 1 }}</td>
              <td>
                <img
                  class="like"
                  :src="
                    item.liked
                      ? require('../img/like.png')
                      : require('../img/unlike.png')
                  "
                  @click="liked(item.liked, item.id)"
                />
              </td>
              <!-- 歌曲名+歌曲简介 -->
              <td>{{ item.name }}&nbsp;&nbsp;{{ item.alia.join() }}</td>
              <td>
                <span
                  class="playlist-list-singer"
                  v-for="(itemj, j) of item.ar"
                  :key="j"
                  >{{ itemj.name
                  }}{{ j == item.ar.length - 1 ? "" : ", " }}</span
                >
              </td>
              <td>{{ item.al.name }}</td>
              <td>{{ g.secondToStr(Math.floor(item.dt / 1000)) }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 评论区域 -->
        <comment-and-similar
          v-if="tabActive == 2"
          :id="playListId"
          :type="isGeDan == 'zhuanji' ? '3' : '2'"
        ></comment-and-similar>
        <!-- 相似歌单 -->
        <div class="similarplayListContent" v-if="tabActive == 3">
          <div
            class="similarplayListContent-item"
            v-for="(item, i) of similarPlayList"
            :key="i"
            @click="linkToPlayList(item.id)"
          >
            <img v-lazy="item.coverImgUrl" alt="歌单图片" />
            <div class="similarplayListContent-item-msg">
              <div class="similarplayListContent-item-msg-title">
                {{ item.name }}
              </div>
              <div class="similarplayListContent-item-msg-creator">
                创建者: {{ item.creator.nickname }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commentAndSimilar from "../components/commentAndSimilar.vue";
import { mapMutations } from "vuex";
export default {
  //props的数据是单向的,vue不建议修改props的属性,会报错误
  /**
   * songListRes:歌单数据的请求结果,里面只有歌单相关信息,以及歌曲id的集合
   * isGeDan:是否为歌单/专辑, 歌单/专辑的请求结果和搜索歌曲的请求结果不同, 并且搜索歌曲时没有歌单标题,可能的值有:true:歌单, zhuanji:专辑, false:搜索等
   */
  props: ["songListRes", "isGeDan", "musicId"],
  data() {
    return {
      songList: [], //歌曲列表
      loadedsongList: [], //存储刚加载完成时的音乐列表, 用户进行歌曲搜索会改变songList值
      nextSong: {}, //存放下一首歌曲的信息
      prevSong: {}, //存放上一首歌曲的信息
      playTitle: {}, //存放歌单的信息, 标题介绍封面, 创建时间
      searchVal: "", //搜索框内容
      isGeDanShow: false, //是否显示顶部歌单标题,封面,介绍
      tabActive: 1, //当前点击的是第几个tab
      playListId: 0, //当前歌单id
      similarPlayList: [], //相似歌单列表
      collectUser: {}, //歌单收藏者信息
      isCollect: false, //收藏状态
      commentCount: 0, //评论数
    };
  },
  created() {},
  mounted() {
    //props的参数给v-if会有报错, 提示参数未定义但已被使用
    this.isGeDanShow = this.isGeDan;
    if (this.isGeDanShow) this.playListId = this.$route.query.id;
  },
  methods: {
    ...mapMutations(["setMusicMsg"]),
    //获取音乐详情
    getPlayDetail() {
      var res = this.songListRes;
      console.log("歌单/专辑详情", res);
      this.commentCount = res.commentCount;
      if (this.isGeDan === true) {
        //检查歌单是否收藏
        this.collectUser = res.creator;
        for (let item of this.g.userPlayListIds) {
          if (item == this.playListId) {
            this.isCollect = true;
            break;
          }
        }
      }
      //根据歌单id列表获取歌曲详情
      var trackIds = [];
      this.playTitle = {
        img: res.coverImgUrl, //封面
        name: res.name, //名称
        createTime: new Date(res.createTime), //创建时间
        description: res.description, //介绍
      };

      if (this.isGeDan) {
        for (var i = 0; i <= res.trackIds.length - 1; i++) {
          var item = res.trackIds[i];
          trackIds.push(item.id);
        }
      } else {
        for (var i = 0; i <= res.length - 1; i++) {
          var item = res[i];
          trackIds.push(item.id);
        }
      }
      if (trackIds.length != 0) {
        this.getSongList(trackIds, () => {
          this.g.print("歌曲列表", this.songList);
        });
      } else {
        this.songList = [];
        this.$emit("hideLoading");
      }
    },
    //获取歌曲列表,渲染到列表页上,但没有歌曲的url, 参数:trackIds:歌曲id集合(字符串),success:成功回调
    getSongList(trackIds, success) {
      // 加载歌曲信息采用分片加载,每50,80,150首歌请求一次ajax
      var promiseArr = [],
        _ids = [],
        ids = [],
        pushIndex = 60; //一次请求的歌曲个数,若总歌曲个数超过500, 则一次请求80个,若超过1000,则一次请求150个
      if (trackIds.length > 500 && trackIds.length < 500) {
        pushIndex = 100;
      } else if (trackIds.length >= 1000) {
        pushIndex = 150;
      }
      for (let i = 0; i < trackIds.length; i++) {
        _ids.push(trackIds[i]);
        if ((i % pushIndex == 0 && i > 0) || i == trackIds.length - 1) {
          ids.push(_ids); //指定长度收集一次数组
          _ids = [];
        }
      }
      //debugger
      var idsIndex = 0; //分段加载的数组索引
      console.log(ids);
      this.loadSongList(ids, pushIndex, idsIndex, success);
    },
    //分段加载歌曲详细信息,参数:ids:歌曲id数组,pushIndex:一次请求的歌曲数量,
    loadSongList(ids, pushIndex, idsIndex, success) {
      var songList = [];
      this.g
        .axios({
          url: this.g.host + "/song/detail",
          params: {
            ids: ids[idsIndex].join(),
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            //第一次加载完成就关闭遮罩
            if (idsIndex == 0) this.$emit("hideLoading");
            songList = res.data.songs;
            //读取用户收藏状态并选中
            for (var i = 0; i <= songList.length - 1; i++) {
              var item = songList[i];
              for (var j = 0; j <= this.g.likedMusic.length - 1; j++) {
                var itemj = this.g.likedMusic[j];
                if (item.id == itemj) {
                  item.liked = true;
                  break;
                } else {
                  item.liked = false;
                }
              }
            }
            this.g.findPlayingMusic(songList, this.g.music.id);
            this.songList = this.songList.concat(songList);
            this.loadedsongList = this.loadedsongList.concat(songList);
            //只要有一次请求完成, 不管有没有全部加载完,都将数据传到index页面,防止用户点击歌曲后主页下方播放区域看不到歌曲信息
            this.$emit("songList", this.songList);
            //如果ids长度和一次请求的歌曲个数相同, 则证明还有
            if (idsIndex != ids.length - 1) {
              idsIndex++;
              this.loadSongList(ids, pushIndex, idsIndex, success);
            } else {
              success();
            }
          } else {
            throw new Error(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取歌曲信息, 传给主页面,主页面请求后获取url进行播放
    getSong(id, singer, zhuanji, index) {
      this.setMusicMsg({
        id: id,
        singer: singer,
        zhuanji: zhuanji,
        index: index,
      });
    },

    //设置喜欢该音乐 likeStatus:请求之前的喜欢状态, id:歌曲id
    liked(likeStatus, id) {
      likeStatus = likeStatus ? false : true;
      console.log(likeStatus, id);
      this.g
        .axios({
          url: this.g.host + "/like",
          params: {
            id: id, //要喜欢的id
            like: likeStatus, //如果喜欢状态为喜欢,则取消喜欢,否则为设定喜欢
          },
        })
        .then((res) => {
          console.log("歌曲喜欢/取消喜欢", res);
          if (res.data.code == 200) {
            //设置该歌曲为喜欢
            for (var i = 0; i <= this.songList.length - 1; i++) {
              if (this.songList[i].id == id) {
                this.songList[i].liked = likeStatus;
                console.log(this.songList[i].liked);
                break;
              }
            }
            //喜欢的将歌曲添加到likedMusic数组中, 用户切换歌单或者搜索歌曲时不用再次请求
            if (likeStatus) {
              //添加
              this.g.likedMusic.push(id);
            } else {
              //去除
              this.g.likedMusic = this.g.likedMusic.filter((item, i) => {
                return item != id;
              });
            }
            console.log(this.g.likedMusic);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //搜索歌曲
    search() {
      this.songList = this.songList.filter((item, i) => {
        return (
          item.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) != -1 ||
          item.alia
            .join()
            .toLowerCase()
            .indexOf(this.searchVal.toLowerCase()) != -1
        );
      });
    },
    // 获取相似歌单
    getSimilarPlayList() {
      this.g
        .axios({
          url: "/related/playlist",
          params: {
            id: this.playListId, //当前歌单id
          },
        })
        .then((res) => {
          console.log("获取相似歌单", res);
          this.similarPlayList = res.data.playlists;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    linkToPlayList(id) {
      this.$router.push({
        path: "/playlistDetail",
        query: {
          id: id,
        },
      });
    },
    // 进入用户界面
    enterUserDetail() {
      this.$router.push({
        path: "/personal",
        query: {
          userId: this.collectUser.userId,
        },
      });
    },
    // 点击tab标签
    tab(index) {
      this.tabActive = index;
    },
    //收藏歌单
    collect() {
      this.g
        .axios({
          url: "/playlist/subscribe",
          params: {
            id: this.playListId, //当前歌单id
            t: this.isCollect == false ? 1 : 2, //收藏还是取消收藏
          },
        })
        .then((res) => {
          console.log("收藏成功", res);
          this.isCollect = !this.isCollect;
          alert((this.isCollect ? "收藏" : "取消收藏") + "成功");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    preview() {
      //展示封面大图
      this.$refs.preview.show(this.playTitle.img);
    },
  },
  watch: {
    songListRes() {
      this.getPlayDetail();
    },
    musicId() {
      this.g.findPlayingMusic(this.songList, this.musicId);
    },
    //监听音乐搜索框内容,若为空,恢复所有歌曲
    searchVal() {
      if (!this.searchVal) {
        this.songList = this.loadedsongList;
      }
    },
    // 监听目前点击的是第几个tab页,如果是点击了相似歌单, 就加载相似歌单的信息
    tabActive() {
      if (this.tabActive == 3) {
        this.getSimilarPlayList();
      }
    },
    $route(to, from) {
      //监听路由是否变化,变化则获取歌单id,变化歌单评论
      if (to.query.id != from.query.id) {
        this.songList = [];
        if (this.$route.query.id) {
          if (this.isGeDanShow) {
            this.playListId = this.$route.query.id;
            this.tabActive = 1;
          }
        }
      }
    },
  },
  computed: {
    // getSecond(s) {
    //   return (s) => {
    //     return this.g.secondToStr(s);
    //   };
    // },
  },
  components: {
    commentAndSimilar,
  },
};
</script>

<style scoped>
.comp-content {
  height: 100%;
  padding-bottom: 0;
}

.playlist-titleContent {
  position: relative;
  height: 12rem;
  overflow: hidden;
  margin-bottom: 1.2rem;
}
/* 毛玻璃效果 */
.maoboli {
  position: absolute;
  z-index: -1;
  content: "";
  width: 100%;
  height: 100%;
  filter: blur(10px);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.playlist-titleContent-img {
  width: 12rem;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 50%;
}
.playlist-titleContent-title {
  width: calc(100% - 12rem);
  height: 100%;
  padding-left: 1rem;
  overflow: hidden;
}
.playlist-titleContent-title div:first-child {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.playlist-titleContent-img,
.playlist-titleContent-title {
  float: left;
}
.playlist-list {
  overflow: auto;
}
.playlist-list table {
  width: 100%;
  overflow: auto;
  border-collapse: collapse;
  table-layout: fixed;
}
.playlist-list table tbody tr {
  cursor: pointer;
}
.playlist-list table td {
  height: 3rem;
  /* border: 1px solid gray; */
  padding: 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 歌单每个单元格列的宽度 */
/* 序号和是否喜欢 */
.playlist-list table td:first-child {
  width: 4.8rem;
  text-align: center;
}
.playlist-list table td:nth-child(2) {
  width: 3rem;
  text-align: center;
}
/* 歌名 */
.playlist-list table td:nth-child(3) {
  width: calc(61% - 7.8rem);
}
/* 歌手 */
.playlist-list table td:nth-child(4) {
  width: 15%;
}
/* 专辑 */
.playlist-list table td:nth-child(5) {
  width: 20%;
}
/* 时长 */
.playlist-list table td:nth-child(6) {
  width: 4%;
}
.playlist-list table tbody tr td {
  border-bottom: 1px solid #efefef;
}
/* .playlist-list table tbody tr:nth-child(odd) {
  background-color: #efefef;
} */
.playlist-list .like {
  width: 16px;
  height: 16px;
}
.playingAnimate {
  animation: shandong 3s infinite;
}
/* 歌单搜索,排序设置区域 */
.play-list-setting {
  padding: 0.8rem;
}
.play-list-setting > .searchInput,
.play-list-setting > .searchBtn {
  float: right;
}
.play-list-setting > .tab-item {
  float: left;
  width: 8rem;
  height: 2.2rem;
  line-height: 2.2rem;
  text-align: center;
  font-size: 1.2rem;
  cursor: pointer;
}
.play-list-setting > .tab-item-active {
  border-bottom: 2px solid pink;
}
.play-list-setting > .searchInput {
  border-right: 0;
  border-radius: 3px 0 0 3px;
}
.play-list-setting > .searchBtn {
  border: 1px solid #e3e3e3;
  border-left: 0;
  border-radius: 0 3px 3px 0;
  padding: 0;
  width: 2.2rem;
  height: 2.2rem;
  background-image: url("../img/search.png");
  background-position: center center;
  background-size: 16px;
  background-repeat: no-repeat;
  background-color: #fff;
  cursor: pointer;
}
/* 歌单详情区域 */
.similarplayListContent-item {
  height: 10rem;
  margin: 1rem 0;
  cursor: pointer;
}
.similarplayListContent-item-msg,
.similarplayListContent-item > img {
  display: inline-block;
  vertical-align: middle;
}
.similarplayListContent-item > img {
  width: auto;
  height: 100%;
}
.similarplayListContent-item-msg {
  width: calc(100% - 12rem);
  height: 100%;
  padding-left: 1rem;
}
.similarplayListContent-item-msg-title {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}
.similarplayListContent-item-msg-creator {
  color: #0698dd;
}
.playlist-titleContent-title .collect {
  margin-bottom: 1rem;
}
.playlist-titleContent-title .collect img,
.playlist-titleContent-title .collect span,
.playlist-titleContent-title .collect .collectBtn {
  display: inline-block;
  vertical-align: middle;
}
.playlist-titleContent-title .collect span {
  padding-left: 1rem;
}
.playlist-titleContent-title .collect > .userImg {
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
}
.playlist-titleContent-title .collect > .nickName {
  color: #409eff;
}
.playlist-titleContent-title .collect .collectBtn {
  padding: 0.3rem 1rem;
  border-radius: 3rem;
  border: 1px solid red;
}
.playlist-titleContent-title .collect .collectBtn img {
  width: 2rem;
  height: 2rem;
}
@keyframes shandong {
  0% {
    background: transparent;
    color: black;
  }
  50% {
    background: rgb(0, 191, 255);
    color: white;
  }
  100% {
    background: transparent;
    color: black;
  }
}
</style>