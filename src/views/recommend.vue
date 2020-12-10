<template>
  <div class="content" ref="recommendContent">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="个性推荐" name="recommend">
        <div class="recommend-banner">
          <el-carousel :interval="4000" type="card" height="18rem">
            <el-carousel-item v-for="(item, i) of bannerList" :key="i">
              <img v-lazy="item.imageUrl" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 推荐歌单 -->
        <div class="recommend-title">推荐歌单</div>
        <playlists-component
          :playLists="rePlayList"
          :playListShow="playListShow.recommend"
          idKey="id"
          playCountKey="playcount"
          imgKey="picUrl"
          nameKey="name"
        ></playlists-component>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="playlists">
        <recommend-playLists></recommend-playLists>
      </el-tab-pane>
      <el-tab-pane label="电台" name="broad"></el-tab-pane>
      <el-tab-pane label="排行榜" name="rank"></el-tab-pane>
      <el-tab-pane label="歌手" name="singer"></el-tab-pane>
      <el-tab-pane label="最新音乐" name="newsongs"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import playlistsComponent from "../components/playilistsComponent";
import recommendPlayLists from "../components/recommend_playlists";
export default {
  data() {
    return {
      bannerList: [],
      rePlayList: [], //推荐歌单
      activeTab: "recommend", //当前tab页
      playListShow: {
        //歌单是否已经淡入出现
        recommend: false, //推荐歌单
      },
    };
  },
  created() {
    this.getBanner(() => {
      this.getRecommendPlayList(() => {
        var t = setTimeout(() => {
          this.playListShow.recommend = true;
          clearTimeout(t);
        }, 0);
      });
    });
  },
  mounted() {},
  methods: {
    //获取推荐歌单
    getRecommendPlayList(success) {
      this.g
        .axios({
          url: this.g.host + "/recommend/resource",
        })
        .then((res) => {
          console.log("获取推荐歌单", res);
          this.rePlayList = res.data.recommend;
          if (success) {
            success();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取轮播图banner
    getBanner(success) {
      this.g
        .axios({
          url: this.g.host + "/banner",
        })
        .then((res) => {
          console.log("获取轮播图banner", res);
          this.bannerList = res.data.banners;
          if (success) {
            success();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //切换tab页触发事件
    handleClick() {},
  },
  components: {
    playlistsComponent,
    recommendPlayLists,
  },
};
</script>

<style src='../css/views/recommend.css' scoped>
</style>