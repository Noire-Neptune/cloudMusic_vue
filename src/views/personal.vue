<template>
  <div class="content">
    <preview-image-component ref="preview"></preview-image-component>
    <div class="personalMsg-content">
      <div
        class="personalMsg-content-backgroundImage"
        :style="{ backgroundImage: `url(${personalMsg.backgroundUrl})` }"
      ></div>
      <img
        class="personalMsg-content-touxiang"
        v-lazy="personalMsg.avatarUrl"
        @click="preview"
      />
      <div class="personalMsg-content-detail">
        <div class="personalMsg-content-detail-title">
          <span class="personalMsg-content-detail-title-name">{{
            personalMsg.nickname
          }}</span>
        </div>
        <div class="personalMsg-content-detail-data">
          <div>
            <p>{{ personalMsg.eventCount }}</p>
            <p>动态</p>
          </div>
          <div>
            <p>{{ personalMsg.follows }}</p>
            <p>关注</p>
          </div>
          <div>
            <p>{{ personalMsg.followeds }}</p>
            <p>粉丝</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 创建的歌单 -->
    <div class="personalMsg-content-detail-title">
      <span class="personalMsg-content-detail-title-name">创建的歌单</span>
    </div>
    <playlists-component
      :playLists="createdPlayList"
      :playListShow="playListShow"
      idKey="id"
      playCountKey="playCount"
      imgKey="coverImgUrl"
      nameKey="name"
    ></playlists-component>
    <!-- 收藏的歌单 -->
    <div class="personalMsg-content-detail-title">
      <span class="personalMsg-content-detail-title-name">收藏的歌单</span>
    </div>
    <playlists-component
      :playLists="favoritePlayList"
      :playListShow="playListShow"
      idKey="id"
      playCountKey="playCount"
      imgKey="coverImgUrl"
      nameKey="name"
    ></playlists-component>
  </div>
</template>

<script>
import playlistsComponent from "../components/playilistsComponent";
export default {
  data() {
    return {
      userId: 0, //用户id
      personalMsg: {},
      createdPlayList: [], //本用户创建的歌单
      favoritePlayList: [], //收藏的其他用户的歌单
      playListShow: false, //歌单是否已经淡入出现
    };
  },
  created() {},
  mounted() {
    this.userId = this.$route.query.userId;
    this.getPersonalMsg();
    this.getPlayList();
  },
  methods: {
    //获取个人信息
    getPersonalMsg() {
      this.g
        .axios({
          url: "/user/detail",
          params: {
            uid: this.userId,
          },
        })
        .then((res) => {
          console.log(res);
          this.personalMsg = res.data.profile;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 获取用户歌单
    getPlayList() {
      this.playListShow = false;
      this.g
        .axios({
          url: "/user/playlist",
          params: {
            uid: this.userId,
            limit: 10000, //一次性获取该用户所有歌单,另外, 一个用户也不可能收藏上千的歌单
          },
        })
        .then((res) => {
          console.log("用户歌单", res);
          var playList = res.data.playlist;
          //获取本用户创建的歌单和收藏的其他用户的歌单
          this.favoritePlayList = playList.filter((item, i) => {
            if (item.userId == this.userId) {
              this.createdPlayList.push(item);
            }
            return item.userId != this.userId;
          });
          this.$nextTick(() => {
            var t = setTimeout(() => {
              this.playListShow = true;
              clearTimeout(t);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    preview() {
      this.$refs.preview.show(this.personalMsg.avatarUrl);
    },
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      if (to.query.fm != from.query.fm) {
        this.getFMs();
      }
    },
  },
  components: {
    playlistsComponent,
  },
};
</script>

<style src='../css/views/personal.css' scoped></style>