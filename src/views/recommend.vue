<template>
  <div class="content">
    <div class="recommend-banner">
      <el-carousel :interval="4000" type="card" height="18rem">
        <el-carousel-item v-for="(item,i) of bannerList" :key="i">
            <img :src="item.imageUrl" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 推荐歌单 -->
    <div class="recommend-title">推荐歌单</div>
    <div class="recommend-playlist clearfix">
      <div class="recommend-playlist-item" v-for="(item,i) of rePlayList" :key="i">
        <router-link :to="{name:'playlist',query:{id:item.id}}">
          <img :src="item.picUrl">
        <span>{{item.name}}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [],
      rePlayList:[],//推荐歌单
    };
  },
  created() {
    this.getBanner(() => {
      this.getRecommendPlayList(() => {});
    });
  },
  mounted() {},
  methods: {
    //获取推荐歌单
    getRecommendPlayList(success) {
      this.g.axios({
        url: this.g.host + "/recommend/resource",
      })
        .then(res => {
          console.log("获取推荐歌单", res);
          this.rePlayList=res.data.recommend;
          if (success) {
            success();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取轮播图banner
    getBanner(success) {
      this.g.axios({
        url: this.g.host + "/banner"
      })
        .then(res => {
          console.log("获取轮播图banner", res);
          this.bannerList=res.data.banners
          if (success) {
            success();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
@media screen and (min-width:1921px){
  .recommend-playlist-item{
    width: 12.5%;
    padding: 0 calc(6.25% - 5rem) ;
}
}
@media screen and (min-width: 1601px) and (max-width: 1920px) {
  .recommend-playlist-item{
    width: 12.5%;
    padding: 0 calc(6.25% - 5rem) ;
}
}
@media screen and (min-width: 1367px) and (max-width: 1600px) {
  .recommend-playlist-item{
    width: 16.666%;
    padding: 0 calc(8.333% - 5rem) ;
}
}
@media screen and (min-width: 1025px) and (max-width: 1366px) {
 .recommend-playlist-item{
    width: 16.666%;
    padding: 0 calc(8.333% - 5rem) ;
}
}
/* 平板尺寸 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .recommend-playlist-item{
    width: 25%;
    padding: 0 calc(12.5% - 5rem) ;
}
}
@media screen and (min-width: 450px) and (max-width: 767px) {
  .recommend-playlist-item{
    width: 33.3333%;
    padding: 0 calc(16.6665% - 5rem) ;
}
}
@media screen and (max-width: 449px) {
   .recommend-playlist-item{
    width: 50%;
    padding: 0 calc(25% - 5rem) ;
}
}
.content{
    height: 100%;
    padding: 1.5rem;
    padding-bottom: 0;
    overflow: auto;
}
.recommend-banner{
    height: 18rem;
    padding: 0 6rem;
}
.recommend-banner img{
    width: 100%;
    height: 100%;
}
.recommend-playlist{
    padding: 2rem 0;
}
.recommend-playlist-item{
    float: left;
    height: 15rem;
    padding-bottom: 1rem;
    cursor: pointer;
}
.recommend-playlist-item img{
    width: 100%;
    height: 10rem;
    border-radius: 0.4rem;
}
.recommend-playlist-item span{
    display: block;
    height: 4rem;
    overflow: hidden;
}
.recommend-title{
  border-bottom: 1px solid #e3e3e3;
  padding: 0.5rem;
  padding-top: 0;
  font-size: 1.5rem;
}

</style>