<template>
  <div class="clearfix" style="height:100%">
    <div class="header clearfix" ref="header">
      <div class="header-logo">云音乐</div>
      <div class="header-showDrawerBtn icon-menu" @click="drawerShow"></div>
      <!-- 上方右侧菜单栏, 手机端位于中间 -->
      <div class="header-menu clearfix">
        <router-link
          :to="{ name: 'personal', query: { userId: userId } }"
          class="header-menu-my"
          >我的</router-link
        >
        <router-link to="/" class="header-menu-found">发现</router-link>
        <router-link to="" class="header-menu-countryside">云村</router-link>
        <router-link to="" class="header-menu-video">视频</router-link>
        <a class="header-menu-skin" @click="changeSkin($event)">换肤</a>
        <router-link
          class="header-menu-search"
          :to="{ path: '/searchSuggestion' }"
        >
          <img src="../img/search.png" alt="搜索" />
        </router-link>
      </div>
    </div>
    <!-- 换肤菜单 -->
      <div
        class="changeSkinMenu"
        :style="{ display: showSkinMenu ? 'flex' : 'none' }"
      >
        <el-switch
          v-model="darkModel"
          active-text="暗黑模式"
        >
        </el-switch>
      </div>
    <div class="leftDrawer" :class="{showDrawer:showDrawer}" :style="{ height: drawerHeight + 'px' }" @mousedown="slideStart" @mouseup="slideEnd">
      <audio :src="song" autoplay ref="audio"></audio>
      <div class="leftDrawer-title"><span>推荐</span></div>
      <router-link to="/">
        <div class="leftDrawer-btns">
          <img src="../img/music.png" /><span>发现音乐</span>
        </div>
      </router-link>
      <router-link :to="{ path: '/play', query: { fm: 1 } }">
        <div class="leftDrawer-btns">
          <img src="../img/FM.png" /><span>私人FM</span>
        </div>
      </router-link>
      <div class="leftDrawer-btns">
        <img src="../img/video.png" /><span>视频</span>
      </div>
      <div class="leftDrawer-btns">
        <img src="../img/friends.png" /><span>朋友</span>
      </div>
      <router-link :to="{ path: '/playlist' }">
        <div class="leftDrawer-btns">
          <img src="../img/dailyRecommend.png" /><span>每日推荐</span>
        </div>
      </router-link>
    </div>
    <div
      class="play-tuijian"
      :style="{ height: drawerHeight + 'px' }"
      ref="playTuijian"
    >
      <!-- 传入:音乐信息,方便获取当前播放的音乐并标记出来-->
      <router-view
        ref="childRouter"
        :musicId="musicId"
        :contentHeight="contentHeight"
        :isPlay="isPlay"
        @songMsg="getplaylistSongMsg"
        @songList="getplaylistSongList"
        :fm="fm"
      ></router-view>
      <!-- 播放设置区域 -->
      <div class="play-setting clearfix" ref="playSetting">
        <router-link to="/play">
          <div
            class="play-setting-songImg"
            :style="{ backgroundImage: 'url(' + msg.pic + ')' }"
          ></div>
        </router-link>
        <div class="play-settings">
          <div class="play-settings-title">
            <span>{{
              msg.name ? msg.name+"&nbsp;&nbsp;"+msg.comment : "从歌单里选择一首喜欢的歌曲吧~"
            }}</span>
          </div>
          <div class="play-settings-sliderContent">
            <span class="play-settings-sliderContent-currentTime">{{
              currentTimeStr
            }}</span>
            <el-slider
              class="play-settings-sliderContent-slider"
              v-model="targetSlider"
              @change="sliderChange"
            ></el-slider>
            <span class="play-settings-sliderContent-endTime">{{
              durationStr
            }}</span>
          </div>
          <div class="play-settings-controll">
            <img src="../img/prev.png" @click="prev" />
            <img
              :src="
                isPlay
                  ? require('../img/pause.png')
                  : require('../img/play.png')
              "
              @click="playOrPause"
            />
            <img src="../img/next.png" @click="next" />
            <el-slider
              class="play-settings-controll-soundSlider"
              v-model="soundCurrent"
              @change="soundChange"
            ></el-slider>
            <img
              class="isLike"
              :src="
                isLike
                  ? require('../img/like.png')
                  : require('../img/unlike.png')
              "
              @click="liked"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <div class="login-alert" :style="{ display: alertShow }">
      <div class="login-alert-title">请登录</div>
      <div class="login-alert-form">
        <input
          type="text"
          placeholder="请输入网易云音乐手机号..."
          v-model="phone"
        />
        <input type="password" placeholder="请输入密码..." v-model="pwd" />
      </div>
      <div class="login-alert-btn">
        <button @click="login">确定</button>
        <button>取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      pwd: "",
      alertShow: "block",
      playShow: false, //歌单详情弹窗
      playTitle: {}, //歌单头部
      songList: [], //歌曲列表(由歌单页传来或者由播放界面(play)的fm传来)
      song: "",
      drawerHeight: 0, //左侧抽屉高度为屏幕高度
      comments: [],
      offset: 0,
      musicId: "", //单首音乐的id,传给子路由
      nextSong: {}, //存放下一首歌曲的信息
      prevSong: {}, //存放上一首歌曲的信息
      msg: "", //存放歌曲信息
      targetSlider: 0, //slider进度条当前进度(进度条百分比值)
      isPlay: false, //歌曲是否正在播放
      currentTimeStr: "", //当前播放时间(1:23形式)
      durationStr: "", //总时间(1:23形式)
      soundCurrent: 0, //声音slider进度条当前进度(进度条百分比值)
      fm: "", //私人fm标识,有值就播放fm,若到fm最后一首,fm会变化,从而调用play页面刷新新的fm歌曲
      isLike: false, //当前播放歌曲的喜欢状态
      contentHeight: 0, //子路由显示区域大小(不计算滚动条)
      userId: 0,
      showSkinMenu: false, //是否显示换肤页面
      darkModel:false,//是否为暗黑模式
      showDrawer:false,//小屏下是否显示左侧抽屉栏
      drawerSlideDistance:{//左侧抽屉滑动距离
        start:0,
        end:0
      }
    };
  },
  created() {
    this.userId = window.localStorage.getItem("userId");
    this.g.cookie = window.localStorage.getItem("cookie");
    if (this.g.cookie && this.userId) {
      this.g.userId=this.userId;
      this.alertShow = "none";
      this.getLikedList();
    }
  },
  mounted() {
    //监听audio
    var that = this;
    this.drawerHeight = window.innerHeight - this.$refs.header.offsetHeight;
    //设置歌单页面等页面还未加载时,loading的高度默认总高度-音乐设置区域(播放进度条区域)高度,并且设置区域宽度=右侧容器宽度
    this.contentHeight =
      this.drawerHeight - this.$refs.playSetting.offsetHeight;
    this.$refs.playSetting.style.width =
      this.$refs.playTuijian.offsetWidth + "px";
    this.g.loadingAllPageHeight =
      this.drawerHeight - this.$refs.playTuijian.offsetHeight;
    window.onresize = () => {
      this.contentHeight =
        this.drawerHeight - this.$refs.playSetting.offsetHeight;
      //窗口发生变化时音乐播放设置区域始终填满屏幕宽度
      this.$refs.playSetting.style.width =
        this.$refs.playTuijian.offsetWidth + "px";
      this.g.loadingAllPageHeight =
        this.drawerHeight - this.$refs.playTuijian.offsetHeight;
    };
    var audio = this.$refs.audio;
    //设置滚动条当前音量
    this.soundCurrent = audio.volume * 100;
    audio.addEventListener("timeupdate", function () {
      //嵌套的路由界面为歌词页面时, 才执行歌词页面获取当前播放时间方法
      if (that.$route.name == "play") {
        that.$refs.childRouter.getPlayTime(audio.currentTime);
      }
      that.targetSlider = (audio.currentTime / audio.duration) * 100;
      that.currentTimeStr =
        Math.floor(audio.currentTime / 60) +
        ":" +
        (Math.floor(audio.currentTime % 60) >= 10
          ? Math.floor(audio.currentTime % 60)
          : "0" + Math.floor(audio.currentTime % 60));
      that.durationStr =
        Math.floor(audio.duration / 60) +
        ":" +
        (Math.floor(audio.duration % 60) >= 10
          ? Math.floor(audio.duration % 60)
          : "0" + Math.floor(audio.duration % 60));
      //如果歌曲暂停,按钮图片切换
      if (audio.paused) {
        that.isPlay = false;
      } else {
        that.isPlay = true;
      }
    });
    audio.onended = function () {
      //播放下一首
      that.getSongUrl(
        that.nextSong.item.id,
        that.nextSong.item.ar,
        that.nextSong.item.al.name,
        that.nextSong.index
      );
    };
  },
  methods: {
    //登录
    login() {
      this.g
        .axios({
          method: "GET",
          url: this.g.host + "/login/cellphone",
          params: {
            phone: this.phone,
            password: this.pwd,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.alertShow = "none";
            //设置多个cookie值(由于网抑云的cookie始终设置无效,目前只能采用)
            var cookie = res.data.cookie;
            // cookie = cookie.split(" Path=/;");
            // cookie.forEach((item, i) => {
            //   if (item) {
            //     document.cookie = item + " Path=/;";
            //   }
            // });

            //document.cookie = "domain=" + document.domain;
            this.g.cookie = res.data.cookie;
            window.localStorage.setItem("cookie", cookie);
            this.g.userId=res.data.profile.userId;
            this.userId=this.g.userId
            console.log(this.g.userId);
            window.localStorage.setItem("userId", this.g.userId);
            this.getLikedList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取歌曲url,similarMsg为相似歌曲表示,其 comment为歌曲注释,name为歌名,在请求返回值的alias取到(只有相似歌曲才会用到)
    getSongUrl(id, singer, zhuanji, index, similarMsg) {
      console.log(id);
      //根据歌曲id获取歌曲名称和封面
      var pic = "",
        name = "",
        comment = "";
      if (similarMsg) {
        name = similarMsg.name;
        pic = similarMsg.pic;
      } else {
        for (var item of this.songList) {
          if (item.id == id) {
            //将名称,备注,歌曲url和歌曲封面,专辑设置成公共变量以便子路由获取
            name = item.name;
            comment = item.alia.join(); //歌曲注释
            pic = item.al.picUrl; //歌曲封面,实际上就是专辑封面
          }
        }
      }

      this.g
        .axios({
          url: this.g.host + "/song/url",
          params: {
            id: id,
          },
        })
        .then((res) => {
          console.log("歌曲url", res);
          this.musicId = id;
          this.song = res.data.data[0].url;
          this.g.getMusic(id, {
            name: name,
            comment: comment,
            pic: pic,
            musicUrl: res.data.data[0].url,
            br: res.data.data[0].br, //码率 无损, 高清等
            singer: singer, //歌手
            zhuanji: zhuanji, //专辑
            size: res.data.data[0].size, //歌曲大小
          });
          this.msg = this.g.music.msg;
          //获取到歌曲url后,获取歌曲的喜欢状态
          for (var i = 0; i <= this.g.likedMusic.length - 1; i++) {
            if (this.g.likedMusic[i] == id) {
              this.isLike = true;
              break;
            }
            if (i == this.g.likedMusic.length - 1) {
              this.isLike = false;
            }
          }
          // 刷新歌曲播放子路由页面
          if (this.$route.name == "play") {
            this.$refs.childRouter.refresh();
          }

          this.offset = 0;
          this.comments = [];

          //完成后,记录下一首歌曲,等待歌曲播放完成直接播放下一首,如果是最后一首,切换到第一首
          console.log("下一首", this.songList[index + 1]);
          if (!this.songList[index + 1]) {
            this.nextSong = {
              index: 0,
              item: this.songList[0],
            };
          } else {
            this.nextSong = {
              index: index + 1,
              item: this.songList[index + 1],
            };
          }
          //记录上一首歌曲,不存在上一首歌曲, 返回空,index返回-1
          if (!this.songList[index - 1]) {
            this.prevSong = {
              index: -1,
              item: {},
            };
          } else {
            this.prevSong = {
              index: index - 1,
              item: this.songList[index - 1],
            };
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //歌曲设置喜欢/取消喜欢
    liked() {
      this.isLike = this.isLike ? false : true;
      this.g
        .axios({
          url: this.g.host + "/like",
          params: {
            id: this.g.music.id, //要喜欢的id
            like: this.isLike, //如果喜欢状态为喜欢,则取消喜欢,否则为设定喜欢
          },
        })
        .then((res) => {
          console.log("歌曲喜欢/取消喜欢", res);
          if (res.data.code == 200) {
            //设置该歌曲为喜欢/不喜欢(按钮变色)
            for (var i = 0; i <= this.songList.length - 1; i++) {
              if (this.songList[i].id == this.g.music.id) {
                this.songList[i].liked = this.isLike;
                console.log(this.songList[i].liked);
                break;
              }
            }
            //喜欢的将歌曲添加到likedMusic数组中, 用户切换歌单或者搜索歌曲时不用再次请求
            if (this.isLike) {
              //添加
              this.g.likedMusic.push(this.g.music.id);
            } else {
              //去除
              this.g.likedMusic = this.g.likedMusic.filter((item, i) => {
                return item != this.g.music.id;
              });
            }
            console.log(this.g.likedMusic);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //关闭歌单弹框
    cancel() {
      this.playShow = false;
    },
    //歌曲播放/暂停按钮
    playOrPause() {
      if (this.isPlay) {
        this.$refs.audio.pause();
      } else {
        this.$refs.audio.play();
      }
    },
    //上一首
    prev() {
      if (this.prevSong.index != -1) {
        this.getSongUrl(
          this.prevSong.item.id,
          this.prevSong.item.ar,
          this.prevSong.item.al.name,
          this.prevSong.index
        );
      } else {
        alert("已经是第一首了");
      }
    },
    //下一首
    next() {
      if (this.nextSong.index != 0) {
        this.getSongUrl(
          this.nextSong.item.id,
          this.nextSong.item.ar,
          this.nextSong.item.al.name,
          this.nextSong.index
        );
      } else {
        //有私人fm标识则刷新fm歌曲
        if (this.fm) {
          this.fm++;
        } else {
          alert("已经是最后一首了");
        }
      }
    },
    //进度条值改变(拖动)的change事件,值为this.targetSlider(进度条百分比值)
    sliderChange(res) {
      this.$refs.audio.currentTime = (res / 100) * this.$refs.audio.duration;
    },
    //声音进度条值改变(拖动)的change事件
    soundChange(res) {
      this.$refs.audio.volume = res / 100;
    },
    //获取歌单页面传来的歌曲列表
    getplaylistSongList(songList, fm) {
      this.songList = songList;
      this.fm = fm;
      if (this.fm) {
        this.getSongUrl(
          this.songList[0].id,
          this.songList[0].ar,
          this.songList[0].al.name,
          0
        );
      }
      this.g.print("歌曲列表", songList);
    },
    //获取歌单页面点击获得到的歌曲url
    getplaylistSongMsg(id, singer, zhuanji, index, similarMsg) {
      this.getSongUrl(id, singer, zhuanji, index, similarMsg);
    },
    //获取喜欢的音乐列表
    getLikedList() {
      this.g
        .axios({
          url: this.g.host + "/likelist",
          params: {
            uid: window.localStorage.getItem("userId"),
          },
          // header:{
          //   "Content-Type":"application/x-www-form-urlencoded"
          // }
        })
        .then((res) => {
          console.log("获取喜欢的音乐id", res);
          this.g.getLikedMusic(res.data.ids);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //换肤
    changeSkin(e) {
      e.stopPropagation();
      if(this.showSkinMenu){
        this.showSkinMenu = false;
      }else{
        this.showSkinMenu = true;
      }
      
    },
    //小屏下左侧抽屉显示
    drawerShow(){
      if(this.showDrawer){
        this.showDrawer=false
      }else{
        this.showDrawer=true
      }
    },
    // 抽屉滑动开始事件,获取鼠标点下的x坐标
    slideStart(e){
      e.stopPropagation()
      this.drawerSlideDistance.start=e.clientX
    },
    slideEnd(e){
       e.stopPropagation()
      this.drawerSlideDistance.end=e.clientX;
      if(this.drawerSlideDistance.start-this.drawerSlideDistance.end>80){
        this.showDrawer=false;
      }
    }
  },
  watch: {
    darkModel(){
      this.$emit('getDarkModel',this.darkModel)
    }
  },
};
</script>

<style scoped>
@media screen and (min-width: 1367px) {
  .leftDrawer {
    width: 25rem !important;
  }
  .play-tuijian {
    width: calc(100% - 25rem) !important;
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
  .leftDrawer{
    width: 20rem !important;
  }
  .play-tuijian {
    width: calc(100% - 20rem) !important;
  }
}
/* 平板尺寸 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .leftDrawer{
    width: 18rem !important;
  }
  .play-tuijian {
    width: calc(100% - 18rem) !important;
  }
}
/* 767一下屏幕,左侧菜单栏消失,改为在header栏显示 */
@media screen  and (max-width: 767px) {
  .leftDrawer{
    position: absolute;
    width: 80% !important;
    left: -80%;
    transition: left 0.3s ease-in-out;
    z-index: 10;
  }
  .play-tuijian {
   width:100% !important;
   height: calc(100% - 4rem) !important;
  }
  .header{
    display: flex;
    justify-content: space-between;
  }
  .header-menu{
    float: none !important;
    display: inline-block;
  }
  .header.clearfix:after{
    display: none !important;
  }
  .header-logo{
    display: none !important;
  }
  .header-showDrawerBtn{
    display: block !important;
  }
  .showDrawer{
    left: 0;
  }
}

.login-alert {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40rem;
  height: 40rem;
  z-index: 100;
  background: rgb(209, 205, 205);
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
.login-alert-title {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 2.2rem;
}
.login-alert-form {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-alert-form input {
  display: block;
  width: 80%;
  margin: 1.3rem auto;
  height: 2.5rem;
  padding: 0 10px;
  border: 0;
  border-radius: 3px;
}
.login-alert-btn {
  width: 100%;
  position: absolute;
  bottom: 10%;
  text-align: center;
}
.login-alert-btn button {
  width: 8rem;
  height: 2.5rem;
  font-size: 1.1rem;
  border-radius: 20px;
  border: 0;
  cursor: pointer;
}
.login-alert-btn button:first-child {
  margin-right: 3rem;
  background: #20a0ff;
  color: white;
}
.play-tuijian {
  position: relative;
}
.play-tuijian,
.play-setting {
  width: calc(100% - 35rem);
}

.play-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50rem;
  height: 50rem;
  padding: 1rem;
  background: rgb(224, 224, 224, 0.8);
  border-radius: 20px;
}
.play-alert-cancel {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  cursor: pointer;
}
.play-alert-titleContent {
  height: 8rem;
  overflow: hidden;
  margin-bottom: 1.2rem;
}
.play-alert-titleContent-img {
  width: 8rem;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 50%;
}
.play-alert-titleContent-title {
  width: calc(100% - 8rem);
  height: 100%;
  padding-left: 1rem;
}
.play-alert-titleContent-title:first-child {
  margin-bottom: 20px;
}
.play-alert-titleContent-img,
.play-alert-titleContent-title {
  float: left;
}
.play-alert-list {
  height: calc(100% - 8rem);
  overflow: auto;
}
.play-alert-list table {
  width: 100%;
  overflow: auto;
  border-collapse: collapse;
}
.play-alert-list table td {
  height: 2rem;
  border: 1px solid gray;
  padding: 0 5px;
}
/* 左侧可伸缩的抽屉 */
.leftDrawer,
.play-tuijian {
  float: left;
  overflow: hidden;
}
/* 页面头部区域 */
.header {
  width: 100%;
  height: 4rem;
  text-align: center;
  background-image:linear-gradient(to right, pink , #40efff);
  line-height: 4rem;
}
.header-showDrawerBtn{
  display: none ;
  font-size: 1.5rem;
  padding-right: 2rem;
}
.header-logo,
.header-showDrawerBtn {
  float: left;
  padding-left: 2rem;
}
.header-menu {
  float: right;
}
.header-menu > a {
  float: left;
  padding: 0 1rem;
  cursor: pointer;
}
.header-menu-search img {
  width: 1.4rem;
  height: 1.4rem;
  vertical-align: middle;
}
.play-tuijian {
  padding-bottom: 8rem;
}
.leftDrawer {
  background: rgb(224, 224, 224);
}
.play-alert-list-singer:not(:last-child):after {
  content: ", ";
}
.play-setting {
  position: fixed;
  bottom: 0;
  height: 8rem;
  background-image:linear-gradient(to right, pink , #40efff);
}
.play-setting-songImg {
  float: left;
  width: 8rem;
  height: 8rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.play-settings-title,
.play-settings-sliderContent,
.play-settings-controll {
  float: left;
  width: calc(100% - 11rem);
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}
.play-settings-sliderContent {
  position: relative;
  height: 2.5rem;
}
.play-settings-sliderContent-currentTime,
.play-settings-sliderContent-endTime,
.play-settings-sliderContent-slider {
  display: inline-block;
  vertical-align: middle;
}
.play-settings-sliderContent-currentTime,
.play-settings-sliderContent-endTime {
  width: 3.5rem;
}
.play-settings-sliderContent-currentTime {
  padding-right: 0.5rem;
  text-align: right;
}
.play-settings-sliderContent-endTime {
  padding-left: 0.5rem;
}
.play-settings-sliderContent-slider {
  width: calc(100% - 7rem);
}
.play-settings-title {
  height: 2rem;
}
.play-settings-title span {
  font-size: 1.2rem;
  line-height: 2rem;
  vertical-align: middle;
}

.play-settings-controll {
  height: 3.5rem;
}
.play-settings-controll img {
  vertical-align: middle;
  width: 3rem;
  height: 3rem;
  margin-right: 1rem;
}
.play-settings-controll .isLike {
  margin-left: 1rem;
}
.play-settings-controll-soundSlider {
  display: inline-block;
  width: 10rem;
  vertical-align: middle;
}
.play-settings-sliderContent .el-slider__button-wrapper {
  transition: left 0.5s linear;
}
.leftDrawer-title {
  padding: 1rem 2rem;
}
.leftDrawer-btns {
  height: 5rem;
  padding: 0 0.5rem;
  cursor: pointer;
}
.leftDrawer-btns span,
.leftDrawer-btns img {
  display: inline-block;
  vertical-align: middle;
  line-height: 5rem;
}
.leftDrawer-btns img {
  width: 1.4rem;
  height: 1.4rem;
  margin-right: 0.5rem;
}
.search-content {
  cursor: default;
}
/* 换肤菜单 */
.changeSkinMenu {
  position: absolute;
  right: 1.5rem;
  top: 4rem;
  background: #efefef;
  width: 15rem;
  height: 5rem;
  border-radius: 5px;
  z-index: 10000;
  justify-content: space-around;
  align-items: center;
}

</style>