<template>
  <div class="content" ref="content" @scroll="loadComment">
    <div class="music-content clearfix">
      <!-- 歌曲标题 -->
      <div class="music-content-title" ref="title">
        <div class="music-content-geciContent-title">
          <span>{{ msg.name }}</span>
          <span
            >&nbsp;{{
              msg.br >= 999000 ? "无损" : msg.br >= 320000 ? "高清" : "标清"
            }}&nbsp;</span
          >
          <span>{{ getMusicSize(msg.size) }}</span>
        </div>
        <div class="music-content-geciContent-comment" v-if="msg.comment">
          <span>{{ msg.comment }}</span>
        </div>
        <div class="music-content-geciContent-singer">
          <span class="music-content-geciContent-singer-zhuanji">
            <label>专辑:&nbsp;</label>
            <label>{{ msg.zhuanji }}</label>
          </span>
          <span class="music-content-geciContent-singer-singer">
            <label>&nbsp;&nbsp;歌手:&nbsp;</label>
            <label v-for="(itemj, j) of msg.singer" :key="j"
              >{{ itemj.name }}&nbsp;&nbsp;</label
            >
          </span>
        </div>
      </div>
      <!-- 音乐特效,图片旋转以及弹幕区域 -->
      <div
        class="music-content-picContent"
        :class="{ mobileLyricsHide: mobileLyricsShow }"
      >
        <div class="music-content-picContent-p">
          <div
            class="music-content-picContent-pic"
            :class="{ 'music-content-picContent-picTurn': isPlay }"
            :style="{ backgroundImage: 'url(' + msg.pic + ')' }"
          ></div>
        </div>
      </div>
      <!-- 歌词区域 -->
      <div
        class="music-content-geciContent"
        :class="{ mobileLyricsHide: !mobileLyricsShow }"
      >
        <!-- :style="{ height: `calc( 100% - ${lyricHeight}px)` }"-->
        <div class="music-content-geciContent-lyric" ref="lyric">
          <div
            v-for="(item, i) of lyricList"
            :key="i"
            :data-time="item.time"
            :class="{ 'music-content-geciContent-lyric-active': item.light }"
            :data-offset="item.offset"
          >
            <div>{{ item.str }}</div>
            <div v-if="item.tranStr">{{ item.tranStr }}</div>
          </div>
        </div>
      </div>
      <!-- 手机端出现底部菜单,可点击查看歌词, 评论等 -->
      <div class="music-content-mobMenu">
        <!-- 歌词 -->
        <span @click="showOrHideLyrics"></span>
        <!-- 评论 -->
        <span @click="showOrHideComments"></span>
        <!-- 相似 -->
        <span @click="showSim"></span>
      </div>
    </div>
    <div
      class="commentCon"
      :style="{ top: mobileCommentsShow ? '10rem' : '100%' }"
    >
      <!-- 手机端展示的评论区域关闭按钮 -->
      <!-- <div class="commentCom-cancel">
        <span class="el-icon-close" @click="showOrHideComments"></span>
      </div> -->
      <!-- <comment-and-similar
        class="commentComp"
        :class="{ onlySimilarShow: mobileSimShow }"
        :id="musicId"
        type="0"
        @similarSong="getsongMsg"
      ></comment-and-similar> -->
      <comment-component
        class="comment-comp"
        ref="comment"
        :class="{ onlySimilarShow: mobileSimShow }"
        :id="musicId"
        type="0"
        @getCommentId="getCommentId"
      ></comment-component>
      <!-- 相似歌曲 -->
      <div class="similar-content">
        <div class="comment-content-title">
          <span>相似的歌曲</span>
        </div>
        <div class="similar-songs">
          <div
            class="similar-songs-item clearfix"
            v-for="(item, i) of similarSongs"
            :key="i"
            @click="
              playSimilarSong(
                item.id,
                item.artists,
                item.album.name,
                0,
                item.name,
                item.album.picUrl
              )
            "
          >
            <img v-lazy="item.album.picUrl" alt="相似音乐图片" />
            <div class="similar-songs-item-msg">
              <div>{{ item.name }}</div>
              <div>
                <span
                  class="playlist-list-singer"
                  v-for="(itemj, j) of item.artists"
                  :key="j"
                  >{{ itemj.name }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论回复内容区域 -->
    <el-drawer
      :visible.sync="drawer"
      size="70%"
      direction="btt"
      custom-class="comment-drawer"
      @opened="drawerOpen"
    >
      <comment-component
        ref="replyComment"
        :id="musicId"
        type="0"
        :commentId="commentId"
        :isReply="true"
      ></comment-component>
    </el-drawer>
  </div>
</template>

<script>
// import commentAndSimilar from "../components/commentAndSimilar.vue";
import commentComponent from "../components/commentComponent.vue";
export default {
  props: ["fm", "isPlay"], //fm标识,歌曲是否正在播放
  data() {
    return {
      msg: {},
      lyricList: [],
      //lyricHeight: 0,
      playTime: 0, //歌曲当前播放时间
      comments: [], //歌曲评论
      danmuList: [], //弹幕数组
      commentOffset: 0, //用于歌曲评论分页, 原理同sql语句的limit第一个值=( 评论页数 -1)*一页的评论数量
      ctx: "", //canvas 2d实例
      commentSum: 0, //评论总数
      page: 1, //当前评论页数
      pageCount: 1, //总页数
      pageSize: 20, //一页 的数量
      FMArr: [], //fm
      similarSongs: [], //相似歌曲
      musicId: 0,
      mobileLyricsShow: false, //移动模式下是否显示歌词
      mobileCommentsShow: false, //移动模式下是否显示评论
      mobileSimShow: false, //移动模式下是否显示相似歌曲
      t: {
        //防抖定时器
        commet: "",
        reply: "",
      },
      similarSongs: [], //相似歌曲
      drawer: false, //评论回复抽屉的打开状态
      commentId: 0, //评论id
    };
  },
  created() {},
  mounted() {
    if (this.g.music.id) {
      this.refresh();
    }
    //有fm标识就加载fm
    if (this.$route.query.fm) {
      this.getFMs();
    }
    // 获取相似歌曲
    this.getSimilarSongs(this.musicId);
  },
  methods: {
    //用户点击要播放的音乐时,触发该方法, 刷新该页面
    refresh() {
      console.log(this.g.music);
      // 歌曲信息
      this.msg = this.g.music.msg;
      // 歌曲id
      this.musicId = this.g.music.id;
      console.log(this.musicId);
      //获取歌词
      this.getGeci(this.musicId);
      //获取歌曲评论
      this.comments = [];
      this.commentOffset = 0;
      //获取弹幕评论
      //this.getDiscuss(this.g.music.id,this.commentOffset,"danmu")
      //获取列表评论,默认第一页
      // this.getDiscuss(this.g.music.id, 0, "", this.pageSize);
      // // 获取相似歌曲
      this.getSimilarSongs(this.g.music.id);
      //vue 容器渲染完成触发
      this.$nextTick(() => {
        //计算歌词标题区域高度
        //this.lyricHeight = this.$refs.title.offsetHeight;
      });
    },
    //获取评论组件传来的相似歌曲,并传出歌曲信息
    getsongMsg(id, singer, zhuanji, index, similarMsg) {
      this.$emit("songMsg", id, singer, zhuanji, index, similarMsg);
    },
    // 从父路由中获得当前音乐播放时间
    getPlayTime(time) {
      this.playTime = time;
    },
    //获取fm
    getFMs() {
      //获取歌单歌曲详情
      this.g
        .axios({
          url: this.g.host + "/personal_fm",
        })
        .then((res) => {
          console.log("私人FM", res);
          var arr = res.data.data;
          //拼接成首页播放页需要的参数
          arr.forEach((item, i) => {
            item.al = item.album;
            item.alia = item.alias;
          });
          /**
           * fm歌曲刷新,若第一次加载的fm歌曲已听完,切换下一首歌曲自动在获取fm,但是获取频繁的话获取的还是原来的歌曲,
           * 所以做了判断,如果fm歌曲列表>0并且已在歌曲列表里的第一首歌曲id等于新加载的第一首歌曲id的话,歌曲列表不增加
           */
          if (this.FMArr.length > 0) {
            if (this.FMArr[0].id == arr[0].id) {
              return;
            }
          }
          this.FMArr = this.FMArr.concat(arr);
          this.$emit("songList", this.FMArr, this.fm ? this.fm : 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取歌词
    getGeci(id) {
      this.g
        .axios({
          url: this.g.host + "/lyric",
          params: {
            id: id,
          },
        })
        .then((res) => {
          console.log("歌词", res);
          if (res.data.lrc) {
            if (res.data.lrc.lyric) {
              this.lyricList = this.lyrics(
                res.data.lrc.lyric,
                res.data.tlyric.lyric
              );
            } else {
              console.log("纯音乐");
            }
          } else {
            console.log("纯音乐");
          }
          //dom渲染完成的回调, 也适合用于v-for渲染完成回调
          this.$nextTick(() => {
            //获取每个歌词的dom元素
            var domlist = this.$refs.lyric.children;
            var first = 0;
            for (var i = 0; i <= domlist.length - 1; i++) {
              if (i == 0) {
                //获取歌词距离歌词区域div顶部的距离
                first = domlist[i].offsetTop;
              }
              //歌词dom元素数量和歌词数组相同
              this.lyricList[i].offset = domlist[i].offsetTop - first;
            }
            //console.log(this.lyricList);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //截取歌词内容,形成歌词数组,已渲染歌词区域,lrc:歌词,tllrc:歌词翻译
    lyrics(lrc, tllrc) {
      if (lrc.length == 0) return;
      var lrcs = lrc.split("\n"); //用回车拆分成数组
      console.log(lrcs);
      var lyricList = [];
      lrcs.forEach((item, i) => {
        var tStr = item.substring(item.indexOf("[") + 1, item.indexOf("]")); //取[]间的内容(时间);
        var sStr = item.substring(item.indexOf("]") + 1);
        //console.log(sStr);
        //判断截取到的时间值是否为数字且不为空
        if (!isNaN(Number(tStr.split(":")[0])) && tStr.split(":")[0]) {
          //计算总时间(毫秒)

          lyricList.push({
            time: Number(tStr.split(":")[0]) * 60 + Number(tStr.split(":")[1]),
            str: sStr,
            light: false,
          });
        }
      });
      //歌词翻译插入歌词数组
      if (tllrc) {
        var lrcs = tllrc.split("\n"); //用回车拆分成数组
        var tranLyricList = [];
        lrcs.forEach((item, i) => {
          var tStr = item.substring(item.indexOf("[") + 1, item.indexOf("]")); //取[]间的内容(时间);
          var sStr = item.substring(item.indexOf("]") + 1);
          // console.log(sStr);
          //判断截取到的时间值是否为数字且不为空
          if (!isNaN(Number(tStr.split(":")[0])) && tStr.split(":")[0]) {
            tranLyricList.push({
              time:
                Number(tStr.split(":")[0]) * 60 + Number(tStr.split(":")[1]), //计算总时间(毫秒)
              str: sStr,
            });
          }
        });
        //比较翻译的歌词和未翻译的歌词,时间相同的添加翻译歌词属性
        lyricList.forEach((item, i) => {
          tranLyricList.forEach((itemj, j) => {
            if (item.time == itemj.time) {
              item.tranStr = itemj.str;
              return false;
            }
          });
        });
      }

      return lyricList;
    },
    //获取相似歌曲
    getSimilarSongs(id) {
      this.g
        .axios({
          url: this.g.host + "/simi/song",
          params: {
            id: id,
          },
        })
        .then((res) => {
          console.log("获取相似歌曲", res);
          this.similarSongs = res.data.songs;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //播放相似的歌曲
    playSimilarSong(id, singer, zhuanji, index, name, pic) {
      var similarMsg = { name: name, pic: pic };
      this.$store.commit("setMusicMsg", {
        id: id,
        singer: singer,
        zhuanji: zhuanji,
        index: index,
        similarMsg: similarMsg,
      });
      // this.$emit("songMsg", id, singer, zhuanji, index, similarMsg);
    },
    //点赞 评论id,是否点赞
    dianzan(commentId, liked, $event) {
      this.g
        .axios({
          url: this.g.host + "/comment/like",
          params: {
            id: this.g.music.id,
            cid: commentId, //评论id
            t: liked ? 0 : 1, //点赞或者取消点赞
            type: 0,
          },
        })
        .then((res) => {
          console.log("评论点赞", res);
          //200即点赞成功
          if (res.data.code == 200) {
            //在数组上修改点赞状态
            for (var i = 0; i <= this.comments.length - 1; i++) {
              if (this.comments[i].commentId == commentId) {
                //如果已经点赞则取消点赞
                if (liked) {
                  this.comments[i].liked = false;
                  this.comments[i].likedCount--;
                } else {
                  this.comments[i].liked = true;
                  this.comments[i].likedCount++;
                }
                break;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 返回歌曲大小, 转换位mb/kb
    getMusicSize(size) {
      var unit = "B";
      if (size / 1024 >= 1 && size / 1024 / 1024 < 1) {
        unit = "KB";
        return (size / 1024).toFixed(2) + unit;
      }
      if (size / 1024 / 1024 >= 1) {
        unit = "MB";
        return (size / 1024 / 1024).toFixed(2) + unit;
      }
      if (size / 1024 < 1) {
        return size + unit;
      }
    },
    //显示/关闭歌词
    showOrHideLyrics() {
      if (this.mobileLyricsShow) {
        this.mobileLyricsShow = false;
      } else {
        this.mobileLyricsShow = true;
        this.$nextTick(() => {
          //显示歌词时,重新获取每个歌词里歌词区域顶部的距离,解决移动端滚动条不移动的问题
          var domlist = this.$refs.lyric.children;
          var first = 0;
          for (var i = 0; i <= domlist.length - 1; i++) {
            if (i == 0) {
              //获取歌词距离歌词区域div顶部的距离
              first = domlist[i].offsetTop;
            }
            //歌词dom元素数量和歌词数组相同
            this.lyricList[i].offset = domlist[i].offsetTop - first;
          }
        });
      }
    },
    showOrHideComments() {
      if (this.mobileCommentsShow) {
        this.mobileCommentsShow = false;
        var t = setTimeout(() => {
          //动画结束后再显示评论区域
          this.mobileSimShow = false;
          clearTimeout(t);
        }, 300);
      } else {
        this.mobileCommentsShow = true;
      }
    },
    showSim() {
      this.mobileCommentsShow = true;
      this.mobileSimShow = true;
    },
    //滚动加载评论,滚动事件的方法
    loadComment() {
      this.t.commet && clearTimeout(this.t.commet);
      var that = this;
      this.t.commet = setTimeout(() => {
        this.$refs.comment.scrollLoad(that.$refs.content);
      }, 200);
    },
    //打开回复评论的抽屉
    drawerOpen() {},
    //歌曲评论组件点击查看回复后的事件,可获取评论id
    getCommentId(commentId) {
      this.drawer = true;
      this.commentId = commentId;
    },
    //时间戳返回年月日
    timeToStr(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var m =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      var d = date.getDate();
      var h = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
      var min =
        date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
      var s =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
      return y + "年" + m + "月" + d + "日" + " " + h + ":" + min + ":" + s;
    },
  },
  watch: {
    playTime() {
      for (var i = 0; i <= this.lyricList.length - 1; i++) {
        //当前播放时间大于歌词开始时间且小于下一个歌词开始时间并不为最后一个歌词时, 将改歌词点亮, 如果i!=0并且i<数组长度,就上移
        // if (i != 0) {
        //当读取到最后一个歌词时, 后面没歌词了,让其<=自身永远成立
        if (
          this.playTime >= this.lyricList[i].time &&
          this.playTime <=
            (this.lyricList[i + 1] ? this.lyricList[i + 1].time : this.playTime)
        ) {
          //  console.log(i,this.lyricList.length-1)
          for (var j = 0; j <= this.lyricList.length - 1; j++) {
            this.lyricList[j].light = false;
          }
          this.lyricList[i].light = true;
          //滚动距离=offset-歌词区域div高度的一半 先得当前歌词总是在中间
          this.$refs.lyric.scrollTo(
            0,
            this.lyricList[i].offset - this.$refs.lyric.offsetHeight / 2
          );
          //break;
        }
        //}
      }
    },
    fm() {
      this.getFMs();
    },
    $route(to, from) {
      //监听路由是否变化
      if (to.query.fm != from.query.fm) {
        this.getFMs();
      }
    },
  },
  components: {
    // commentAndSimilar,
    commentComponent,
  },
};
</script>

<style src='../css/views/play.css' scoped></style>
<style>
@media screen and (max-width: 767px) {
  .similar-content {
    display: none;
  }
  .comment-content {
    width: 100% !important;
  }
  .onlySimilarShow .comment-content {
    display: none;
  }
  .onlySimilarShow .similar-content {
    width: 100%;
    display: block;
  }
}
</style>