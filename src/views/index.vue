<template>
  <div class="clearfix">
    <div class="leftDrawer" :style="{height:drawerHeight+'px'}">
      <audio :src="song" controls="controls" autoplay ref="audio"></audio>
      <!-- 歌单列表 -->
      <div class="play-list">
        <div
          class="play-list-item clearfix"
          v-for="(item,i) of playList"
          :key="i"
          @click="getPlayDetail(item.id)"
        >
          <div class="play-list-item-img" :style="{backgroundImage:'url('+item.coverImgUrl+')'}"></div>
          <div class="play-list-item-title">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="play-tuijian" :style="{height:drawerHeight+'px'}">
      <!-- 利用key值刷新子路由 -->
      <router-view ref="childRouter" :key="music"></router-view>
      <!-- 播放设置区域 -->
       <div class="play-setting clearfix">
         <div class="play-setting-songImg" :style="{backgroundImage:'url('+msg.pic+')'}"></div>
         <div  class="play-settings">
           <div  class="play-settings-title">
             <span>{{msg.name}}</span>
           </div>
           <div  class="play-settings-sliderContent">
            <span class="play-settings-sliderContent-currentTime">{{currentTimeStr}}</span>
            <el-slider class="play-settings-sliderContent-slider" v-model="targetSlider" @change="sliderChange"></el-slider>
            <span class="play-settings-sliderContent-endTime">{{durationStr}}</span>
           </div>
             <div class="play-settings-controll">
              <img src="../img/prev.png" @click="prev" />
              <img  :src="isPlay ? require('../img/pause.png') : require( '../img/play.png')" @click="playOrPause"/>
              <img src="../img/next.png" @click="next"/>
               <el-slider class="play-settings-controll-soundSlider" v-model="soundCurrent" @change="soundChange"></el-slider>
            </div>
         </div>
       </div>
    </div>

   
    <!-- 歌单列表弹框 -->
    <div class="play-alert" v-if="playShow">
      <div class="play-alert-cancel" @click="cancel">X</div>
      <div class="play-alert-titleContent clearfix">
        <div
          class="play-alert-titleContent-img"
          :style="{backgroundImage:'url('+playTitle.img+')'}"
        ></div>
        <div class="play-alert-titleContent-title">
          <div>{{playTitle.name}}</div>
          <div>{{playTitle.description}}</div>
        </div>
      </div>
      <div class="play-alert-list">
        <table>
          <thead>
            <tr>
              <td>歌曲名</td>
              <td>歌手</td>
              <td>专辑</td>
              <td>时长</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item,i) of songList"
              :key="i"
              @click="getSongUrl(item.id,item.ar,item.al.name,i)"
            >
              <td>{{item.name}}&nbsp;&nbsp;{{item.alia.join()}}</td>
              <td>
                <span
                  class="play-alert-list-singer"
                  v-for="(itemj,j) of item.ar"
                  :key="j"
                >{{itemj.name}}</span>
              </td>
              <td>{{item.al.name}}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <div class="login-alert" :style="{display:alertShow}">
      <div class="login-alert-title">请登录</div>
      <div class="login-alert-form">
        <input type="text" placeholder="请输入网易云音乐手机号..." v-model="phone" />
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
      playList: [], //用户歌单
      playTitle: {}, //歌单头部
      songList: [], //歌曲列表
      song: "",
      drawerHeight: 0, //左侧抽屉高度为屏幕高度
      comments: [],
      offset: 0,
      music: "", //单首音乐的相关信息,传给子路由
      nextSong: {},//存放下一首歌曲的信息
      prevSong:{},//存放上一首歌曲的信息
      msg:"",//存放歌曲信息
      targetSlider:0,//slider进度条当前进度(进度条百分比值)
      isPlay:false,//歌曲是否在播放状态
      currentTimeStr:"",//当前播放时间(1:23形式)
      durationStr:"",//总时间(1:23形式)
      soundCurrent:0//声音slider进度条当前进度(进度条百分比值)
    };
  },
  created() {
    this.drawerHeight = window.innerHeight;
    var userId = window.localStorage.getItem("userId");
    console.log(userId);
    if (userId) {
      this.g.getUserId(userId);
      this.alertShow = "none";
      this.getPlayList();
    }
  },
  mounted() {
    //监听audio
    var that = this;
    var audio = this.$refs.audio;
    //设置滚动条当前音量
    this.soundCurrent=audio.volume*100
    audio.addEventListener("timeupdate", function() {
      that.$refs.childRouter.getPlayTime(audio.currentTime);
      that.targetSlider=(audio.currentTime/audio.duration)*100;
      that.currentTimeStr=Math.floor(audio.currentTime/60)+":"+ (Math.floor(audio.currentTime%60) >=10 ? Math.floor(audio.currentTime%60) : "0"+Math.floor(audio.currentTime%60))
      that.durationStr=Math.floor(audio.duration/60)+":"+ (Math.floor(audio.duration%60) >=10 ? Math.floor(audio.duration%60) : "0"+Math.floor(audio.duration%60))
      //如果歌曲暂停,按钮图片切换
      if(audio.paused){
        that.isPlay=false
      }else{
         that.isPlay=true;
      }
    });
    audio.onended = function() {
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
    login() {
      //登录
      this.axios({
        method: "GET",
        url: this.g.host + "/login/cellphone",
        params: {
          phone: this.phone,
          password: this.pwd
        }
      })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.alertShow = "none";
            document.cookie = res.data.cookie;
            this.g.getUserId(res.data.profile.userId);
            console.log(this.g.userId);
            window.localStorage.setItem("userId", this.g.userId);
            //登录成功后, 获取用户歌单
            this.getPlayList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取用户歌单
    getPlayList() {
      this.axios({
        url: this.g.host + "/user/playlist",
        params: {
          uid: this.g.userId
        }
      })
        .then(res => {
          console.log("用户歌单", res);
          this.playList = res.data.playlist;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取歌单详情
    getPlayDetail(id) {
      console.log(id);
      this.axios({
        url: this.g.host + "/playlist/detail",
        params: {
          id: id
        }
      })
        .then(res => {
          console.log("歌单详情", res);
          //根据歌单id列表获取歌曲详情
          var trackIds = [];
          this.playTitle = {
            img: res.data.playlist.coverImgUrl, //封面
            name: res.data.playlist.name, //名称
            createTime: new Date(res.data.playlist.createTime), //创建时间
            description: res.data.playlist.description //介绍
          };
          for (var i = 0; i <= res.data.playlist.trackIds.length - 1; i++) {
            var item = res.data.playlist.trackIds[i];
            trackIds.push(item.id);
          }
          console.log(trackIds);
          this.getSongList(trackIds, () => {});
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取歌曲列表
    getSongList(trackIds, success) {
      this.axios({
        url: this.g.host + "/song/detail",
        params: {
          ids: trackIds.join()
        }
      })
        .then(res => {
          console.log("歌曲详情", res);
          this.playShow = true;
          this.songList = res.data.songs;
          success();

          //一次性请求所有歌单歌曲url
          var list = [];
          for (var item of this.songList) {
            list.push(item.id);
          }
          this.axios({
            url: this.g.host + "/song/url",
            params: {
              id: list.join(),
              br: 999000
            }
          })
            .then(res => {
              console.log("一次性请求所有歌曲url", res);
              //自动拨第一首
              //this.song = res.data.data[0].url;
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取歌曲url
    getSongUrl(id, singer, zhuanji, index) {
      console.log(id);
      //根据歌曲id获取歌曲名称和封面
      var pic = "",
        name = "",
        zhuanji = "",
        comment = "";
      for (var item of this.songList) {
        if (item.id == id) {
          //将名称,备注,歌曲url和歌曲封面,专辑设置成公共变量以便子路由获取
          name = item.name;
          comment = item.alia.join();
          zhuanji = item.al.name;
          pic = item.al.picUrl;
        }
      }
      this.axios({
        url: this.g.host + "/song/url",
        params: {
          id: id
        }
      })
        .then(res => {
          console.log("歌曲url", res);

          this.song = res.data.data[0].url;
          this.g.getMusic(id, {
            name: name,
            comment: comment,
            pic: pic,
            musicUrl: res.data.data[0].url,
            br: res.data.data[0].br, //码率 无损, 高清等
            singer: singer, //歌手
            zhuanji: zhuanji //专辑
          });
          this.msg=this.g.music.msg
          // 刷新歌曲播放子路由页面
          this.$refs.childRouter.refresh();
          this.offset = 0;
          this.comments = [];
          this.getDiscuss(id, this.offset);
          //完成后,记录下一首歌曲,等待歌曲播放完成直接播放下一首,如果是最后一首,切换到第一首
          console.log("下一首", this.songList[index + 1]);
          if (!this.songList[index + 1]) {
            this.nextSong = {
              index: 0,
              item: this.songList[0]
            };
          } else {
            this.nextSong = {
              index: index + 1,
              item: this.songList[index + 1]
            };
          }
          //记录上一首歌曲,不存在上一首歌曲, 返回空,index返回-1
          if (!this.songList[index - 1]) {
            this.prevSong = {
              index: -1,
              item:{}
            };
          } else {
            this.prevSong = {
              index: index - 1,
              item: this.songList[index - 1]
            };
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取歌曲评论
    getDiscuss(id, offset, limit, before) {
      this.axios({
        url: this.g.host + "/comment/music",
        params: {
          id: id,
          offset: offset, //用于分页 , 如 :( 评论页数 -1)*20
          limit: limit,
          before: before //取上一页最后一条的time
        }
      })
        .then(res => {
          console.log("歌曲评论", res);
          var list = res.data.comments;
          this.comments = this.comments.concat(list);
          console.log(this.comments);
          //一次性获取所有评论
          // if(this.comments.length>=res.data.total){
          //   console.log("得到所有评论",this.comments)
          // }else{
          //   this.offset+=100;
          //  this.getDiscuss(id,this.offset,100,list[list.length-1].time)
          // }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //关闭歌单弹框
    cancel() {
      this.playShow = false;
    },
    //歌曲播放/暂停按钮
    playOrPause(){
      if(this.isPlay){
        this.$refs.audio.pause()
      }else{
         this.$refs.audio.play()
      }
    },
    //上一首
    prev(){

      if(this.prevSong.index!=-1){
        this.getSongUrl(
        this.prevSong.item.id,
        this.prevSong.item.ar,
        this.prevSong.item.al.name,
        this.prevSong.index
      );
      }else{
        alert("已经是第一首了")
      }
      
    },
    //下一首
    next(){
      if(this.nextSong.index!=0){
        this.getSongUrl(
        this.nextSong.item.id,
        this.nextSong.item.ar,
        this.nextSong.item.al.name,
        this.nextSong.index
      );
      }else{
        alert("已经是最后一首了")
      }
    },
    //进度条值改变(拖动)的change事件,值为this.targetSlider(进度条百分比值)
    sliderChange(res){
      this.$refs.audio.currentTime=(res/100)* this.$refs.audio.duration
    },
      //声音进度条值改变(拖动)的change事件
    soundChange(res){
      console.log(res);
      this.$refs.audio.volume=res/100
    }
  }
};
</script>

<style scoped>
@import "../css/index.css";
</style>