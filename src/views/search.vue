<template>
  <div class="content">
    <div class="searchInputContent">
      <input
        type="text"
        placeholder="搜索音乐,视频,电台,专辑..."
        v-model="searchVal"
      />
      <button @click="search"></button>
    </div>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="歌曲" name="song">
        <button @click="showMoreSong">展示更多</button>
        <play-table
          :songListRes="songListRes.songList"
          :musicId="musicId"
          :isGeDan="false"
          @songMsg="getSong"
          @songList="songList"
          @hideLoading="hideLoading"
        ></play-table>
      </el-tab-pane>
      <el-tab-pane label="歌手" name="singer">
        <div class="singer-content">
          <div class="content-sum">共找到{{ artist.artistCount }}位歌手</div>
          <div
            class="singer-content-item"
            v-for="(item, i) of artist.artistList"
            :key="i"
            :style="{
              backgroundColor: i % 2 == 0 ? 'white' : 'rgb(224,224,224)',
            }"
          >
            <img
              :src="item.picUrl ? item.picUrl : item.img1v1Url"
              alt="歌手图片"
            />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专辑" name="zhuanji">
        <div class="zhuanji-content">
          <div class="content-sum">共找到{{ albums.albumsCount }}个专辑</div>
          <div
            class="zhuanji-content-item"
            v-for="(item, i) of albums.albumsList"
            :key="i"
            :style="{
              backgroundColor: i % 2 == 0 ? 'white' : 'rgb(224,224,224)',
            }"
            @click="showAlbum(item.id)"
          >
            <img
              :src="item.picUrl ? item.picUrl : item.img1v1Url"
              alt="专辑图片"
            />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="gedan">
        <div class="gedan-content">
          <div class="content-sum">共找到{{ gedan.gedanCount }}个歌单</div>
          <div
            class="gedan-content-item"
            v-for="(item, i) of gedan.gedanList"
            :key="i"
            :style="{
              backgroundColor: i % 2 == 0 ? 'white' : 'rgb(224,224,224)',
            }"
            @click="showGedan(item.id)"
          >
            <img :src="item.coverImgUrl" alt="专辑图片" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video"></el-tab-pane>
    </el-tabs>
    <loading-component ref="loading"></loading-component>
  </div>
</template>

