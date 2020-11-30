<template>
  <div class="comp-content" ref="compContent">
    <div class="commentAndSimilar">
      <div class="comment-content clearfix">
        <div class="comment-content-title">
          <span>听友评论</span>
          <span>总共{{ commentSum }}条评论</span>
        </div>
        <div class="comment-content-comments">
          <div
            class="comment-content-comments-item"
            v-for="(item, i) of comments"
            :key="i"
          >
            <!-- 用户头像 -->
            <img
              class="comment-content-comments-item-userImg"
              v-lazy="item.user.avatarUrl"
              @click="linkToUserPage(item.user.userId)"
            />
            <div class="comment-content-comments-item-userComment">
              <div>
                <span class="nickname" @click="linkToUserPage(item.user.userId)"
                  >{{ item.user.nickname }} :&nbsp;</span
                >
                <span class="commentContent">{{ item.content }}</span>
              </div>
              <div
                class="comment-content-comments-item-userComment-op clearfix"
              >
                <span>{{ timeToStr(item.time) }}</span>
                <div class="comment-content-comments-item-userComment-op-con">
                  <div class="zan">
                    <img
                      v-lazy="
                        item.liked
                          ? require('../img/zan.png')
                          : require('../img/unzan.png')
                      "
                      @click="dianzan(item.commentId, item.liked, $event)"
                    />
                    <span>{{ item.likedCount }}</span>
                  </div>
                  <span
                    class="aaa"
                    @click="publishCommentOrLook(item.commentId, pageSize)"
                    >查看/发表回复</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="comment-content-page">
          {{ commentLoadText }}
        </div>
      </div>
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
      @closed="drawerClose"
      @opened="drawerOpen"
    >
      <div class="commentReplied-content" ref="commentRepliedContent">
        <input class="commentInput" type="text" placeholder="评论..." />
        <div class="comment-content-title">
          <span style="padding: 0">回复({{ commentRepliedCount }})</span>
        </div>
        <div class="commentReplied-content-con">
          <div
            class="commentReplied-content-comments-item"
            v-for="(item, i) of commentRepliedArr"
            :key="i"
          >
            <!-- 用户头像 -->
            <img
              class="commentReplied-content-comments-item-userImg"
              v-lazy="item.user.avatarUrl"
            />
            <div class="commentReplied-content-comments-item-userComment">
              <div>
                <span class="nickname">{{ item.user.nickname }} :&nbsp;</span>
                <span class="commentContent">{{ item.content }}</span>
              </div>
              <div
                class="commentReplied-content-comments-item-userComment-op clearfix"
              >
                <span>{{ timeToStr(item.time) }}</span>
                <div
                  class="commentReplied-content-comments-item-userComment-op-con"
                >
                  <div class="zan">
                    <img
                      :src="
                        item.liked
                          ? require('../img/zan.png')
                          : require('../img/unzan.png')
                      "
                      @click="dianzan(item.commentId, item.liked, $event)"
                    />
                    <span>{{ item.likedCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="comment-content-page">
            {{ repliedLoadText }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  /**
   * type:歌曲/歌单/视频等的标识,
   * id:音乐/歌单id,
   * enableComment:是否加载评论
   */
  props: ["type", "id"],
  data() {
    return {
      commentSum: 0, //评论总数
      comments: [], //歌曲评论
      commentRepliedArr: [], //评论的回复
      commentRepliedCount: 0, //评论的回复总数
      page: 1, //当前评论页数
      repliedPage: 1, //当前回复页数
      pageSize: 30, //一页 的数量
      similarSongs: [], //相似歌曲
      drawer: false, //抽屉的打开状态
      commentLoadText: "", //评论的底部文字, 是显示加载中还是没有更多
      repliedLoadText: "", //回复的底部文字, 是显示加载中还是没有更多
      commentId: 0, //评论id,用于打开回复
    };
  },
  mounted() {
    var that = this;
    //获取列表评论,默认第一页
    this.getDiscuss(this.id, 0, this.pageSize);
    // 获取相似歌曲
    this.getSimilarSongs(this.id);
    var commentLoadStatus = false; //评论区域加载状态,防止滚动多次加载
    // 评论区域的滚动事件,当触底时,触发加载下一页的事件
    var t = "";
    this.$refs.compContent.addEventListener("scroll", function () {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        var scrollTopAndHeight = this.scrollTop + this.offsetHeight,
          scrollHeight = this.scrollHeight;
        //console.log(scrollTopAndHeight,scrollHeight - 20)
        // 增加20px的缓冲区域, 只要滚动过的距离加高度>内部滚动区域总高度-20,就加载数据
        //console.log(scrollTopAndHeight , scrollHeight - 20)
        if (scrollTopAndHeight > scrollHeight - 20 && !commentLoadStatus) {
          commentLoadStatus = true;
          that.page++;
          that.getDiscuss(
            that.id,
            (that.page - 1) * that.pageSize,
            that.pageSize,
            that.comments[that.comments.length - 1].time,
            () => {
              commentLoadStatus = false;
            }
          );
        }
      }, 100);
    });
  },
  methods: {
    //获取评论
    getDiscuss(id, offset, limit, before, success) {
      if (this.commentLoadText == "没有更多啦~") return;
      this.commentLoadText = "加载中...";
      var url = "/comment/music";
      switch (this.type) {
        case "0": //歌曲
          url = "/comment/music";
          break;
        // case '1':
        //    url="/comment/music";
        //   break;
        case "2": //歌单
          url = "/comment/playlist";
          break;
        case "3": //专辑
          url = "/comment/album";
          break;
        default:
          break;
      }
      this.g
        .axios({
          url: url,
          params: {
            id: id,
            offset: offset, //用于分页 , 等于( 评论页数 -1)*20
            limit: limit, //一页数量,最多100,默认20
            before: before, //取上一页最后一条的time,取超过100条评论时用,但是貌似没什么卵用
          },
        })
        .then((res) => {
          console.log("评论", res);
          var list = res.data.comments;
          //判断是否为我第一次加载,如果是, 则加载热门评论和总数, 若不是,则不获取热门评论
          if (offset == 0) {
            var hotList = res.data.hotComments; //热门评论
            this.commentSum = res.data.total;
            this.comments = hotList.concat(list); //热门评论在前面
          } else {
            this.comments = this.comments.concat(list);
          }
          if (list.length < this.pageSize) {
            this.commentLoadText = "没有更多啦~";
          }
          this.$nextTick(() => {
            if (success) success();
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
    // 查看或发表回复,参数:评论id
    publishCommentOrLook(commentId, limit, time, success) {
      this.commentId = commentId;
      this.drawer = true;
      if (this.repliedLoadText == "没有更多啦~") return;
      this.repliedLoadText = "加载中...";
      //加载评论的回复
      this.g
        .axios({
          url: this.g.host + "/comment/floor",
          params: {
            parentCommentId: this.commentId, //评论id
            id: this.id, //资源id
            type: this.type, //类型
            limit: limit, //一页数量,最多100,默认20
            time: time, //取上一页最后一条的time,取超过100条评论时用,但是貌似没什么卵用
          },
        })
        .then((res) => {
          console.log("获取该评论的回复", res);
          this.commentRepliedCount = res.data.data.totalCount; //回复总数
          this.commentRepliedArr = this.commentRepliedArr.concat(
            res.data.data.comments
          );
          if (res.data.data.comments.length < this.pageSize) {
            this.repliedLoadText = "没有更多啦~";
          }
          this.$nextTick(() => {
            if (success) success();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //打开回复的回调
    drawerOpen() {
      var that = this;
      var commentRepliedLoadStatus = false; //回复区域加载状态,防止滚动多次加载
      //this.$refs.commentRepliedContent.removeEventListener("scroll");
      // 回复区域的滚动事件,当触底时,触发加载下一页的事件
      this.$refs.commentRepliedContent.addEventListener("scroll", function () {
        var scrollTopAndHeight = this.scrollTop + this.offsetHeight,
          scrollHeight = this.scrollHeight;

        // 增加20px的缓冲区域, 只要滚动过的距离加高度>内部滚动区域总高度-20,就加载数据
        if (
          scrollTopAndHeight > scrollHeight - 20 &&
          !commentRepliedLoadStatus
        ) {
          commentRepliedLoadStatus = true;
          that.repliedPage++;
          that.publishCommentOrLook(
            that.commentId,
            that.pageSize,
            that.commentRepliedArr[that.commentRepliedArr.length - 1].time,
            () => {
              commentRepliedLoadStatus = false;
            }
          );
        }
      });
    },
    //关闭回复的回调
    drawerClose() {
      this.commentRepliedArr = [];
      this.commentRepliedCount = 0;
      this.repliedPage = 1;
      this.repliedLoadText = "加载中...";
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
    // 跳转到用户界面
    linkToUserPage(userId) {
      this.$router.push({
        path: "/personal",
        query: {
          userId: userId,
        },
      });
    },
    //播放相似的歌曲
    playSimilarSong(id, singer, zhuanji, index, name, pic) {
      var similarMsg = { name: name, pic: pic };
      this.$emit("similarSong", id, singer, zhuanji, index, similarMsg);
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
    id() {
      //获取列表评论,默认第一页
      this.commentLoadText = "加载中...";
      this.getDiscuss(this.id, 0, this.pageSize);
      // 获取相似歌曲
      this.getSimilarSongs(this.id);
    },
  },
};
</script>

<style scoped>
.comp-content {
  height: 100%;
  overflow: auto;
}

/* 评论区域 */
.comment-content {
  float: left;
  width: 70%;
  height: 100%;

  /* padding-top: 1.5rem; */
}

.comment-content-title {
  border-bottom: 1px solid gray;
  padding: 0.5rem 1rem;
  padding-top: 0;
}
.comment-content-title span:first-child {
  font-size: 1.5rem;
}
.comment-content-title span:last-child {
  padding-left: 1rem;
}
.comment-content-comments {
  padding: 1rem 0;
}
.comment-content-comments-item {
  width: 100%;
  display: inline-block;
  margin-bottom: 0.5rem;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #e3e3e3;
}
.comment-content-comments-item-userImg,
.comment-content-comments-item-userComment {
  display: inline-block;
  vertical-align: middle;
}

.comment-content-comments-item-userImg {
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
}
.comment-content-comments-item-userComment {
  width: calc(100% - 3rem);
  padding-left: 1rem;
  vertical-align: top;
}
.comment-content-comments-item-userComment .nickname {
  color: #409eff;
}
.comment-content-comments-item-userComment-op {
  margin-top: 0.5rem;
}
.comment-content-comments-item-userComment-op > span {
  float: left;
}
.comment-content-comments-item-userComment-op-con {
  float: right;
}
.comment-content-comments-item-userComment-op > span {
  float: left;
}

.comment-content-comments-item-userComment-op-con span,
.comment-content-comments-item-userComment-op .zan,
.comment-content-comments-item-userComment-op img {
  display: inline-block;
  vertical-align: middle;
}
.comment-content-comments-item-userComment-op-con .zan,
.comment-content-comments-item-userComment-op-con > span:not(:last-child) {
  padding-right: 1rem;
}
.comment-content-comments-item-userComment-op-con > span {
  cursor: pointer;
}
.comment-content-comments-item-userComment-op .zan img {
  width: 25px;
  cursor: pointer;
}
.comment-content-page {
  padding: 1rem 0;
  text-align: center;
}
.comment-content-page input {
  width: 5rem;
  height: 2.2rem;
  border: 1px solid rgb(204, 204, 204);
  border-radius: 5px;
}
.comment-content-page span {
  padding: 0 0.5rem;
}
.comment-content-page .btn,
.comment-content-page span,
.comment-content-page input {
  display: inline-block;
  vertical-align: middle;
}
/* 相似歌曲,最近听过的用户区域 */
.similar-content {
  float: left;
  width: 30%;
  padding-left: 0.8rem;
}
.similar-songs img {
  float: left;
  width: 5rem;
  height: 5rem;
}
.similar-songs-item {
  height: 5rem;
  margin: 0.3rem 0;
  padding: 0 0.1rem;
  cursor: pointer;
}
.similar-songs-item-msg {
  float: left;
  width: calc(100% - 5rem);
  padding-left: 0.3rem;
  height: 100%;
}
.similar-content .comment-content-title span {
  padding: 0;
}
.similar-songs-item-msg > div:first-child,
.similar-songs-item-msg > div:last-child {
  height: 2.5rem;
  line-height: 2.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.commentInput {
  width: 100%;
  border: 1px solid #e3e3e3;
  height: 2.3rem;
  border-radius: 2.3rem;
  padding: 0 5px;
}

.commentReplied-content {
  padding: 1rem;
  height: 100%;
  overflow: auto;
}
.commentReplied-content-comments-item {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid rgb(234, 234, 234);
}
.commentReplied-content-comments-item-userImg,
.commentReplied-content-comments-item-userComment {
  display: inline-block;
  vertical-align: middle;
}
.commentReplied-content-comments-item-userImg {
  width: 3rem;
  height: 3rem;
  border-radius: 3rem;
}
.commentReplied-content-comments-item-userComment {
  width: calc(100% - 3rem);
  padding-left: 1rem;
}
.commentReplied-content-comments-item-userComment .nickname {
  color: #409eff;
}
.commentReplied-content-comments-item-userComment-op {
  margin-top: 0.5rem;
}
.commentReplied-content-comments-item-userComment-op > span {
  float: left;
}
.commentReplied-content-comments-item-userComment-op-con {
  float: right;
}
.commentReplied-content-comments-item-userComment-op > span {
  float: left;
}

.commentReplied-content-comments-item-userComment-op-con span,
.commentReplied-content-comments-item-userComment-op .zan,
.commentReplied-content-comments-item-userComment-op img {
  display: inline-block;
  vertical-align: middle;
}
.commentReplied-content-comments-item-userComment-op-con .zan,
.commentReplied-content-comments-item-userComment-op-con
  > span:not(:last-child) {
  padding-right: 1rem;
}
.commentReplied-content-comments-item-userComment-op-con > span {
  cursor: pointer;
}
.commentReplied-content-comments-item-userComment-op .zan img {
  width: 25px;
  cursor: pointer;
}
</style>