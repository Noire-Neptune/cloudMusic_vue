<template>
  <!-- 歌单介绍组件 -->
  <div class="comp-content">
    <!-- 图片预览 -->
    <preview-image-component ref="preview"></preview-image-component>
    <div class="playlist">
      <!-- 歌单封面,介绍区域 -->
      <div class="playlist-titleContent clearfix">
        <div
          class="maoboli"
          :style="{ backgroundImage: 'url(' + introduceMsg.img + ')' }"
        ></div>
        <div
          class="playlist-titleContent-img"
          :style="{ backgroundImage: 'url(' + introduceMsg.img + ')' }"
          @click="preview"
        ></div>
        <div class="playlist-titleContent-title">
          <div>{{ introduceMsg.name }}</div>
          <div class="collect">
            <img
              class="userImg"
              v-lazy="introduceMsg.creatorImg"
              alt="用户头像"
              @click="enterUserDetail"
            />
            <span class="nickName" @click="enterUserDetail">{{
              introduceMsg.creatorNickName
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
          <div>{{ introduceMsg.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //props的数据是单向的,vue不建议修改props的属性,会报错误
  props: ["introduceMsg"], //歌单信息
  data() {
    return {
      isCollect: false, //收藏状态
    };
  },
  mounted() {},
  methods: {
    // 进入用户界面
    enterUserDetail() {
      this.$router.push({
        path: "/personal",
        query: {
          userId: this.introduceMsg.userId,
        },
      });
    },
    //收藏歌单
    collect() {
      this.g
        .axios({
          url: "/playlist/subscribe",
          params: {
            id: this.introduceMsg.id, //当前歌单id
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
      this.$refs.preview.show(this.introduceMsg.img);
    },
  },
  watch: {
    introduceMsg() {
      this.isCollect = this.introduceMsg.isCollected;
    },
    //监听音乐搜索框内容,若为空,恢复所有歌曲
    searchVal() {
      if (!this.searchVal) {
        this.songList = this.loadedsongList;
      }
    },
  },
};
</script>

<style scoped>
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
</style>