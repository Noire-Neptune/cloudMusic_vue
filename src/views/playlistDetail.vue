<template>
  <div
    class="content"
   
  >
  <!--  :style="{height: (loading ? `${contentHeight}px` : `auto`),overflow: loading ? `hidden` : `auto`}" -->
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
export default {
  props: ["musicId", "contentHeight"],
  data() {
    return {
      songListRes: [],
      playListId: "", //歌单id
      isGeDan: true, //是否为歌单
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
      this.g.axios({
        url: this.g.host + "/playlist/detail",
        params: {
          id: this.playListId,
        },
      })
        .then((res) => {
          console.log("歌单页", res);
          this.isGeDan = true;
          this.songListRes = res.data.playlist;
        })
        .catch((err) => {
           this.$refs.loading.hide();
          console.log(err);
        });
    },
    //获取每日推荐详情
    getDailyRecommend() {
      this.$refs.loading.show();
      this.g.axios({
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
     hideLoading(){
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
  },
};
</script>

<style scoped>
.content {
  padding: 1.5rem;
  height: 100% !important;
  overflow: auto;
}
</style>