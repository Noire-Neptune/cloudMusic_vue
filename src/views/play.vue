<template>
  <div class="content">
    <div class="music-content clearfix">
      <!-- 音乐特效,图片旋转以及弹幕区域 -->
      <div class="music-content-picContent">
        <div class="music-content-picContent-p">
          <div
            class="music-content-picContent-pic"
            :class="{'music-content-picContent-picTurn':turn}"
            :style="{backgroundImage:'url('+msg.pic+')'}"
          ></div>
        </div>
        
      </div>
      <!-- 标题区域 -->
      <div class="music-content-geciContent">
        <div ref="title">
          <div class="music-content-geciContent-title">
            <span>{{msg.name}}</span>
            <span>&nbsp;{{msg.br>=999000 ? '无损' : msg.br>=320000 ? '高清' : '标清'}}&nbsp;</span>
          </div>
          <div class="music-content-geciContent-comment" v-if="msg.comment">
            <span>{{msg.comment}}</span>
          </div>
          <div class="music-content-geciContent-singer">
            <span class="music-content-geciContent-singer-zhuanji">
              <label>专辑:&nbsp;</label>
              <label>{{msg.zhuanji}}</label>
            </span>
            <span class="music-content-geciContent-singer-singer">
              <label>&nbsp;&nbsp;歌手:&nbsp;</label>
              <label v-for="(itemj,j) of msg.singer" :key="j">{{itemj.name}}&nbsp;&nbsp;</label>
            </span>
          </div>
        </div>
        <!-- 歌词区域 -->
        <div
          class="music-content-geciContent-lyric"
          :style="{height:`calc( 100% - ${lyricHeight}px`}"
          ref="lyric"
        >
          <div
            v-for="(item,i) of lyricList"
            :key="i"
            :data-time="item.time"
            :class="{'music-content-geciContent-lyric-active':item.light}"
            :data-offset="item.offset"
          >
            <div>{{item.str}}</div>
            <div v-if="item.tranStr">{{item.tranStr}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-content">
      <div class="comment-content-title">
        <span>听友评论</span><span>总共{{commentSum}}条评论</span>
      </div>
      <div class="comment-content-comments">
        <div class="comment-content-comments-item" v-for="(item,i) of comments" :key="i">
          <!-- 用户头像 -->
          <img class="comment-content-comments-item-userImg" :src="item.user.avatarUrl" />
          <div class="comment-content-comments-item-userComment">
           <div> <span class="nickname">{{item.user.nickname}} :&nbsp;</span><span class="commentContent">{{item.content}}</span></div>
           <div class="comment-content-comments-item-userComment-op">
             <span>{{timeToStr(item.time)}}</span>
           </div>
          </div>
        </div>
      </div>
      <div class="comment-content-page">
        <el-button class="btn" type="primary" size="small" @click="firstPage">首页</el-button>
        <el-button class="btn" type="primary" size="small" @click="prevPage">上一页</el-button>
        <el-button class="btn" type="primary" size="small" @click="nextPage">下一页</el-button>
        <el-button class="btn" type="primary" size="small" @click="lastPage">尾页</el-button>
        <span>跳转至</span><input v-model="page" placeholder="请输入页数" type="text" /><span>页, 当前第{{pageCount}}页</span>
        <el-button class="btn" type="primary" size="small" @click="jumpPage">Go</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: {},
      turn: false,
      lyricList: [],
      lyricHeight: 0,
      playTime: 0,//歌曲当前播放时间
      comments:[],//歌曲评论
      danmuList:[],//弹幕数组
      commentOffset:0,//用于歌曲评论分页, 原理同sql语句的limit第一个值=( 评论页数 -1)*一页的评论数量
      ctx:"",//canvas 2d实例
      commentSum:0,//评论总数
      page:1,//当前评论页数
      pageCount:1,//总页数
      pageSize:20,//一页 的数量
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    //用户点击要播放的音乐时,触发该方法, 刷新该页面
    refresh() {
      console.log(this.g.music);

      this.msg = this.g.music.msg;
      // 开始旋转
      this.turn = true;
      //获取歌词
      this.getGeci(this.g.music.id);
      //获取歌曲评论
      this.comments=[];
      this.commentOffset=0;
      //获取弹幕评论
      //this.getDiscuss(this.g.music.id,this.commentOffset,"danmu")
      //获取列表评论,默认第一页
      this.getDiscuss(this.g.music.id,0,"",this.pageSize)
      //vue 容器渲染完成触发
      this.$nextTick(() => {
        //计算歌词标题区域高度
        this.lyricHeight = this.$refs.title.offsetHeight;
      });
    },
    // 从父路由中获得当前音乐播放时间
    getPlayTime(time) {
      this.playTime = time;
    },
    //获取歌曲评论 op为操作,判断调用该方法获取评论是为了渲染弹幕还是评论,为空则获取评论
    getDiscuss(id, offset,op,limit, before) {
      this.axios({
        url: this.g.host + "/comment/music",
        params: {
          id: id,
          offset: offset, //用于分页 , 如 :( 评论页数 -1)*20
          limit: limit,//一页数量,最多100,默认20
          before: before //取上一页最后一条的time,取超过100条评论时用,但是貌似没什么卵用
        }
      })
        .then(res => {
          console.log("歌曲评论", res);
          var list = res.data.comments; 
          this.commentSum=res.data.total;
          this.pageCount=Math.ceil(this.commentSum/this.pageSize)
          if(op=="danmu"){
            this.danmuList=this.danmuList.concat(list);
            this.$nextTick(()=>{
              this.initDanmu()
            })
          }else{
             this.comments = list;
          }
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
    //获取歌词
    getGeci(id) {
      this.axios({
        url: this.g.host + "/lyric",
        params: {
          id: id
        }
      })
        .then(res => {
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
            //console.log(this.$refs.lyric.children);
            var domlist = this.$refs.lyric.children;
            var first = 0;
            for (var i = 0; i <= domlist.length - 1; i++) {
              if (i == 0) {
                first = domlist[i].offsetTop;
              }
              //歌词dom元素数量和歌词数组相同
              this.lyricList[i].offset = domlist[i].offsetTop - first;
            }
            console.log(this.lyricList);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //截取歌词内容,lrc:歌词,tllrc:歌词翻译
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
            light: false
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
              str: sStr
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
      console.log(lyricList);

      return lyricList;
    },
    initDanmu(){},
    //首页按钮
    firstPage(){
      this.page=1;
      this.getDiscuss(this.g.music.id,0,"",this.pageSize)
    },
    //跳页
    jumpPage(){
      this.getDiscuss(this.g.music.id,(this.page-1)*this.pageSize,"",this.pageSize)
    },
    prevPage(){
      if(this.page<=1){
        alert("已经是第一页了")
        return;
      }
      this.page--;
      this.getDiscuss(this.g.music.id,(this.page-1)*this.pageSize,"",this.pageSize)
    },
    nextPage(){
      if(this.page>=this.pageCount){
        alert("已经是第最后一页了");
        return;
      }
      this.page++;
      this.getDiscuss(this.g.music.id,(this.page-1)*this.pageSize,"",this.pageSize)
    },
    lastPage(){
      this.page=this.pageCount;
       this.getDiscuss(this.g.music.id,(this.page-1)*this.pageSize,"",this.pageSize)
    },
    //时间戳返回年月日
    timeToStr(time){
      var date=new Date(time);
      var y=date.getFullYear();
      var m=date.getMonth()+1 >=10 ? date.getMonth()+1 : "0"+(date.getMonth()+1);
      var d=date.getDate();
      var h=date.getHours() >=10 ? date.getHours() : "0"+date.getHours();
      var min=date.getMinutes() >=10 ? date.getMinutes() : "0"+date.getMinutes();
      var s=date.getSeconds() >=10 ? date.getSeconds() : "0"+date.getSeconds();
      return y+"年"+m+"月"+d+"日"+" "+h+":"+min+":"+s
    }
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


    }
  }
};
</script>

<style scoped>
@import "../css/play.css";
</style>