<script>
import playTable from "../components/playTable.vue";
export default {
  props: ["musicId"],
  data() {
    return {
      songListRes: { songCount: 0, songList: [], loadStatus: false }, //搜索到的歌曲,songCount:总数,songList:歌曲数组,loadStatus:是否第一次加载(防止二次加载重复数据)
      artist: { artistCount: 0, artistList: [], loadStatus: false }, //歌手列表
      albums: { albumsCount: 0, albumsList: [], loadStatus: false }, //专辑列表
      gedan: { gedanCount: 0, gedanList: [], loadStatus: false }, //歌单列表
      activeTab: "song",
      page: 1,
      searchVal: "", //搜索词
    };
  },
  created() {},
  mounted() {
    this.getSearchMusic();
  },
  methods: {
    getSearchMusic(activeTab, type) {
      var ajaxMsg = {
        url: this.g.host + "/search",
        params: {
          keywords: this.$route.query.searchVal,
          type: type,
          limit: 30,
          offset: (this.page - 1) * 30,
        },
      };

      switch (this.activeTab) {
        case "song": //歌曲
          
          if (!this.songListRes.loadStatus) {
            this.$refs.loading.show();
            this.g
              .axios(ajaxMsg)
              .then((res) => {
                console.log("搜索歌曲", res);

                this.songListRes.loadStatus = true;
                this.songListRes.songList = this.songListRes.songList.concat(
                  res.data.result.songs
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
          break;
        case "singer": //歌手
          this.g
            .axios(ajaxMsg)
            .then((res) => {
              console.log("搜索歌手", res);
              if (!this.artist.loadStatus) {
                this.artist.loadStatus = true;
                this.artist.artistCount = res.data.result.artistCount;
                this.artist.artistList = this.artist.artistList.concat(
                  res.data.result.artists
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        case "zhuanji": //专辑
          this.g
            .axios(ajaxMsg)
            .then((res) => {
              console.log("搜索专辑", res);
              if (!this.albums.loadStatus) {
                this.albums.loadStatus = true;
                this.albums.albumsCount = res.data.result.albumsCount;
                this.albums.albumsList = this.albums.albumsList.concat(
                  res.data.result.albums
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        case "video": //视频
          console.log("搜索视频", res);
          break;
        case "gedan": //歌单
          this.g
            .axios(ajaxMsg)
            .then((res) => {
              console.log("搜索歌单", res);
              if (!this.gedan.loadStatus) {
                this.gedan.loadStatus = true;
                this.gedan.gedanCount = res.data.result.playlistCount;
                this.gedan.gedanList = this.gedan.gedanList.concat(
                  res.data.result.playlists
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        default:
          break;
      }
    },
    //将组件中的值传到父路由中
    getSong(id, singer, zhuanji, index) {
      this.$emit("songMsg", id, singer, zhuanji, index);
    },
    songList(songList) {
      this.$emit("songList", songList);
    },
    //tab切换事件返回当前tab对象, e
    handleClick(tab, event) {
      //this.activeTab代表第几个tab
      console.log(tab, event, this.activeTab);
      //默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
      switch (this.activeTab) {
        case "song": //歌曲
          this.getSearchMusic(this.activeTab, 1);
          break;
        case "singer": //歌手
          this.getSearchMusic(this.activeTab, 100);
          break;
        case "zhuanji": //专辑
          this.getSearchMusic(this.activeTab, 10);
          break;
        case "video": //视频
          this.getSearchMusic(this.activeTab, 1014);
          break;
        case "gedan": //歌手
          this.getSearchMusic(this.activeTab, 1000);
          break;
        default:
          break;
      }
    },
    //点击专辑, 跳转专辑页
    showAlbum(id) {
      this.$router.push({
        path: "/album",
        query: {
          id: id,
        },
      });
    },
    //点击歌单, 跳转歌单页
    showGedan(id) {
      this.$router.push({
        path: "/playlist",
        query: {
          id: id,
        },
      });
    },
    //展示更多歌曲
    showMoreSong() {
      this.page++;
      this.getSearchMusic();
    },
    //搜索
    search() {
      this.$router.push({
        path: "/search",
        query: {
          searchVal: this.searchVal,
        },
      });
    },
    hideLoading() {
      this.$refs.loading.hide();
    },
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      if (to.query.searchVal != from.query.searchVal) {
        var searchVal = this.searchVal;
        // 将加载状态重置为未加载状态,直接改变data的数据为初始状态
        Object.assign(this.$data, this.$options.data());
        this.searchVal = searchVal;
        this.getSearchMusic();
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
  height: 100%;
  overflow: auto;
}
/* 搜索区域 */
.searchInputContent {
  padding-bottom: 1rem;
  text-align: center;
}
.searchInputContent input {
  width: calc(100% - 2.3rem);
  height: 2.3rem;
  border-radius: 2rem 0 0 2rem;
  border: 1px solid #e3e3e3;
  border-right: 0;
  padding: 3px 5px;
  vertical-align: middle;
}
.searchInputContent button {
  width: 2.3rem;
  border-radius: 0 2rem 2rem 0;
  height: 2.3rem;
  border: 1px solid #e3e3e3;
  border-left: 0;
  background-color: white;
  background-image: url("../img/search.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1.4rem 1.4rem;
  vertical-align: middle;
}
.content-sum {
  padding: 1rem;
  text-align: center;
}
/* 歌手区域 */
.singer-content-item,
.zhuanji-content-item,
.gedan-content-item {
  padding: 0.8rem;
}
.singer-content-item > span,
.singer-content-item > img,
.zhuanji-content-item > span,
.zhuanji-content-item > img,
.gedan-content-item > span,
.gedan-content-item > img {
  display: inline-block;
  vertical-align: middle;
}
.singer-content-item > img,
.zhuanji-content-item > img,
.gedan-content-item > img {
  width: 10rem;
  height: 10rem;
}
.singer-content-item > span,
.zhuanji-content-item > span,
.gedan-content-item > span {
  padding-left: 0.5rem;
}
</style>