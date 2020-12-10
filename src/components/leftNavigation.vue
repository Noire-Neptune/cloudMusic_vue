<template>
  <!-- :style="{ height: drawerHeight + 'px' }" -->
  <div class="content" :class="{ showDrawer: showDrawer }">
    <router-link to="/">
      <div class="content-btns">
        <img src="../img/music.png" /><span>发现音乐</span>
      </div>
    </router-link>
    <router-link :to="{ path: '/play', query: { fm: 1 } }">
      <div class="content-btns">
        <img src="../img/FM.png" /><span>私人FM</span>
      </div>
    </router-link>
    <div class="content-btns">
      <img src="../img/video.png" /><span>视频</span>
    </div>
    <div class="content-btns">
      <img src="../img/friends.png" /><span>朋友</span>
    </div>
    <router-link :to="{ path: '/playlistDetail' }">
      <div class="content-btns">
        <img src="../img/dailyRecommend.png" /><span>每日推荐</span>
      </div>
    </router-link>
    

    <div class="content-title">
      <span>创建的歌单</span
      ><span
        class="icon-sanjiao iconfont"
        @click="openCreate"
        :style="{ transform: packUpCreate ? 'rotate(0deg)' : 'rotate(90deg)' }"
      ></span>
    </div>
    <div
      class="content-playlists"
      :style="{ display: packUpCreate ? 'none' : 'block' }"
    >
      <router-link
        class="content-playlists-item"
        v-for="(item, i) of createPlaylists"
        :key="i"
        :to="{ path: '/playlistDetail', query: { id: item.id } }"
      >
        <img src="../img/playlist.png" alt="歌单" />
        <span :style="{width: i==0 ? 'calc(100% - 6rem)' : 'calc(100% - 1.4rem)'}">{{ item.name }}</span>
        <div v-if="i==0" class="heart" @click="enterHeart(item.id,$event)" :class="{'heart-shandong' : heartModel}">
          <span class="iconfont icon-huaban"></span>
        </div>
      </router-link>
    </div>
    <div class="content-title">
      <span>收藏的歌单</span
      ><span
        class="icon-sanjiao iconfont"
        @click="openFav"
        :style="{ transform: packUpFav ? 'rotate(0deg)' : 'rotate(90deg)' }"
      ></span>
    </div>
    <div
      class="content-playlists"
      :style="{ display: packUpFav ? 'none' : 'block' }"
    >
      <router-link
        class="content-playlists-item"
        v-for="(item, i) of collectPlaylists"
        :key="i"
        :to="{ path: '/playlistDetail', query: { id: item.id } }"
      >
        <img src="../img/playlist.png" alt="歌单" />
        <span>{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDrawer: true,
      createPlaylists: [], //创建的歌单
      collectPlaylists: [], //收藏的歌单
      packUpCreate: false, //收起创建的歌单状态,false为未收起
      packUpFav: false, //收起收藏的歌单状态,false为未收起
      heartModel:false,//心动模式是否开启
      heartPlaylist:[],//心动模式歌曲
    };
  },
  mounted() {
    this.getCollectLists();
  },
  methods: {
    //小屏下左侧抽屉显示
    drawerShow() {
      if (this.showDrawer) {
        this.showDrawer = false;
      } else {
        this.showDrawer = true;
      }
    },
    // 获取用户收藏/新建的歌单 参数:用户id
    getCollectLists() {
      this.g
        .axios({
          url: this.g.host + "/user/playlist",
          params: {
            uid: this.g.userId,
            limit: 10000,
          },
        })
        .then((res) => {
          console.log("获取用户歌单", res);
          this.g.userPlayListIds = [];
          for (let item of res.data.playlist) {
            this.g.userPlayListIds.push(item.id);
            if (!item.subscribed) {
              this.createPlaylists.push(item);
            } else {
              this.collectPlaylists.push(item);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openCreate() {
      this.packUpCreate = !this.packUpCreate;
    },
    openFav() {
      this.packUpFav = !this.packUpFav;
    },
    enterHeart(favlistId,e){//心动模式,参数始终为喜欢的音乐的歌单id
    e.preventDefault()
    this.heartModel=!this.heartModel;
      this.g
        .axios({
          url: "/playmode/intelligence/list",
          params: {
            id: this.g.music.id,//当前歌曲id
            pid:favlistId
          },
        })
        .then((res) => {
          console.log("心动模式歌单", res);
          for(let item of res.data.data){
             this.heartPlaylist.push(item.songInfo)
          }
          this.$emit("songList", this.heartPlaylist);
          this.$emit("songMsg", this.heartPlaylist[0].id, this.heartPlaylist[0].ar, this.heartPlaylist[0].al.name, 0);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style src='../css/components/leftNavigation.css' scoped></style>