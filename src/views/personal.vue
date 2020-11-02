<template>
  <div class="content">
    <div class="personalMsg-content">
      <img class="personalMsg-content-touxiang" :src="personalMsg.avatarUrl" />
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
    <div class="created-playlist clearfix">
      <div
        class="created-playlist-item"
        v-for="(item, i) of createdPlayList"
        :key="i"
      >
        <router-link :to="{ name: 'playlist', query: { id: item.id } }">
          <div class="listener-num"><img src="../img/listen.png"><label>{{item.playCount}}</label></div>
          <img :src="item.coverImgUrl" />
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>
    <!-- 收藏的歌单 -->
    <div class="personalMsg-content-detail-title">
          <span class="personalMsg-content-detail-title-name">收藏的歌单</span>
        </div>
    <div class="favorite-playlist clearfix">
      <div
        class="favorite-playlist-item"
        v-for="(item, i) of favoritePlayList"
        :key="i"
      >
        <router-link :to="{ name: 'playlist', query: { id: item.id } }">
          <div class="listener-num"><img src="../img/listen.png"><label>{{item.playCount}}</label></div>
          <img :src="item.coverImgUrl" />
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId:0,//用户id
      personalMsg: {},
      createdPlayList: [], //本用户创建的歌单
      favoritePlayList: [], //收藏的其他用户的歌单
    };
  },
  created() {},
  mounted() {
    this.userId=this.$route.query.userId;
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
      this.g
        .axios({
          url: "/user/playlist",
          params: {
            uid: this.userId,
            limit:10000//一次性获取该用户所有歌单,另外, 一个用户也不可能收藏上千的歌单
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
        })
        .catch((err) => {
          console.log(err);
        });
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
};
</script>

<style scoped>
@media screen and (min-width: 1921px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 12.5%;
    padding: 0 calc(6.25% - 5rem);
  }
}
@media screen and (min-width: 1601px) and (max-width: 1920px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 12.5%;
    padding: 0 calc(6.25% - 5rem);
  }
}
@media screen and (min-width: 1367px) and (max-width: 1600px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 16.666%;
    padding: 0 calc(8.333% - 5rem);
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 16.666%;
    padding: 0 calc(8.333% - 5rem);
  }
}
/* 平板尺寸 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 25%;
    padding: 0 calc(12.5% - 5rem);
  }
}
@media screen and (min-width: 450px) and (max-width: 767px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 33.3333%;
    padding: 0 calc(16.6665% - 5rem);
  }
}
@media screen and (max-width: 449px) {
  .created-playlist-item,
  .favorite-playlist-item {
    width: 50%;
    padding: 0 calc(25% - 5rem);
  }
}
.content {
  padding: 1.5rem;
  height: 100%;
  overflow: auto;
}
.personalMsg-content {
  height: 20rem;
}
.personalMsg-content-touxiang,
.personalMsg-content-detail {
  display: inline-block;
  vertical-align: middle;
}
.personalMsg-content-touxiang {
  width: 15rem;
  height: auto;
  border-radius: 50%;
  transform: scale(0.75, 0.75);
}
.personalMsg-content-detail {
  width: calc(100% - 15rem);
  padding: 1rem;
  height: 100%;
}
.personalMsg-content-detail-title {
  border-bottom: 1px solid #e3e3e3;
  padding: 0.5rem;
  padding-top: 0;
}
.personalMsg-content-detail-title-name {
  font-size: 1.5rem;
}
.personalMsg-content-detail-data {
  display: flex;
  align-items: center;
  padding: 1rem;
}
.personalMsg-content-detail-data > div {
  width: 33.333%;
  text-align: center;
}
.personalMsg-content-detail-data > div p {
  font-size: 1.2rem;
}
.personalMsg-content-detail-data > div:not(:last-child) {
  border-right: 1px solid #e3e3e3;
}
.created-playlist,
.favorite-playlist {
  padding: 1rem 0;
}
.created-playlist-item,
.favorite-playlist-item {
  float: left;
  height: 15rem;
  padding-bottom: 1rem;
  cursor: pointer;
}
.created-playlist-item>a,
.favorite-playlist-item>a{
  display: block;
  position: relative;
}
.listener-num{
  position: absolute;
  background-image: linear-gradient(to left, gray ,transparent);
  width: 80%;
  padding-right: 0.5rem;
  right: 0;
  top: 0;
  text-align: right;
  color: white;
}
.listener-num>img{
  width: 1.4rem !important;
  height: 1.4rem !important;
}
.listener-num img,
.listener-num label{
  display: inline-block;
  vertical-align: middle;
}

.created-playlist-item img,
.favorite-playlist-item img {
  width: 100%;
  height: 10rem;
}
.created-playlist-item span,
.favorite-playlist-item span {
  display: block;
  height: 4rem;
  overflow: hidden;
}
</style>