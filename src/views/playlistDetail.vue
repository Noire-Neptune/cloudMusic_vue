<template>
  <div class="content">
    <!--  :style="{height: (loading ? `${contentHeight}px` : `auto`),overflow: loading ? `hidden` : `auto`}" -->
    <playlist-introduce-component
      :introduceMsg="introduceMsg"
    ></playlist-introduce-component>
    <play-table
      :musicId="musicId"
      :songListRes="songListRes"
      :isGeDan="isGeDan"
      @songMsg="getSong"
      @songList="songList"
      @hideLoading="hideLoading"
    ></play-table>
    <loading-component ref="loading"></loading-component>
  </div>
</template>

<script>
import playTable from "../components/playTable.vue";
import playlistIntroduceComponent from "../components/playlistIntroduceComponent.vue";
export default {
  props: ["musicId", "contentHeight"],
  data() {
    return {
      songListRes: [],
      playListId: "", //歌单id
      isGeDan: true, //是否为歌单,
      introduceMsg: {}, //歌单介绍信息
    };
  },
  created() {},
  mounted() {
    //如果传来歌单id则表示是搜索歌单,否则就是每日推荐
    if (this.$route.query.id) {
      this.getPlayRes();
    } else {
      this.getDailyRecommend();
    }
  },
  methods: {
    //获取歌单歌曲详情(即歌曲的id集合)
    getPlayRes() {
      this.playListId = this.$route.query.id;
      this.$refs.loading.show();
      this.g
        .axios({
          url: this.g.host + "/playlist/detail",
          params: {
            id: this.playListId,
          },
        })
        .then((res) => {
          console.log("歌单页", res);
          this.isGeDan = true;
          this.songListRes = res.data.playlist;
          let isCollected = false;
          for (let item of this.g.userPlayListIds) {
            //查找该歌单是否收藏
            if (item == this.playListId) {
              isCollected = true;
              break;
            }
          }
          this.introduceMsg = {
            id: this.playListId, //歌单id
            img: res.data.playlist.coverImgUrl, //封面
            name: res.data.playlist.name, //名称
            createTime: new Date(res.data.playlist.createTime), //创建时间
            description: res.data.playlist.description, //介绍
            creatorNickName: res.data.playlist.creator.nickname, //创建者昵称
            creatorImg: res.data.playlist.creator.avatarUrl, //创建者头像
            creatorId: res.data.playlist.creator.userId, //创建者用户id
            isCollected: isCollected, //歌单的收藏状态
          };
        })
        .catch((err) => {
          this.$refs.loading.hide();
          console.log(err);
        });
    },
    //获取每日推荐详情
    getDailyRecommend() {
      this.$refs.loading.show();
      this.g
        .axios({
          url: this.g.host + "/recommend/songs",
        })
        .then((res) => {
          console.log("获取每日推荐歌曲", res);
          this.isGeDan = false;
          this.songListRes = res.data.data.dailySongs;
        })
        .catch((err) => {
          this.$refs.loading.hide();
          console.log(err);
        });
    },
    //将组件中的值传到父路由中,获取歌曲信息传到index页面
    getSong(id, singer, zhuanji, index) {
      this.$emit("songMsg", id, singer, zhuanji, index);
    },
    songList(songList) {
      this.$emit("songList", songList);
    },
    hideLoading() {
      this.$refs.loading.hide();
    },
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      if (to.query.id != from.query.id) {
        //如果传来歌单id则表示是搜索歌单,否则就是每日推荐
        if (this.$route.query.id) {
          this.getPlayRes();
        } else {
          this.getDailyRecommend();
        }
      }
    },
  },
  components: {
    playTable,
    playlistIntroduceComponent,
  },
};
</script>

<style src='../css/views/playlistDetail.css' scoped>
</style>