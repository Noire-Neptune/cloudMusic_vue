<template>
  <div class="clearfix" style="height: 100%">
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
      <el-switch v-model="darkModel" active-text="暗黑模式"> </el-switch>
    </div>
    <audio :src="song" autoplay ref="audio"></audio>
    <left-navigation
      class="leftDrawer"
      @songMsg="getplaylistSongMsg"
      @songList="getplaylistSongList"
    ></left-navigation>
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
          <img class="play-setting-songImg" v-lazy="msg.pic" />
        </router-link>
        <div class="play-settings">
          <div class="play-settings-title">
            <span>{{
              msg.name
                ? msg.name + "&nbsp;&nbsp;" + msg.comment
                : "从歌单里选择一首喜欢的歌曲吧~"
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
    <!-- <div class="login-alert" :style="{ display: alertShow }">
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
    </div> -->
  </div>
</template>

<script>
import leftNavigation from "../components/leftNavigation";
export default {
  data() {
    return {
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
      darkModel: false, //是否为暗黑模式
      showDrawer: false, //小屏下是否显示左侧抽屉栏
      drawerSlideDistance: {
        //左侧抽屉滑动距离
        start: 0,
        end: 0,
      },
    };
  },
  created() {
    this.userId = window.localStorage.getItem("userId");
    this.g.cookie = window.localStorage.getItem("cookie");
    if (this.g.cookie && this.userId) {
      this.g.userId = this.userId;
      this.getLikedList();
    } else {
      this.$router.push({
        path: "/login",
      });
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
          console.log("歌曲url", { ...res });
          this.musicId = id;
          this.song = res.data.data[0].url;
          this.msg = {
            name: name,
            comment: comment,
            pic: pic,
            musicUrl: res.data.data[0].url,
            br: res.data.data[0].br, //码率 无损, 高清等
            singer: singer, //歌手
            zhuanji: zhuanji, //专辑
            size: res.data.data[0].size, //歌曲大小
          };
          this.g.getMusic(id, this.msg);
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
            uid: this.userId,
          },
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
      if (this.showSkinMenu) {
        this.showSkinMenu = false;
      } else {
        this.showSkinMenu = true;
      }
    },
    //小屏下左侧抽屉显示
    drawerShow() {
      if (this.showDrawer) {
        this.showDrawer = false;
      } else {
        this.showDrawer = true;
      }
    },
  },
  watch: {
    darkModel() {
      this.$emit("getDarkModel", this.darkModel);
    },
    "$store.state.musicMsg"() {
      let msg = this.$store.state.musicMsg;
      console.log(msg);
      this.getSongUrl(
        msg.id,
        msg.singer,
        msg.zhuanji,
        msg.index,
        msg.similarMsg
      );
    },
  },
  components: {
    leftNavigation,
  },
};
</script>

<style  scoped src='../css/views/index.css'></style>