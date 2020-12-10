<template>
  <div class="content">
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
      albumId: "", //专辑id
      isGeDan: true, //是否为歌单/专辑页
    };
  },
  created() {},
  mounted() {
    this.isGeDan = "zhuanji";
    this.getPlayRes();
  },
  methods: {
    //获取专辑歌曲详情(即歌曲的id集合)
    getPlayRes() {
      this.albumId = this.$route.query.id;
      this.$refs.loading.show();
      this.g
        .axios({
          url: this.g.host + "/album",
          params: {
            id: this.albumId,
          },
        })
        .then((res) => {
          console.log("专辑页", res);
          //组织传到歌单组件的参数
          this.songListRes = {
            coverImgUrl: res.data.album.picUrl, //封面
            name: res.data.album.name, //名称
            description: res.data.album.description, //介绍
            trackIds: res.data.songs,
          };
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
        this.getPlayRes();
      }
    },
  },
  components: {
    playTable,
  },
};
</script>

<style src='../css/views/album.css' scoped></style>