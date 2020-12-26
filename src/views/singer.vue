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
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="专辑" name="album">
        <div class="album">
          <div
            class="album-item clearfix"
            v-for="(item, i) of albumArr"
            :key="i"
          >
            <div class="album-item-imgCon">
              <img v-lazy="item.picUrl" />
              <span>{{ g.getTimeStr(item.publishTime) }}</span>
            </div>
            <div class="album-item-songCon">
              <play-table
                :musicId="g.music.id"
                :songListRes="item.songs"
                :isGeDan="false"
              ></play-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import playTable from "../components/playTable.vue";
export default {
  data() {
    return {
      id: 0, //歌手id
      limit: 8, //一页数量
      page: 1, //当前页数
      singerMsg: {}, //歌手信息
      albumArr: [], //专辑
      isCollect: false, //是否收藏
      activeTab: "album", //当前显示的tab页
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getMsg();
  },
  methods: {
    //获取歌手专辑信息
    getMsg() {
      this.g
        .axios({
          url: "/artist/album",
          params: {
            id: this.id,
            limit: this.limit,
            offset: (this.page - 1) * this.limit, //从第几个开始取,用于分页
          },
        })
        .then((res) => {
          console.log(this.g.p(res));
          this.singerMsg = res.data.artist;
          console.log(this.singerMsg.alias.join());
          this.albumArr = this.albumArr.concat(res.data.hotAlbums);
          let promiseArr = [];
          for (let item of this.albumArr) {
            promiseArr.push(this.getAlbumSongs(item.id));
          }
          Promise.all(promiseArr)
            .then((res) => {
              console.log(res);
              //获取到歌单音乐后将音乐放入歌单数组中,方便渲染
              for (let item of this.albumArr) {
                for (let itemj of res) {
                  if (item.id == itemj.data.album.id) {
                    item.songs = itemj.data.songs;
                  }
                }
              }
              console.log(this.g.p(this.albumArr));
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //收藏
    collect() {},
    //获取专辑歌曲,传递歌单id
    getAlbumSongs(albumId) {
      return new Promise((resolve, reject) => {
        this.g
          .axios({
            url: "/album",
            params: {
              id: albumId,
            },
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    //tab切换事件,返回当前tab对象, e
    handleClick(tab, event) {
      //this.activeTab代表第几个tab
      console.log(tab, event, this.activeTab);

      switch (this.activeTab) {
        case "album": //专辑
          break;
        case "singer":
          break;
        case "zhuanji":
          break;
        case "video":
          break;
        case "gedan":
          break;
        default:
          break;
      }
    },
  },
  computed: {},
  components: {
    playTable,
  },
};
</script>

<style scoped src="../css/views/singer.css">
</style>