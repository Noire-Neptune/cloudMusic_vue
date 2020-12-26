<template>
  <div class="content">
    <div class="singer clearfix">
      <img class="singer-img" v-lazy="singerMsg.picUrl" />
      <div class="introduce">
        <div class="introduce-title">{{ singerMsg.name }}</div>
        <!-- 别名 -->
        <div class="introduce-alias">
          {{ singerMsg.alias ? singerMsg.alias.join() : "" }}
        </div>
        <div class="collectBtn" @click="collect">
          <img
            :src="
              isCollect
                ? require('../img/like.png')
                : require('../img/unlike.png')
            "
          /><span>收藏</span>
        </div>
        <div class="introduce-sum">
          <span>单曲数: {{ singerMsg.musicSize }}</span>
          <span>专辑数: {{ singerMsg.albumSize }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 0, //歌手id
      limit: 20, //一页数量
      page: 1, //当前页数
      singerMsg: {}, //歌手信息
      albumArr: [], //专辑
      isCollect: false, //是否收藏
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getMsg();
  },
  methods: {
    getMsg() {
      this.g
        .axios({
          url: "/artist/album",
          params: {
            id: this.id,
            limit: 20,
            offset: (this.page - 1) * this.limit, //从第几个开始取,用于分页
          },
        })
        .then((res) => {
          console.log(this.g.p(res));
          this.singerMsg = res.data.artist;
          console.log(this.singerMsg.alias.join());
          this.albumArr = this.albumArr.concat(res.data.hotAlbums);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    collect() {
      //收藏
    },
  },
  computed: {},
};
</script>

<style scoped src="../css/views/singer.css">
</style>