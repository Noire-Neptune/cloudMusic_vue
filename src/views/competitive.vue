<template>
  <div class="content">
      <div class="cometitive-title">精品歌单</div>
      <column-layout-component :data="playLists" idField="id" imgField="coverImgUrl" enterUrl="/playlistDetail"></column-layout-component>
  </div>
</template>

<script>
import columnLayoutComponent from '../components/columnLayoutComponent.vue';
export default {
data() {
    return {
      tag:0,
      playLists:[]
    }
  },
  mounted(){
      this.tag=this.$route.query.tag;
      this.getCompetitivePlayLists()
  },
  methods:{
      getCompetitivePlayLists(){//获取精品歌单
          this.g
        .axios({
          url: "/top/playlist/highquality",
          params: {
            cat: this.tag,
          },
        })
        .then((res) => {
          this.g.print("精品歌单", res);
         this.playLists=res.data.playlists
        })
        .catch((err) => {
          console.log(err);
        });
      }
  },
  watch:{
      $route(to, from) {
      //监听路由是否变化
      if (to.query.tag != from.query.tag) {
          this.getCompetitivePlayLists();
      }
    },
  },
  components:{
      columnLayoutComponent
  }
}
</script>

<style scoped>
.content {
  padding: 1.5rem;
  height: 100% !important;
  overflow: auto;
}
.cometitive-title {
  border-bottom: 1px solid #e3e3e3;
  padding: 0.5rem;
  padding-top: 0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}



</style>