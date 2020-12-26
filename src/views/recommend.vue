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
        <div class="recommend-title">最新音乐</div>
        <div class="recommend-newMusic">
          <div
            class="recommend-newMusic-item"
            v-for="(item, i) of newMusicArr"
            :key="i"
            @click="play(item.id, item.artists, item.album.name, i)"
          >
            <img
              class="recommend-newMusic-item-img"
              v-lazy="item.picUrl"
              alt="新音乐"
            />
            <div class="recommend-newMusic-item-msg">
              <div class="recommend-newMusic-item-msg-title">
                {{ item.name }}&nbsp;&nbsp;{{ item.alias.join() }}
              </div>
              <div class="recommend-newMusic-item-msg-singer">
                <span v-for="(itemj, j) of item.artists" :key="j"
                  >{{ itemj.name
                  }}{{ j == item.artists.length - 1 ? "" : ", " }}</span
                >
              </div>
            </div>
          </div>
        </div>
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
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      bannerList: [],
      rePlayList: [], //推荐歌单
      activeTab: "recommend", //当前tab页
      newMusicArr: [], //新音乐
      playListShow: {
        //歌单是否已经淡入出现
        recommend: false, //推荐歌单
      },
    };
  },
  created() {},
  mounted() {
    this.getBanner(() => {
      this.getRecommendPlayList(() => {
        var t = setTimeout(() => {
          //宏任务
          this.playListShow.recommend = true;
          clearTimeout(t);
        }, 0);
      });
    });
    this.getNewMusic();
  },
  methods: {
    ...mapMutations(["setMusicMsg"]),
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
    //获取最新歌曲
    getNewMusic() {
      this.g
        .axios({
          url: "/personalized/newsong",
        })
        .then((res) => {
          console.log("新音乐r", res);
          //this.newMusicArr = res.data.banners;
          let arr = [];
          for (let item of res.data.result) {
            arr.push({ ...{ picUrl: item.picUrl }, ...item.song });
          }
          console.log(arr);
          this.newMusicArr = arr;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    play(id, singer, zhuanji, index) {
      this.setMusicMsg({
        id: id,
        singer: singer,
        zhuanji: zhuanji,
        index: index,
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